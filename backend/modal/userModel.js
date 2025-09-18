import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        minLength: [8, "Password must have atleast 8 characters"],
        maxLength: [10, "Password cannot have more than 10 characters"],
        select: false                           // from doing 'select: false', we will not be able to get user password in frontend (security reasons)
    },
    phone: String,
    accountVerified: { type: Boolean, default: false },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}); 

// hashing password
userSchema.pre("save",  async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function() {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;         // math.random() generates value in points(0.5, 0.6)
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, 0);

        return parseInt(firstDigit + remainingDigits);
    }

    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000           // the verification code will expire in 5 mins

    return verificationCode;
};

userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {                                             // sign() is used to generate JWT tokens
        expiresIn: process.env.JWT_EXPIRE
    })     
}

userSchema.methods.generateResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex"); 

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

export const User = mongoose.model("User", userSchema);