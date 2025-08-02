import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for Google OAuth response parameters here
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token'); // Get the token from the URL

    if (token) {
      // Store the token and redirect to dashboard or protected route
      localStorage.setItem('user', token);
      navigate('/dashboard');  // Or wherever you want to redirect after successful login
    } else {
      // Handle errors or redirects
      navigate('/');
    }
  }, [navigate]);

  return <div>Loading...</div>; // Optionally show a loading screen or spinner
};

export default AuthCallback;
