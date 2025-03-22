// src/components/NotificationHandler.tsx
import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { toast } from 'react-toastify';

const NotificationHandler = () => {
  const socketContext = useContext(SocketContext);
  
  useEffect(() => {
    if (!socketContext) return;
    
    const { notifications } = socketContext;
    const lastNotification = notifications[notifications.length - 1];
    
    if (lastNotification) {
      switch (lastNotification.type) {
        case 'project':
          toast.success(`New project added: ${lastNotification.data.name}`);
          break;
        case 'task':
          toast.info(`New task added: ${lastNotification.data.title}`);
          break;
        case 'update':
          toast.info(`Task updated: ${lastNotification.data.title}`);
          break;
        default:
          break;
      }
    }
  }, [socketContext?.notifications]);
  
  return null; // This component doesn't render anything
};

export default NotificationHandler;