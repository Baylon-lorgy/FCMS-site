import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location.state or localStorage
  const email = location.state?.email || localStorage.getItem('resetEmail');

  useEffect(() => {
    // If no email, redirect to forgot password page
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Send reset password request (no token needed)
      const response = await axios.post('/api/users/reset-password', {
        email,
        newPassword: password
      });

      if (response.data.success) {
        // Clear stored email
        localStorage.removeItem('resetEmail');
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'Your password has been successfully reset. Please login with your new password.',
          confirmButtonText: 'Login'
        });
        // Redirect to login page
        navigate('/login', { replace: true });
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // If no email, show error
  if (!email) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
          <Alert variant="danger">
            Invalid or missing reset information. Please start the password reset process again.
          </Alert>
          <Button
            variant="primary"
            onClick={() => navigate('/forgot-password')}
            className="w-100"
          >
            Go Back to Forgot Password
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="mb-3">Reset Password</h2>
          <p className="text-muted mb-4">
            Enter your new password below
          </p>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={6}
            />
          </Form.Group>
          <Button
            type="submit"
            className="w-100 py-2"
            disabled={loading}
            style={{
              background: '#0d6efd',
              border: 'none',
              fontSize: '1.1rem'
            }}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              style={{ textDecoration: 'none' }}
            >
              Back to Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword; 