import { Routes, Route } from "react-router-dom"
import LoginPage from "../pages/Auth/login"
import RegisterPage from "../pages/Auth/signUp"
import ResetPassword from "../pages/Auth/ResetPassword"
import PublicRoute from "./PublicRoute"
const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute redirectTo="/" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  )
}

export default AuthRoutes
