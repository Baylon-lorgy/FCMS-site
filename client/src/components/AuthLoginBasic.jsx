import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin 
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import Swal from 'sweetalert2';

DataTable.use(DT);
const AuthLoginBasic = () => {
  const [email, setEmail] = useState(''); // Changed to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To handle error messages
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [rememberMe, setRememberMe] = useState(false); // Remember me state
  const [isVerified, setIsVerified] = useState(false); // State for reCAPTCHA verification
  const [captchaToken, setCaptchaToken] = useState(''); // State for reCAPTCHA token
  // State for reCAPTCHA
  const [showCaptcha, setShowCaptcha] = useState(false); // Disable reCAPTCHA for GitHub Pages
  const [skipCaptcha, setSkipCaptcha] = useState(true); // Skip reCAPTCHA by default
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated, setUserRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const recaptchaRef = React.useRef();

  // Debug panel state
  const [debugInfo, setDebugInfo] = useState({
    authToken: '',
    userDataRaw: '',
    userDataParsed: null
  });

  // Add useEffect to initialize reCAPTCHA properly
  useEffect(() => {
    // Ensure reCAPTCHA is properly loaded
    if (window.grecaptcha && recaptchaRef.current) {
      try {
        window.grecaptcha.ready(() => {
          console.log('reCAPTCHA is ready');
        });
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
      }
    }
  }, []);

  // Load saved email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);



  useEffect(() => {
    // Update debug info whenever login state changes
    const interval = setInterval(() => {
      const authToken = localStorage.getItem('authToken');
      const userDataRaw = localStorage.getItem('userData');
      let userDataParsed = null;
      try {
        userDataParsed = userDataRaw ? JSON.parse(userDataRaw) : null;
      } catch (e) {
        userDataParsed = 'Invalid JSON';
      }
      setDebugInfo({ authToken, userDataRaw, userDataParsed });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCaptchaChange = (token) => {
    if (token) {
      console.log("Captcha Token received");
      setCaptchaToken(token);
      setIsVerified(true);
      setError('');
    } else {
      console.log("Captcha Token expired or invalid");
      setCaptchaToken('');
      setIsVerified(false);
    }
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handleSkipCaptcha = () => {
    console.log('CAPTCHA skipped');
    setShowCaptcha(false);
    setIsVerified(true);
    setSkipCaptcha(true);
    setError('');
  };

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setCaptchaToken('');
    setIsVerified(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Check captcha if required (enforce for unfamiliar accounts)
      if (showCaptcha && !isVerified && !skipCaptcha) {
        setError('Please complete the captcha verification first');
        setIsLoading(false);
        return;
      }



      console.log('Attempting login...', {
        email,
        showCaptcha,
        isVerified,
        skipCaptcha,
        captchaToken
      });
      
      // Prepare the request data
      const requestData = {
        email,
        password,
        captchaToken: showCaptcha ? captchaToken : null,
        skipCaptcha: skipCaptcha
      };

      console.log('Sending request data:', requestData);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', requestData);

      const { token, user } = response.data;
      console.log('Login successful, user role:', user.role);
      
      // Store user data and token
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      

      
      if (rememberMe) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }
      
      // Update auth context
      setIsAuthenticated(true);
      setUserRole(user.role.toLowerCase());

      // Redirect based on role
      switch (user.role.toLowerCase()) {
        case 'admin':
          window.location.replace('/admin');
          break;
        case 'faculty':
          window.location.replace('/appointmentcards');
          break;
        case 'student':
          window.location.replace('/studentconsultation');
          break;
        default:
          setError('Invalid user role');
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message?.includes('password')) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Incorrect password. Please try again.',
          confirmButtonText: 'OK'
        });
      } else {
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      }
      
      // Reset captcha on error
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleGoogleSignIn = async (credentialResponse) => {
      try {
        console.log('Google credentials received:', credentialResponse);
        
        if (!credentialResponse?.credential) {
          Swal.fire({
            icon: 'error',
            title: 'Google Sign-In Failed',
            text: 'No credentials received from Google. Please try again.',
            confirmButtonText: 'OK'
          });
          return;
        }

        // Show loading state
        Swal.fire({
          title: 'Signing in...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Send the credential token to your backend
        const response = await axios.post(
          'http://localhost:5000/api/auth/google-login',
          { token: credentialResponse.credential }
        );

        console.log('Backend response:', response.data);
        const { token, user } = response.data;
        
        // Store auth data in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        // Update auth context
        setIsAuthenticated(true);
        setUserRole(user.role.toLowerCase());

        // Close loading state
        Swal.close();

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${user.name}!`,
          showConfirmButton: false,
          timer: 1500
        });

        // Role-based redirection
        switch (user.role.toLowerCase()) {
          case 'admin':
            window.location.replace('/admin');
            break;
          case 'faculty':
            window.location.replace('/appointmentcards');
            break;
          case 'student':
            window.location.replace('/studentconsultation');
            break;
          default:
            setError('Invalid user role');
            break;
        }
      } catch (error) {
        console.error('Google Sign-In Error:', error);
        Swal.close(); // Close any open loading state
        
        if (error.response?.data?.message === 'Please register first before using Google login') {
          Swal.fire({
            icon: 'info',
            title: 'Registration Required',
            text: 'Please complete your registration first',
            confirmButtonText: 'Register Now'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/register', { 
                state: { email: error.response.data.email, isGoogleLogin: true } 
              });
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Google Sign-In Failed',
            text: error.response?.data?.message || 'Failed to sign in with Google. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      }
    };

    const handleGoogleError = (error) => {
      console.log('Google Login Error:', error);
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      if (error.error === 'popup_closed_by_user') {
        errorMessage = 'Sign in was cancelled. Please try again.';
      } else if (error.error === 'access_denied') {
        errorMessage = 'Access was denied. Please try again or contact support.';
      } else if (error.error === 'idpiframe_initialization_failed') {
        errorMessage = 'Google Sign-In failed to initialize. Please check your browser settings.';
      } else if (error.error === 'origin_mismatch') {
        errorMessage = 'Origin mismatch error. Please contact the administrator.';
        console.error('Origin mismatch. Current origin:', window.location.origin);
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In Failed',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    };

  
  return (
<div>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
  {/* <title>Login Basic - Pages | Sneat - Bootstrap 5 HTML Admin Template - Pro</title> */}
  <meta name="description" content="Your description here" />

  {/* Favicon */}
  <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />
  {/* Fonts */}
  <link rel="stylesheet" href="/assets/vendor/css/pages/page-auth.css"/>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
  {/* Page */}
  <link rel="stylesheet" href="assets/vendor/css/pages/page-auth.css" />
  {/* Helpers */}
  {/*! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section */}
  {/*? Template customizer: To hide customizer set displayCustomizer value false in config.js.  */}
  {/*? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  */}
  {/* Content */}
  <div className="container-xxl">
    <div className="authentication-wrapper authentication-basic container-p-y">
      <div className="authentication-inner">
        {/* Register */}
        <div className="card">
          <div className="card-body">
            {/* Logo */}
            <div className="app-brand justify-content-center">
              <a href="index.html" className="app-brand-link gap-2">
                <span className="app-brand-logo demo">
                 
                </span>
                {/* <span className="appp-brand-text demo text-body fw-bolder">ConsultEase</span> */}
              </a>
            </div>
            {/* /Logo */}
            <h4 className="mb-2">Welcome to ConsultEase!</h4>
            <p className="mb-4">Please sign-in to your account and start the consultation</p>
            <form id="formAuthentication" className="mb-3" onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email </label>
                <input
                                            type="text"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            autoFocus
                                            value={email} // Use 'email' here
                                            onChange={handleEmailChange} // Use new handler
                                            required
                                        />
              </div>
              <div className="mb-3 form-password-toggle">
                <div className="d-flex justify-content-between">
                  <label className="form-label" htmlFor="password">Password</label>
                  <a 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!email) {
                        Swal.fire({
                          icon: 'warning',
                          title: 'No Email Detected',
                          text: 'Please enter your email first',
                          confirmButtonText: 'OK'
                        });
                        return;
                      }

                      // Store email in localStorage
                      localStorage.setItem('resetEmail', email);
                      navigate('/forgot-password');
                    }}
                  >
                    <small>Forgot Password?</small>
                  </a>
                </div>
                <div className="input-group input-group-merge">
                                            <input
                                                type={showPassword ? "text" : "password"} // Toggle input type based on state
                                                id="password"
                                                className="form-control"
                                                name="password"
                                                placeholder="············"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                           <span
                                                className="input-group-text cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                            >
                                                <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`} /> {/* Change icon based on state */}
                                            </span>
                                        </div>
              </div>
              <div className="mb-3">
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="remember-me" 
                        checked={rememberMe} 
                        onChange={() => setRememberMe(!rememberMe)} // Toggle the value
                    />
                    <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                </div>
              </div>
              {/* Only show error if it's not related to skipped captcha */}
              {error && !skipCaptcha && <div className="text-danger mb-3">{error}</div>}
              <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                {showCaptcha ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>

                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6Lc8M1crAAAAAEmcoJJmlWSo5dR1ndpF1WINoYIS"
                      onChange={handleCaptchaChange}
                      onExpired={() => {
                        setCaptchaToken('');
                        setIsVerified(false);
                        setError('Captcha expired. Please verify again.');
                      }}
                      onError={() => {
                        setError('Captcha failed to load. Please check your internet connection or try a different browser.');
                        resetCaptcha();
                      }}
                      size="normal"
                      theme="light"
                      badge="bottomright"
                      hl="en"
                      tabIndex={0}
                      aria-label="reCAPTCHA"
                    />
                    {error && (
                      <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                        {error}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleSkipCaptcha}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#696cff",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: "5px",
                        marginTop: "5px"
                      }}
                    >
                      Skip CAPTCHA
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    gap: "10px",
                    padding: "10px",
                    background: "#e8f5e9",
                    borderRadius: "4px",
                    color: "#2e7d32"
                  }}>
                    <span>CAPTCHA skipped</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCaptcha(true);
                        setSkipCaptcha(false);
                        setIsVerified(false);
                        resetCaptcha();
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#1976d2",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: "0"
                      }}
                    >
                      Enable CAPTCHA
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_blue"
                  size="large"
                  style={{ width: '100%', justifyContent: 'center' }}
                  text="continue_with"
                  shape="rectangular"
                  auto_select={false}
                  context="signin"
                  ux_mode="popup"
                  cancel_on_tap_outside={true}
                  itp_support={true}
                  type="standard"
                  locale="en"
                  logo_alignment="left"
                  clientId="YOUR_GOOGLE_CLIENT_ID" // Add your Google Client ID here
                  redirectUri={window.location.origin}
                />
              </div>
              <div className="mb-3">
              <button 
                className="btn btn-primary d-grid w-100" 
                type="submit" 
              >
                Sign in
              </button>

              </div>
            </form>
            <p className="text-center">
            <span>New on our platform? </span>
            <a href="/register">
              <span>Create an account</span>
            </a>
          </p>
            <div className="divider my-4">
              <div className="divider-text">or</div>
            </div>
          </div>
        </div>
        
        {/* /Register */}
      </div>
    </div>
  </div>
  {/* / Content */}
  {/* Core JS */}
  {/* Vendors JS */}
  {/* Main JS */}
  {/* Page JS */}
</div>

  )
}

export default AuthLoginBasic