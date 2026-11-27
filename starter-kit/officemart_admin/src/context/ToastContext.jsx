import { createContext, useContext, useEffect, useState } from 'react';

const ToastContext = createContext(null);

// Toast nằm ở cấp App nên vẫn hiển thị sau khi navigate('/products')
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { id, message }

  function showToast(message) {
    setToast({ id: Date.now(), message });
  }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast" data-testid="toast" role="status">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
