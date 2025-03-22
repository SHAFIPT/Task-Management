// src/constants/Messages.ts
export const ResponseMessages = {
  // Auth
  REGISTRATION_SUCCESS: 'User registration successful',
  REGISTRATION_FAILED: 'User registration failed',
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Login failed',
  LOGOUT_SUCCESS: 'Logout successful',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  USER_LOGGED_OUT:'logout user successfully',
  USER_EMAIL_MISSING : "User email is missing",
  TOKEN_CREATED_SUCCESSFULLY: "Token created successfullyy",

  //User
  USER_FETCHED_SUCCESSFULLY: "user fetched successfully",
  CURRENT_USER_FETCHED_SUCCESSFULLY: "current user fetched successfully",
  
  //Project
  PROJECT_UPDATED_SUCCESSFULLY: "Project updated successfully",
  PROJECT_NOT_FOUND: "Project not found or could not be updated",
  PROJECT_ID_IS_NOTFOUND: "Project ID is required",
  PROJECT_DELETED_SUCESSFULLY: "Projeced deleted successfully",
  
  //Task
  TASK_CREATED_SUCCESSFULLY: "Task created successfully",
  TASK_CREATION_FAILED: "Faild to create task",
  TASK_ID_IS_NOTFOUND: "Task id is not found",
  TASK_UPDATED_SUCCESSFULLY: "Task updated successfully",
  TASK_DELETED_SUCCESSFULLY: "Task deleted successfully",
  TASK_NOT_FOUND :"Task not found!",
  
  // OTP
  OTP_SUCCESSFULY_SENT: 'OTP sent successfully',
  OTP_RESENT: 'OTP resent successfully',
  OTP_VERIFIED: 'OTP verified successfully',
  OTP_INVALID: 'Invalid OTP',
  OTP_EXPIRED: 'OTP expired',
  
  // Password
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_RESET_FAILED: 'Password reset failed',
  INVALID_RESET_TOKEN: 'Invalid reset token',
  RESET_TOKEN_EXPIRED: 'Reset token expired',

  //Prooject
  PROJECT_NAME_AND_CREATER_REQUERD : "Project name and creator are required" ,
  
  // Validation
  MISSING_FIELDS: 'Required fields are missing',
  EMAIL_REQUIRED: 'Email is required',
  INVALID_EMAIL: 'Invalid email format',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_INVALID: 'Password must be at least 8 characters long',
  
  // Database
  DATABASE_ERROR: 'Database error occurred',
  UPDATE_FAILED: 'Update operation failed',
  
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Conflict'


};