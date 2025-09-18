export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();
    // console.log(token)

    res.status(statusCode).cookie("authToken", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,    // true if using HTTPS
        sameSite: "lax", // important for frontend-backend cross origin
        path: "/",  
    }).json({
        success: true, 
        user,
        message,
        token        
    });

}