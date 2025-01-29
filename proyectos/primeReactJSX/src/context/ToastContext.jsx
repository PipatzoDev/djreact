import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  return (
    <ToastContext.Provider value={toast}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
};
