import React, { useRef, useEffect } from "react";
import './loadingBody.css'

interface OTPModalProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  onVerify: () => void;
  onClose: () => void;
  isLoading: boolean;
  onResendOtp: () => void;
  resendLoading: boolean;
  email?: string;
}

const OTPModal: React.FC<OTPModalProps> = ({ 
  otp, 
  setOtp, 
  onVerify, 
  onClose, 
  isLoading, 
  onResendOtp, 
  resendLoading,
  email 
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus the first input field when the modal opens
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, otp.length);
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      
      setOtp(newOtp);
      
      // Focus on the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex(d => d === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[otp.length - 1]?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Enter Verification Code</h2>
        <p className="text-gray-600 mb-6">
          We've sent a 6-digit code to {email ? <span className="font-medium">{email}</span> : 'your email address'}
        </p>
        
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el}}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading || resendLoading}
            />
          ))}
        </div>

        <div className="text-sm text-gray-600 mb-6">
          Didn't receive the code? 
          <button 
            onClick={onResendOtp}
            disabled={resendLoading}
            className="text-indigo-700 hover:text-indigo-500 font-medium ml-1 disabled:text-indigo-300"
          >
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
            disabled={isLoading || resendLoading}
          >
            Cancel
          </button>
          <button
            onClick={onVerify}
            disabled={isLoading || resendLoading || otp.some(digit => digit === "")}
            className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors disabled:bg-indigo-400 flex items-center justify-center min-w-24"
          >
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;