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
          // Access project name through the correct nested structure
          if (lastNotification.data.kind === 'project') {
            toast.success(`New project added: ${lastNotification.data.project.name}`);
          }
          break;
        case 'task':
          // Access task title through the correct nested structure
          if (lastNotification.data.kind === 'task') {
            toast.info(`New task added: ${lastNotification.data.task.title}`);
          }
          break;
        case 'update':
          // For updates, check what type of update it is
          if (lastNotification.data.kind === 'update') {
            const update = lastNotification.data.update;
            // Type guard to determine if it's a Task or Project
            if ('title' in update) {
              toast.info(`Task updated: ${update.title}`);
            } else if ('name' in update) {
              toast.info(`Project updated: ${update.name}`);
            }
          }
          break;
        default:
          break;
      }
    }
  }, [socketContext?.notifications]);
  
  return null; // This component doesn't render anything
};

export default NotificationHandler;