import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function AuthRegisterBasic() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = location.state?.defaultRole;
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    id: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole || '',
    terms: false,
    section: '',
    yearLevel: '',
    course: '' // Add course field
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // Disable button while submitting

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (!formData.terms) {
        setError('Please agree to the terms and conditions');
        return;
      }

      if (!formData.id) {
        setError('School ID is required');
        return;
      }

      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return;
      }

      if (!formData.email) {
        setError('Email is required');
        return;
      }

      if (!formData.password) {
        setError('Password is required');
        return;
      }

      // Log registration attempt
      console.log('Attempting registration with data:', {
        school_id: formData.id,
        email: formData.email,
        role: formData.role || 'student',
        hasPassword: !!formData.password
      });

      // Combine first name and last name
      const fullName = `${formData.firstName} ${formData.middleInitial ? formData.middleInitial + ' ' : ''}${formData.lastName}`;

      const registrationData = {
        school_id: formData.id,
        name: fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role || 'student',
        account_agreement: formData.terms,
        contact_number: '',
        department: '',
        position: '',
        program: formData.role === 'student' ? formData.course : undefined, // Use course for students
        year_level: formData.role === 'student' ? formData.yearLevel : undefined,
        section: formData.role === 'student' ? formData.section : undefined,
        academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
      };

      console.log('Sending registration request with data:', registrationData);

      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        registrationData
      );

      console.log('Registration response:', response.data);

      if (response.data) {
        // Show verification dialog immediately after registration
        setVerificationEmail(formData.email);
        setShowVerificationDialog(true);

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please check your email for the verification code.',
          showConfirmButton: true
        });
      } else {
        console.error('Invalid response format:', response.data);
        setError('Registration failed: Invalid server response');
      }
    } catch (err) {
      console.error('Registration error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Invalid registration data. Please check your information.');
      } else if (err.response?.status === 409) {
        setError(err.response.data.message || 'Email or School ID already exists.');
      } else {
        setError('Registration failed. Please try again later.');
      }

      // Show error in SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || 'An error occurred during registration'
      });
    } finally {
      setIsSubmitting(false); // Re-enable button after request finishes
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/email/verify', {
        email: verificationEmail,
        code: verificationCode
      });

      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Email Verified',
          text: 'Your email has been verified successfully. You can now log in.',
          confirmButtonText: 'Go to Login'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: err.response?.data?.message || 'Failed to verify email. Please try again.'
      });
    }
  };

  const handleResendCode = async () => {
    try {
      await axios.post('http://localhost:5000/api/email/send-verification', {
        email: verificationEmail
      });

      Swal.fire({
        icon: 'success',
        title: 'Code Resent',
        text: 'A new verification code has been sent to your email.'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Resend',
        text: err.response?.data?.message || 'Failed to resend verification code. Please try again.'
      });
    }
  };

  return (
    <div>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
      {/* <title>Register Basic - Pages | Sneat - Bootstrap 5 HTML Admin Template - Pro</title> */}
      <meta name="description" content="true" />
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      {/* Icons */}
      <link rel="stylesheet" href="assets/vendor/fonts/boxicons.css" />
      <link rel="stylesheet" href="assets/vendor/fonts/fontawesome.css" />
      <link rel="stylesheet" href="assets/vendor/fonts/flag-icons.css" />
      {/* Core CSS */}
      <link rel="stylesheet" href="assets/vendor/css/rtl/core.css" className="template-customizer-core-css" />
      <link rel="stylesheet" href="assets/vendor/css/rtl/theme-default.css" className="template-customizer-theme-css" />
      <link rel="stylesheet" href="assets/css/demo.css" />
      {/* Vendors CSS */}
      <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
      <link rel="stylesheet" href="assets/vendor/libs/typeahead-js/typeahead.css" />
      {/* Vendor */}
      <link rel="stylesheet" href="assets/vendor/libs/formvalidation/dist/css/formValidation.min.css" />
      {/* Page CSS */}
      {/* Page 
      <link rel="stylesheet" href="assets/vendor/css/pages/page-auth.css" >*/}
      <div className="container-xxl d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">
            {!showVerificationDialog ? (
              <div className="card" style={{ width: '700px', margin: '20px auto' }}>
                <div className="card-body">
                  <div className="app-brand justify-content-center">
                    <a href="index.html" className="app-brand-link gap-2">
                      <span className="app-brand-logo demo">
                      </span>
                    </a>
                  </div>

                  <h4 className="mb-2">REGISTER HERE!</h4>
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-4">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-4">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-4">
                        <label htmlFor="middleInitial" className="form-label">Middle Initial</label>
                        <input
                          type="text"
                          className="form-control"
                          id="middleInitial"
                          name="middleInitial"
                          placeholder="Enter your middle initial"
                          maxLength={1}
                          value={formData.middleInitial}
                          onChange={handleInputChange}
                          pattern="[A-Za-z]"
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4">
                        <label htmlFor="id" className="form-label">
                          {formData.role === 'faculty' ? 'Faculty ID' : 'Student ID'}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="id"
                          name="id"
                          placeholder={`Enter your ${formData.role === 'faculty' ? 'faculty' : 'student'} ID`}
                          value={formData.id}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-4">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {formData.role === 'student' && (
                        <div className="col-4">
                          <label htmlFor="course" className="form-label">Course</label>
                          <select
                            className="form-select"
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Course</option>
                            <option value="BSIT">BSIT</option>
                            <option value="BSEMC">BSEMC</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {formData.role === 'student' && (
                      <>
                        <div className="row mb-3">
                          <div className="col-6">
                            <label htmlFor="yearLevel" className="form-label">Year Level</label>
                            <select
                              className="form-select"
                              id="yearLevel"
                              name="yearLevel"
                              value={formData.yearLevel}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Year Level</option>
                              <option value="1st year">1st year</option>
                              <option value="2nd year">2nd year</option>
                              <option value="3rd year">3rd year</option>
                              <option value="4th year">4th year</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label htmlFor="section" className="form-label">Section</label>
                            <select
                              className="form-select"
                              id="section"
                              name="section"
                              value={formData.section}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Section</option>
                              <option value="A">Section A</option>
                              <option value="B">Section B</option>
                              <option value="C">Section C</option>
                              <option value="D">Section D</option>
                              <option value="E">Section E</option>
                              <option value="F">Section F</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="row mb-3">
                      <div className="col-6 form-password-toggle">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="input-group input-group-merge">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control"
                            name="password"
                            placeholder="············"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                          <span className="input-group-text cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`} />
                          </span>
                        </div>
                      </div>

                      <div className="col-6 form-password-toggle">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-group input-group-merge">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="form-control"
                            name="confirmPassword"
                            placeholder="············"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                          <span className="input-group-text cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <i className={`bx ${showConfirmPassword ? 'bx-show' : 'bx-hide'}`} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role selection - only show if no defaultRole */}
                    {!defaultRole && (
                      <div className="mb-3">
                        <label className="form-label">Role</label>
                        <div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="role"
                              id="student"
                              value="student"
                              checked={formData.role === 'student'}
                              onChange={handleInputChange}
                              required
                            />
                            <label className="form-check-label" htmlFor="student">Student</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="role"
                              id="faculty"
                              value="faculty"
                              checked={formData.role === 'faculty'}
                              onChange={handleInputChange}
                              required
                            />
                            <label className="form-check-label" htmlFor="faculty">Faculty</label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          I agree to the <a href="#">privacy policy &amp; terms</a>
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary d-grid w-100" disabled={isSubmitting}>
                      {isSubmitting ? 'Signing up...' : 'Sign up'}
                    </button>
                  </form>

                  {/* Only show login link if not coming from admin dashboard */}
                  {!defaultRole && (
                    <p className="text-center">
                      <span>Already have an account?</span>
                      <a href="/">
                        <span> Sign in instead</span>
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="card" style={{ width: '400px', margin: '20px auto' }}>
                <div className="card-body">
                  <div className="app-brand justify-content-center mb-4">
                    <h4 className="mb-2 text-center">Verify Your Email</h4>
                  </div>
                  
                  <p className="text-center mb-4">
                    Please enter the verification code sent to<br/>
                    <strong>{verificationEmail}</strong>
                  </p>

                  <form onSubmit={handleVerificationSubmit}>
                    <div className="mb-3">
                      <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter verification code"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary d-grid w-100 mb-3">
                      Verify Email
                    </button>
                    
                    <button type="button" className="btn btn-secondary d-grid w-100" onClick={handleResendCode}>
                      Resend Code
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthRegisterBasic;
