
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { forgotPassword, getCurrentUser, loginUser, logoutUser, registerUser, resendOtp, resetPassword, sendOtp, verifyOtp } from "../service/authService";
import { AuthUser } from "../types/auth";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}


const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAuthUser = (userData: AuthUser) => {
    queryClient.setQueryData<AuthUser>(["authUser"], userData);
  }

  const currentUser = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      // Check if we have a token first
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return null;
      }
      
      // Fetch user data from the API
      try {
        const userData = await getCurrentUser();
        return userData;
      } catch (error) {
        // If token is invalid, clear it
        console.error(error)
        // localStorage.removeItem("accessToken");
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false
  });


  const login = useMutation({
  mutationFn: loginUser,
  onSuccess: (data) => {
    console.log('Thsiis the data get in fronte ;::',data)
    localStorage.setItem("accessToken", data.accessToken);
    toast.success('User login successfully...');
    setAuthUser(data.user);
    navigate("/");
  },
    onError: (error: AxiosError<ErrorResponse>) => {
    console.log("Error response from backend:", error.response);
    const errorMessage = error.response?.data?.message || "Login failed";
    toast.error(errorMessage);
  },
});

  const register = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("OTP sent to your email");
      setAuthUser(data.user);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    },
  })

  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: () => toast.success("OTP sent successfully"),
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Failed to send OTP";
      toast.error(errorMessage);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => toast.success("OTP resent successfully"),
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast.success("OTP verified successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Invalid OTP";
      toast.error(errorMessage);
    },
  });

  const forgotPasswordMutation = useMutation({
  mutationFn: forgotPassword,
  onSuccess: () => {
    toast.success("Reset token sent to email");
  },
  onError: (error: AxiosError<ErrorResponse>) => {
    toast.error(error.response?.data?.message || "Error sending reset token");
  },
  });
  
  

const resetPasswordMutation = useMutation({
  mutationFn: resetPassword,
  onSuccess: () => {
    toast.success("Password reset successful");
    navigate("/auth/login");
  },
  onError: (error: AxiosError<ErrorResponse>) => {
    toast.error(error.response?.data?.message || "Error resetting password");
  },
});

  const logout = useMutation({
  mutationFn: logoutUser,
  onSuccess: () => {
    localStorage.removeItem("accessToken");
    
    queryClient.removeQueries({ queryKey: ["authUser"] });
    toast.success("Logged out successfully");
    
    navigate("/auth/login");
  },
  onError: (error: AxiosError<ErrorResponse>) => {
    const errorMessage = error.response?.data?.message || "Logout failed";
    toast.error(errorMessage);
  },
});

  return {
    login,
    register,
    sendOtpMutation,
    verifyOtpMutation,
    resendOtpMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
    logout,
    user: currentUser.data, 
  };

};

export default useAuth;
