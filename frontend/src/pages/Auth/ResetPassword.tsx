import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // User enters their email

  // Extract token from query string
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token") ?? "";

  console.log("This is the token :::", token); // Debugging

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword.mutateAsync({ email, password, token });
      navigate("/auth/login");
    } catch (error) {
      console.error("Reset password failed", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password? <a href="/auth/login" className="text-blue-500 font-medium hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
