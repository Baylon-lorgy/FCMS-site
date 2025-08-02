import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const AuthForgotPasswordBasic = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Step 1: Request code
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Send request to backend to send code
      await axios.post('/api/auth/request-password-reset', { email });
      setStep('code');
      setMessage('A verification code has been sent to your email.');
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post('/api/auth/verify-reset-code', { email, code });
      // On success, redirect to reset-password
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      setError('Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="mb-3">Forgot Password</h2>
          <p className="text-muted mb-4">
            {step === 'email' ? 'Enter your email to reset your password' : 'Enter the verification code sent to your email'}
          </p>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        {step === 'email' && (
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
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
              {loading ? 'Sending...' : 'Continue'}
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
        )}
        {step === 'code' && (
          <Form onSubmit={handleCodeSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                required
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
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => setStep('email')}
                style={{ textDecoration: 'none' }}
              >
                Back
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AuthForgotPasswordBasic; 