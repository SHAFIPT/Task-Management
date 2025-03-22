import LoginPageImage from '../../assets/newOne-removebg-preview.png'
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { validateLogin } from '../../validator/validateLogin';
import { FormErrors } from './signUp';
import { toast } from 'react-toastify';
import './loadingBody.css'
import ForgetPasswordModal from './ForgetPasswordModal';

const LoginPage = () => {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [forgetModalOpen , setForgetModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role : 'user'
  })
  const navigate = useNavigate()
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Tiiiiii')
    e.preventDefault();
  
    const errors = validateLogin(formData);
    console.log('This si the eroror ;:',errors)
    if (errors) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

     login.mutate(formData, {
      onSuccess: () => {
        toast.success('Login successfully....');
        navigate('/');
      }
    });
  }

  return (
    <>
      {login.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader "></div>
        </div>
      )}

      {forgetModalOpen && (
        <ForgetPasswordModal onClose={() => setForgetModalOpen(false)} />
      )}

      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        {/* Left side - Branding and info */}
        <div className="leftside bg-blue-700 text-white md:w-1/2 p-8 flex flex-col justify-between">
          <div className="space-y-8">
            {/* Logo */}
            <div className="w-40">
              <svg
                className="w-full"
                viewBox="0 0 100 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 8L20 32L30 8M15 20H25"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 8H50C55 8 60 12 60 18C60 24 55 28 50 28H40V8Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M70 8H80C85 8 90 12 90 18C90 24 85 32 80 32H70V8Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="space-y-6 mt-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Task Management System
              </h1>
              <p className="text-lg md:text-xl max-w-md opacity-90">
                Streamline your workflow, boost productivity, and collaborate
                seamlessly with our intuitive task management platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-white rounded-full p-1">
                    <svg
                      className="w-4 h-4 text-blue-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Track project progress in real-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-white rounded-full p-1">
                    <svg
                      className="w-4 h-4 text-blue-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Assign tasks to team members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-white rounded-full p-1">
                    <svg
                      className="w-4 h-4 text-blue-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Set priorities and deadlines</span>
                </div>
              </div>
            </div>
          </div>

          {/* Brand logo in bottom */}
          <div className="mt-2 flex justify-center md:justify-start">
            <div className="h-[265px] flex items-center justify-center">
              <img
                src={LoginPageImage}
                alt="Task Management"
                className="max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="rightside md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-gray-600">
                Please sign in to your account
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email Input */}
                <div className="flex items-center justify-center">
                  <div className="relative w-full">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-blue-600 transition-colors focus:outline-none peer bg-inherit"
                      placeholder=" "
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
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.email}
                      </p>
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
                      className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit w-full pr-10"
                      required
                      placeholder=" "
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-700 focus:ring-blue-700 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <div
                    className="font-medium text-blue-700 hover:text-blue-500"
                    onClick={() => setForgetModalOpen(true)}
                  >
                    Forgot your password?
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign in
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/register"
                    className="font-medium text-blue-700 hover:text-blue-500"
                  >
                    Sign up
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

export default LoginPage;