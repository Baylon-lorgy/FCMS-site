import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Swal from 'sweetalert2';

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

const Schedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    day: '',
    startTime: '',
    endTime: '',
    location: '',
    maxSlots: 2,
    subjectId: ''
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    const token = localStorage.getItem('authToken');
    
    console.log('Raw userData from localStorage:', userDataStr); // Debug log
    console.log('Raw token from localStorage:', token); // Debug log
    
    if (!userDataStr || !token) {
      console.log('Missing userData or token, redirecting to login'); // Debug log
      navigate('/login');
      return;
    }

    try {
      const parsedUserData = JSON.parse(userDataStr);
      console.log('Parsed userData:', parsedUserData); // Debug log
      console.log('UserData keys:', Object.keys(parsedUserData)); // Debug log
      
      // Set userData first
      setUserData(parsedUserData);
      
      // Then fetch schedules
      fetchSchedules(token, parsedUserData);
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Add the styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load subjects'
        });
      }
    };

    fetchSubjects();
  }, [navigate]);

  const fetchSchedules = async (token, currentUserData) => {
    try {
      console.log('Fetching schedules with token:', token); // Debug log
      console.log('Current userData:', currentUserData); // Debug log

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get the user ID from either _id or id property
      const userId = currentUserData?._id || currentUserData?.id;
      if (!userId) {
        console.log('UserData object:', currentUserData); // Debug log
        throw new Error('User ID not found in user data');
      }

      const response = await axios.get('http://localhost:5000/api/schedules', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          facultyId: userId
        },
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Fetch subject details for each schedule
      const schedulesWithSubjects = await Promise.all(response.data.map(async schedule => {
        if (schedule.subjectId) {
          try {
            const subjectResponse = await axios.get(`http://localhost:5000/api/subjects/${schedule.subjectId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return {
              ...schedule,
              subject: subjectResponse.data
            };
          } catch (error) {
            console.error('Error fetching subject details:', error);
            return {
              ...schedule,
              subject: { subjectCode: 'Unknown', subjectName: 'Unknown' }
            };
          }
        }
        return schedule;
      }));

      console.log('Schedules with subjects:', schedulesWithSubjects); // Debug log
      setSchedules(schedulesWithSubjects);
      setLoading(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching schedules:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        navigate('/login');
      } else {
        setError(`Failed to load schedules: ${error.response?.data?.message || error.message}`);
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      if (!newSchedule.subjectId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select a subject'
        });
        return;
      }

      const scheduleData = {
        ...newSchedule,
        maxSlots: parseInt(newSchedule.maxSlots) || 2
      };

      let response;
      if (editingIndex !== null) {
        response = await axios.put(
          `http://localhost:5000/api/schedules/${schedules[editingIndex]._id}`,
          scheduleData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/schedules',
          scheduleData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        await fetchSchedules(token, userData);
        setNewSchedule({
          day: '',
          startTime: '',
          endTime: '',
          location: '',
          maxSlots: 2,
          subjectId: ''
        });
        setEditingIndex(null);
        setIsAddingSchedule(false);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editingIndex !== null ? 'Schedule updated successfully!' : 'Schedule created successfully!'
        });
      }
    } catch (error) {
      console.error('Error submitting schedule:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save schedule'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: name === 'maxSlots' ? parseInt(value) || 2 : value
    }));
  };

  const handleEdit = (index) => {
    const schedule = schedules[index];
    setNewSchedule({
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location,
      maxSlots: schedule.maxSlots,
      subjectId: schedule.subjectId
    });
    setEditingIndex(index);
    setIsAddingSchedule(true);
  };

  const handleDelete = async (index) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('authToken');
        const scheduleId = schedules[index]._id;
        await axios.delete(`http://localhost:5000/api/schedules/${scheduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        await fetchSchedules(token, userData);
        
        Swal.fire(
          'Deleted!',
          'Your schedule has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete schedule'
      });
    }
  };

  const handleCancel = () => {
    setIsAddingSchedule(false);
    setEditingIndex(null);
    setNewSchedule({
      day: '',
      startTime: '',
      endTime: '',
      location: '',
      maxSlots: 2,
      subjectId: ''
    });
  };

  const handleBack = () => {
    navigate('/appointmentcards');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/faculty-profile');
    setShowProfileDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
  };

  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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
                onClick={() => navigate('/schedule')}
              >
                <ScheduleIcon />
                Schedule
              </button>
              <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                <div 
                  onClick={toggleDropdown}
                  style={{ cursor: 'pointer' }}
                  className="d-flex align-items-center text-white"
                >
                  <AccountCircleIcon 
                    style={{ fontSize: '2rem', marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: '500' }}>
                    {userData?.name || 'User'}
                  </span>
                </div>
                
                {showProfileDropdown && (
                  <div 
                    className="dropdown-menu show position-absolute end-0"
                    style={{ marginTop: '10px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div 
                      className="dropdown-item"
                      onClick={handleProfileClick}
                    >
                      <AccountCircleIcon className="me-2" fontSize="small" />
                      Profile
                    </div>
                    <div className="dropdown-divider"></div>
                    <div 
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <LogoutIcon className="me-2" fontSize="small" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {isAddingSchedule ? (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Apply Subject</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddingSchedule(true)}
                >
                  <AddIcon className="me-1" />
                  Add New Schedule
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="subjectId" className="form-label">Subject</label>
                      <select
                        id="subjectId"
                        name="subjectId"
                        className="form-select"
                        value={newSchedule.subjectId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a subject...</option>
                        {subjects.map(subject => (
                          <option key={subject._id} value={subject._id}>
                            {subject.subjectCode} - {subject.subjectName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="maxSlots" className="form-label">Max Slots</label>
                      <input
                        type="number"
                        id="maxSlots"
                        name="maxSlots"
                        className="form-control"
                        value={newSchedule.maxSlots}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                    <SaveIcon className="me-1" />
                    {editingIndex !== null ? 'Update Schedule' : 'Save Schedule'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    <CloseIcon className="me-1" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Apply Subject</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddingSchedule(true)}
                >
                  <AddIcon className="me-1" />
                  Add New Schedule
                </button>
              </div>
              {schedules.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        {/* Removed Time and Location columns */}
                        <th>Slots</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((schedule, index) => (
                        <tr key={schedule._id}>
                          <td>
                            {schedule.subject ? (
                              <div>
                                <div className="fw-bold">{schedule.subject.subjectCode}</div>
                                <small className="text-muted">{schedule.subject.subjectName}</small>
                              </div>
                            ) : (
                              <span className="text-muted">Unknown Subject</span>
                            )}
                          </td>
                          {/* Removed Time and Location data cells */}
                          <td>
                            <div className="d-flex align-items-center">
                              <span className={`badge ${schedule.currentSlots >= schedule.maxSlots ? 'bg-danger' : 'bg-success'} me-2`}>
                                {schedule.currentSlots || 0}/{schedule.maxSlots}
                              </span>
                              {schedule.currentSlots >= schedule.maxSlots && (
                                <small className="text-danger">Full</small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(index)}
                              >
                                <EditIcon fontSize="small" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No schedules found. Click the button above to add one.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
