import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import Header from './components/Header';
import ErrorBoundary from './components/common/ErrorBoundary';

// Export as default export with error boundary
export default function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  return (
    <ErrorBoundary fallback={
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">An error occurred while loading the application.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reload page
        </button>
      </div>
    }>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Header />
          <main className="container mx-auto px-4 py-8">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
