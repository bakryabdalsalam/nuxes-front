import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// React Router future flags are no longer needed here
// Since they were causing errors with the wrong import

// Remove console errors in development
if (process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      args[0]?.includes?.('Warning:') && 
      (args[0]?.includes?.('React Router') || args[0]?.includes?.('Invalid prop'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  </React.StrictMode>
);
