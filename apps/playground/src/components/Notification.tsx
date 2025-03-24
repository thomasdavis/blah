'use client';

import { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Notification({ message, type, duration = 3000, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded border-l-4 ${getTypeStyles()} z-50`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="font-medium">{message}</p>
        </div>
        <button
          className="ml-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Container component to manage multiple notifications
interface NotificationsContainerProps {
  notifications: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }[];
  onRemove: (id: string) => void;
}

export function NotificationsContainer({ notifications, onRemove }: NotificationsContainerProps) {
  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </>
  );
}