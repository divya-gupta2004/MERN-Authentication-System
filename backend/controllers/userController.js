import { config } from "dotenv";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../modal/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";


// console.log("TWILIO_SID:", process.env.TWILIO_SID);
// console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);

// console.log("Twilio client created successfully");

// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

export const register = catchAsyncError(async (req, res, next) => {
    try {

        const {name, email, phone, password, verificationMethod} = req.body;

        if (!name || !email || !phone || !password || !verificationMethod) {
            return next (new ErrorHandler("All fields are required", 400));
        }

        // validating phone number using 'Regex'
        function validatePhoneNumber(phone) {
            const phoneRegex = /^\+91\d{10}$/;             // this code is according to each country phone number code 
            return phoneRegex.test(phone);
        }

        if(!validatePhoneNumber(phone)) {
            return next(new ErrorHandler("Invalid phone number", 400));
        }

        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true,
                },
                {
                    phone,
                    accountVerified: true,
                },
            ],
    });

    if(existingUser) {
        return next(new ErrorHandler("Phone or Email is already used", 400));
    }

    const registrationAttemptsByUser = await User.find({
        $or: [
            { phone, accountVerified: false},
            { email, accountVerified: false},
        ], 
    });
    
    if(registrationAttemptsByUser.length > 3) {
        return next(new ErrorHandler("You have exceeded the maximum number of attempts (3). Please try again after an hour.", 400));
    }

    // store in database
    const userData = {
        name, 
        email,
        phone,
        password
    };

    const user = await User.create(userData);      // storing userData

    const verificationCode = await user.generateVerificationCode();
    await user.save();

    sendVerificationCode(verificationMethod, verificationCode, name, email, phone, res);
   
    } catch (error) {
        next(error);        
    }
});

async function sendVerificationCode(verificationMethod, verificationCode, name, email, phone, res) {

    try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

        if(verificationMethod === "email") {
            const message = generateEmailTemplate(verificationCode);
            sendEmail({email, subject: "Your Verification Code", message});
            res.status(200).json({
                success: true,
                message: `Verification email successfully sent to ${name}`,
            });
        } else if (verificationMethod === "phone") {
            const verificationCodeWithSpace = verificationCode.toString().split("").join(" ");                              // split("") method will convert it into array format and then sub-strings will be added ; join(" ") - this will join all the sub-strings with spaces (eg: 6 7 7 8 9)
            await client.calls.create({
                twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
                from: process.env.TWILIO_PHONE,
                to: phone,
            });
            res.status(200).json({
                success: true,
                message: "OTP sent",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Invalid verification method"
            }) 
        }
        
    } catch (error) {
        // console.error("Twilio Call Error");
        // console.error("Code:", error.code);
        // console.error("Message:", error.message);
        // console.error("More Info:", error.moreInfo);

        return res.status(500).json({
            success: false,
            message: "Verification code failed to send",
            error: error.message,                               // return Twilio error message
            code: error.code,                                  // Twilio error code
            info: error.moreInfo                               // Twilio docs link
        });         
    }   
}

function generateEmailTemplate(verificationCode) {
    return `    
    <div style="max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center;">
      
      <h2 style="color: #333333; margin-bottom: 20px; font-size: 22px;">Email Verification</h2>
      
      <p style="color: #555555; font-size: 15px; margin-bottom: 20px;">
        Use the verification code below to complete your sign-in or registration:
      </p>
      
      <div style="font-size: 28px; font-weight: bold; color: #2a7dfc; letter-spacing: 6px; margin: 20px 0; padding: 15px; background: #f1f5ff; border-radius: 8px; display: inline-block;">
        ${verificationCode}
      </div>
      
      <p style="color: #555555; font-size: 15px; margin-bottom: 20px;">
        This code will expire in <strong>10 minutes</strong>. Do not share it with anyone for security reasons.
      </p>
      
      <div style="font-size: 13px; color: #888888; margin-top: 30px;">
        If you didn’t request this, you can safely ignore this email.
      </div>
      
    </div>`;
}

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  // Validate phone number (example: Indian numbers)
  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return next(new ErrorHandler("Invalid phone number", 400));
  }

  // Fetch the latest unverified user
  const userAllEntries = await User.find({
    $or: [
      { email, accountVerified: false },
      { phone, accountVerified: false }
    ]
  }).sort({ createdAt: -1 });

  if (!userAllEntries || userAllEntries.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  const user = userAllEntries[0];

  // Optional: Remove older unverified duplicates
  if (userAllEntries.length > 1) {
    await User.deleteMany({
      _id: { $ne: user._id },
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false }
      ]
    });
  }

  // Debug logs
//   console.log("OTP from frontend:", otp);
//   console.log("OTP saved in DB:", user.verificationCode);

  // Check OTP
  if (user.verificationCode !== Number(otp)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  // Check OTP expiry
  const currentTime = Date.now();
  const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();
  if (currentTime > verificationCodeExpire) {
    return next(new ErrorHandler("OTP expired", 400));
  }

  // Update user as verified
  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;
  await user.save({ validateModifiedOnly: true });

  // Send auth cookie and response
  sendToken(user, 200, "Account verified successfully", res);
});

export const login = catchAsyncError( async (req, res, next) => {

    const { email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorHandler("Email and Password are required", 400));
    }

    // checking if we have the user of this email once the user is logged in
    const user = await User.findOne({email, accountVerified: true}).select("+password");                             // to compare password, we will use '.select("+password")' , inside select() , we will write that field name in which we have done false in userModel.js 

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, "User Logged in successfully", res);

});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("authToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,           
    }).json ({
        success: true,
        message: "Logged out successfully",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email, accountVerified: true})


    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save({validateBeforeSave: false});
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`

    try {
        sendEmail({
            email: user.email,
            subject: "MERN Authentication App Reset Password",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message ? error.message: "Cannot send reset password token", 500));        
    }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if(!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match", 400))
    }

    // when everything matches
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, "Reset password successfully", res); 
})



