// DASHBOARD COMPONENTS RECORD:
// Admin Dashboard: AdminDashboard.jsx
// Faculty Dashboard: AppointmentCard.jsx
// Student Dashboard: StudentConsultations.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AuthLoginBasic from './components/AuthLoginBasic';
import AppointmentCard from './components/AppointmentCard';
import StudentConsultation from './components/StudentConsultations.jsx';
import FacultyProfile from './components/FacultyProfile';
import Schedule from './components/Schedule';
import SubjectScheduling from './components/SubjectScheduling';
import AdminDashboard from './components/AdminDashboard';
import AuthForgotPasswordBasic from './components/AuthForgotPasswordBasic';
import ResetPassword from './components/ResetPassword';
import LandingPage from './components/LandingPage';
import AuthRegisterBasic from './components/AuthRegisterBasic';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    console.log('AuthProvider: token', token);
    console.log('AuthProvider: userData', userData);
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        const parsedRole = parsed.role?.toLowerCase();
        setIsAuthenticated(true);
        setUserRole(parsedRole);
        console.log('AuthProvider: set isAuthenticated true, userRole', parsedRole, 'parsed userData:', parsed);
      } catch (e) {
        console.error('AuthProvider: Error parsing userData', e);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Public route component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const location = useLocation();
  console.log('PublicRoute: isAuthenticated', isAuthenticated, 'userRole', userRole, 'location', location.pathname);
  if (isAuthenticated) {
    switch (userRole) {
      case 'admin':
        console.log('PublicRoute: Redirecting to /admin');
        return <Navigate to="/admin" state={{ from: location }} replace />;
      case 'faculty':
        console.log('PublicRoute: Redirecting to /appointmentcards');
        return <Navigate to="/appointmentcards" state={{ from: location }} replace />;
      case 'student':
        console.log('PublicRoute: Redirecting to /studentconsultation');
        return <Navigate to="/studentconsultation" state={{ from: location }} replace />;
      default:
        console.log('PublicRoute: Redirecting to /login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  return children;
};

// Private route component
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);
  const location = useLocation();
  console.log('PrivateRoute: isAuthenticated', isAuthenticated, 'userRole', userRole, 'allowedRoles', allowedRoles, 'location', location.pathname);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    console.log('PrivateRoute: Not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    console.log('PrivateRoute: Role not allowed, redirecting to /unauthorized');
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return children;
};

const ResetPasswordRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('resetEmail');
  const token = location.state?.token || localStorage.getItem('resetToken');

  useEffect(() => {
    if (!email || !token) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, token, navigate]);

  return children;
};

const App = () => {
  return (
    <GoogleOAuthProvider 
      clientId="295099131481-l6mgeh805cerlvbav583lb8tuqm4trrb.apps.googleusercontent.com"
      onScriptLoadError={() => console.error('Failed to load Google Sign-In script')}
      onScriptLoadSuccess={() => console.log('Google Sign-In script loaded successfully')}
    >
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><AuthLoginBasic /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><AuthRegisterBasic /></PublicRoute>} />
            <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/appointmentcards" element={<PrivateRoute allowedRoles={['faculty']}><AppointmentCard /></PrivateRoute>} />
            <Route path="/studentconsultation" element={<PrivateRoute allowedRoles={['student']}><StudentConsultation /></PrivateRoute>} />
            <Route path="/faculty-profile" element={<PrivateRoute allowedRoles={['faculty']}><FacultyProfile /></PrivateRoute>} />
            <Route path="/schedule" element={<PrivateRoute allowedRoles={['faculty']}><Schedule /></PrivateRoute>} />
            <Route path="/subject-scheduling" element={<PrivateRoute allowedRoles={['faculty']}><SubjectScheduling /></PrivateRoute>} />
            <Route path="/subjects-scheduling" element={<Navigate to="/subjects" replace />} />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <AuthForgotPasswordBasic />
                </PublicRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <ResetPasswordRoute>
                  <ResetPassword />
                </ResetPasswordRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
