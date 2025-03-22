import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "../../pages/Auth/loadingBody.css";

interface ForgetPasswordModalProps {
  onClose: () => void;
}

const ForgetPasswordModal: React.FC<ForgetPasswordModalProps> = ({ onClose }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSubmit = async () => {
    if (email) {
      try {
        await forgotPassword.mutateAsync(email);
        setEmailSent(true);
        toast.success("Password reset link sent to your email");
      } catch (error) {
        console.error(error);
        toast.error("Failed to send reset link");
      }
    }
  };

  return (
    <>
      {forgotPassword.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}

      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          {!emailSent ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Forgot Password?</h2>
              <p className="text-gray-600 mb-6">
                Enter your email, and we'll send you a password reset link.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Enter your email"
                required
              />
              <button
                onClick={handleEmailSubmit}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Send Reset Link
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <button
                onClick={onClose}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              >
                OK
              </button>
            </>
          )}
          <button onClick={onClose} className="text-gray-500 mt-4 block">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordModal;
