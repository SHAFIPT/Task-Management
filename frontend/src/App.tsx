import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from './context/SocketContext';
import 'react-toastify/dist/ReactToastify.css';
import NotificationHandler from './components/NotificationHandler';

function App() {
  return (
    <SocketProvider>
      <ToastContainer theme="dark" />
      <NotificationHandler />
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>  
    </SocketProvider>
  );
}

export default App;