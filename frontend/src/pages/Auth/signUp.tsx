import React from 'react';
import { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import LoginPageImage from '../../assets/business-planning-upgrade-removebg-preview.png';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import OTPModal from './OTPModal';
import './loadingBody.css'
import { ValidateRegister } from '../../validator/validateRegister';
import { toast } from 'react-toastify';

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    verifyOtpMutation,
    resendOtpMutation,
    sendOtpMutation } = useAuth();
  const [otp, setOtp] = useState<string[]>(new Array(4).fill("")); 
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState(""); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

     const errors = ValidateRegister(formData);
      if (errors) {
        setFormErrors(errors);
        return; 
      }
      setFormErrors({});

    setUserEmail(formData.email);
    sendOtpMutation.mutate(formData.email, {
        onSuccess: () => {
          setShowOtpModal(true);
        }
      });
  };

  const handleVerifyOtp = () => {
    verifyOtpMutation.mutate(
      { email: userEmail, otp: otp.join("") },
      {
        onSuccess: () => {
          // Now register the user after OTP verification is successful
          register.mutate({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }, {
            onSuccess: () => {
              toast.success('user Registerd successfully')
              setShowOtpModal(false);
              navigate("/auth/login");
            }
          });
        }
      }
    );
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate(userEmail);
  };
  
   const handleModalClose = () => {
    setShowOtpModal(false);
    // Optional: Reset OTP fields
    setOtp(new Array(4).fill(""));
  };

  return (
    <>

    {showOtpModal && (
        <OTPModal
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOtp}
          onClose={handleModalClose}
          isLoading={verifyOtpMutation.isPending}
          onResendOtp={handleResendOtp}
          resendLoading={resendOtpMutation.isPending}
          email={userEmail}
        />
      )}
    
    {(register.isPending || verifyOtpMutation.isPending || resendOtpMutation.isPending) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader "></div>
        </div>
      )}
 
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Branding and info */}
      <div className="leftside bg-indigo-700 text-white md:w-1/2 p-8 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <div className="w-40">
            <svg className="w-full" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 8L20 32L30 8M15 20H25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40 8H50C55 8 60 12 60 18C60 24 55 28 50 28H40V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M70 8H80C85 8 90 12 90 18C90 24 85 32 80 32H70V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Content */}
          <div className="space-y-6 mt-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Join Our Ecosystem</h1>
            <p className="text-lg md:text-xl max-w-md opacity-90">
              Create an account and unlock your productivity potential with our comprehensive task management solution.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-full p-1">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Free 14-day trial, no credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-full p-1">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Instant access to all premium features</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-full p-1">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Seamless team collaboration tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-full p-1">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Priority customer support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image at the bottom */}
         <div className="mt-2 flex justify-center md:justify-start">
          <div className="h-[225px] flex items-center justify-center">
            <img 
              src={LoginPageImage} 
              alt="Task Management" 
              className="max-h-full object-contain" 
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Registration form */}
      <div className="rightside md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-600">Complete the form below to get started</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Full Name Input */}
              <div className="flex items-center justify-center">
                <div className="relative w-full">
                  <input
                    id="name"
                    name="name"
                    type="text" 
                    value={formData.name}
                    onChange={handleChange}
                    className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-indigo-700 transition-colors focus:outline-none peer bg-inherit w-full"
                    required
                    placeholder=' '
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 top-2 text-gray-500 cursor-text peer-focus:-top-4 transition-all peer-focus:text-blue-600 
                  // This is the crucial change - add peer-not-placeholder-shown to keep label up when there's text
                  peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-blue-600
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:text-sm font-[Poppins]"
                  >
                    Full Name
                  </label>
                  {formErrors.name && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                    )}
                </div>
              </div>
              
              {/* Email Input */}
              <div className="flex items-center justify-center">
                <div className="relative w-full">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-indigo-700 transition-colors focus:outline-none peer bg-inherit w-full"
                    required
                    placeholder=' '
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-2 text-gray-500 cursor-text peer-focus:-top-4 transition-all peer-focus:text-blue-600 
                  // This is the crucial change - add peer-not-placeholder-shown to keep label up when there's text
                  peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-blue-600
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:text-sm font-[Poppins]"
                  >
                    Email
                  </label>
                  {formErrors.email && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                    )}
                </div>
              </div>
              
              {/* Password Input */}
              <div className="flex items-center justify-center">
                <div className="relative w-full">
                  <input
                    id="password"
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-indigo-700 transition-colors focus:outline-none peer bg-inherit w-full pr-10"
                    required
                    placeholder=' '
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 top-2 text-gray-500 cursor-text peer-focus:-top-4 transition-all peer-focus:text-blue-600 
                  // This is the crucial change - add peer-not-placeholder-shown to keep label up when there's text
                  peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-blue-600
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:text-sm font-[Poppins]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-1 text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                   {formErrors.password && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
                    )}
                    
                </div>
              </div>
              
              {/* Confirm Password Input */}
              <div className="flex items-center justify-center">
                <div className="relative w-full">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-indigo-700 transition-colors focus:outline-none peer bg-inherit w-full pr-10"
                    required
                    placeholder=' '
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-0 top-2 text-gray-500 cursor-text peer-focus:-top-4 transition-all peer-focus:text-blue-600 
                  // This is the crucial change - add peer-not-placeholder-shown to keep label up when there's text
                  peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-blue-600
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:text-sm font-[Poppins]"
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-0 top-1 text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {formErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
                    )}
                </div>
              </div>
            </div>
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Password strength:</div>
                <div className="flex gap-2">
                  <div className={`h-1 w-1/4 rounded ${formData.password.length > 0 ? 'bg-indigo-700' : 'bg-gray-300'}`}></div>
                  <div className={`h-1 w-1/4 rounded ${formData.password.length >= 8 ? 'bg-indigo-700' : 'bg-gray-300'}`}></div>
                  <div className={`h-1 w-1/4 rounded ${/[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'bg-indigo-700' : 'bg-gray-300'}`}></div>
                  <div className={`h-1 w-1/4 rounded ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-indigo-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle size={12} className={`${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={12} className={`${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>At least 1 uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={12} className={`${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>At least 1 number</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={12} className={`${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>At least 1 special character</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-700 focus:ring-indigo-700 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="font-medium text-indigo-700 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="font-medium text-indigo-700 hover:text-indigo-500">Privacy Policy</a>
              </label>
            </div>
            
            {/* Register Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Create Account
              </button>
            </div>
            
            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to='/auth/login' className="font-medium text-indigo-700 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;