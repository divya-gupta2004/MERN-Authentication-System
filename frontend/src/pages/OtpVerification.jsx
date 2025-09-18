import React, { useContext, useState } from "react";
import "../styles/OtpVerification.css";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const OtpVerification = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const { email, phone } = useParams();

  // Initialize 5 input fields
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input automatically
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle backspace to previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Verify OTP
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 5) {
      toast.error("Please enter the full 5-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4001/api/v1/user/otp-verification",
        { email, phone, otp: enteredOtp },
        {
          withCredentials: true,                                   // important to receive cookies
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message);
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="otp-verification-page">
      <div className="otp-container">
        <h1>OTP Verification</h1>
        <p>Enter the 5-digit OTP sent to your email or phone.</p>
        <form onSubmit={handleOtpVerification} className="otp-form">
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button type="submit" className="verify-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
