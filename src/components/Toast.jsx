import { useEffect, useState } from 'react';

export default function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div id="toast" className={show ? 'show' : ''}>
      {message}
    </div>
  );
}
