import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from 'sweetalert2';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';

const headerStyles = `
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animated-header {
    background: linear-gradient(
      270deg,
      #2E1437,
      #D13B3B,
      #F0A500,
      #D13B3B,
      #2E1437
    );
    background-size: 300% 300%;
    animation: gradientAnimation 15s ease infinite;
    padding: 2rem 0;
    margin-bottom: 2rem;
  }

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .header-title {
    font-size: 2.5rem;
    font-weight: 600;
    color: #FFD700;
    font-family: 'Segoe UI', Arial, sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }

  .header-title:hover {
    transform: scale(1.02);
  }

  .header-subtitle {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  .nav-button {
    background-color: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;
  }

  .nav-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FacultyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    faculty_id: '',
    department: '',
    contact_number: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (!token || !userData) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/faculty-profile', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            faculty_id: response.data.faculty_id || '',
            department: response.data.department || '',
            contact_number: response.data.contact_number || ''
          });
        } else {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            faculty_id: userData.faculty_id || '',
            department: userData.department || '',
            contact_number: userData.contact_number || ''
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          faculty_id: userData.faculty_id || '',
          department: userData.department || '',
          contact_number: userData.contact_number || ''
        });
        setLoading(false);
      }
    };

    fetchProfile();

    // Add the styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (!token || !userData) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/faculty-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update local storage with new data
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          name: formData.name,
          email: formData.email,
          faculty_id: formData.faculty_id,
          department: formData.department,
          contact_number: formData.contact_number
        }));

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully!'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    }
  };

  const handleBack = () => {
    navigate('/appointmentcards');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="animated-header">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="header-title mb-0 fade-in-up">
                Faculty Consultation Management System
              </h1>
              <p className="header-subtitle mt-2">
                Schedule and manage your faculty consultations efficiently
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link 
                to="/appointmentcards"
                className="btn nav-button d-flex align-items-center gap-2"
              >
                <span className="fw-bold">ConsultEase</span>
              </Link>
              <button 
                className="btn nav-button d-flex align-items-center gap-2"
                onClick={() => navigate('/faculty-profile')}
              >
                <AccountCircleIcon />
                Profile
              </button>
              <div className="dropdown">
                <button 
                  className="btn nav-button d-flex align-items-center gap-2"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <AccountCircleIcon />
                  <span>{formData.name || 'User'}</span>
                </button>
                {showProfileDropdown && (
                  <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogoutIcon className="me-2" fontSize="small" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="card shadow">
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-link text-decoration-none text-dark"
                onClick={handleBack}
              >
                <ArrowBackIcon /> Back
              </button>
              <h4 className="mb-0 ms-3">Faculty Profile</h4>
            </div>
          </div>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Faculty ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="faculty_id"
                      placeholder="Enter faculty ID"
                      value={formData.faculty_id}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      name="department"
                      placeholder="Enter department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact_number"
                      placeholder="Enter contact number"
                      value={formData.contact_number}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={handleBack}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Profile
                </Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
