// useAuthCheck.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to trigger effect on path change

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token && location.pathname !== '/login') {
        navigate('/');
      }
    };

    // Check authentication state on mount and path changes
    checkAuth();

    // Optional: Listen for storage events to handle token changes in different tabs
    window.addEventListener('storage', checkAuth);

    // Cleanup storage event listener
    return () => window.removeEventListener('storage', checkAuth);
  }, [navigate, location.pathname]); // React to changes in path
};

export default useAuthCheck;
