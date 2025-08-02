import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Status badge component
const ConsultationStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <span className={`badge bg-${getStatusColor(status)}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

const Consultation = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  
  // Add refresh functionality
  const refreshData = () => {
    setLoading(true);
    fetchConsultations();
  };

  const toggleDebug = () => {
    setDebugMode(!debugMode);
  };

  // Fetch consultation data
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const userDataStr = localStorage.getItem('userData');
      
      if (!token || !userDataStr) {
        throw new Error('Authentication required');
      }

      const userData = JSON.parse(userDataStr);
      
      // Check if admin
      if (userData.role !== 'admin') {
        throw new Error('Admin access required');
      }

      // First try the detailed endpoint
      try {
        const response = await axios.get('http://localhost:5000/api/consultations/all-details', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Fetched consultations from all-details:', response.data);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setConsultations(response.data);
          setLoading(false);
          return;
        }
      } catch (detailsError) {
        console.warn('Error fetching from all-details endpoint, trying standard endpoint', detailsError);
      }
      
      // Fallback to standard endpoint
      const response = await axios.get('http://localhost:5000/api/consultations', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetched consultations from standard endpoint:', response.data);
      
      // Handle both array and object responses
      let consultationData = response.data;
      if (!Array.isArray(consultationData)) {
        if (consultationData.consultations) {
          consultationData = consultationData.consultations;
        } else {
          consultationData = [consultationData];
        }
      }
      
      setConsultations(consultationData || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError(error.message || 'Failed to fetch consultations');
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchConsultations();
  }, [navigate]);

  // Format schedule information
  const formatSchedule = (schedule) => {
    if (!schedule) return 'No schedule';
    
    // Handle string ID instead of object
    if (typeof schedule === 'string') {
      return `ID: ${schedule}`;
    }
    
    // Handle partial data
    if (!schedule.day || !schedule.startTime || !schedule.endTime) {
      const parts = [];
      if (schedule.day) parts.push(schedule.day);
      if (schedule.startTime) parts.push(schedule.startTime);
      if (schedule.endTime) parts.push(schedule.endTime);
      return parts.length > 0 ? parts.join(' - ') : 'Incomplete';
    }
    
    // Format time
    const formatTime = (timeStr) => {
      try {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      } catch (e) {
        return timeStr;
      }
    };
    
    return `${schedule.day} ${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`;
  };

  // Get value safely from nested objects
  const getValue = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;
    
    // Handle direct string values
    if (typeof obj === 'string') return obj;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    return value || defaultValue;
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <p>{error}</p>
          <button className="btn btn-sm btn-outline-danger" onClick={refreshData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug view
  if (debugMode) {
    return (
      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col">
            <h2>Debug Mode</h2>
            <p className="text-muted">Viewing raw consultation data</p>
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-secondary me-2" onClick={toggleDebug}>
              Exit Debug
            </button>
            <button className="btn btn-outline-primary" onClick={refreshData}>
              Refresh
            </button>
          </div>
        </div>
        
        <div className="card shadow-sm">
          <div className="card-body">
            <pre style={{ maxHeight: '600px', overflow: 'auto' }}>
              {JSON.stringify(consultations, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // Render consultation data
  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2>All Consultations</h2>
          <p className="text-muted">Admin view of consultation requests</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-secondary me-2" onClick={toggleDebug}>
            Debug Data
          </button>
          <button className="btn btn-outline-primary" onClick={refreshData}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Student</th>
                  <th>Faculty</th>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Schedule</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length > 0 ? (
                  consultations.map((consultation, index) => {
                    // Extract data with flexible path handling
                    const studentName = getValue(consultation, 'student.name') || 
                                       getValue(consultation, 'studentId.name') || 
                                       getValue(consultation, 'studentName') || 
                                       'Student';
                    
                    const facultyName = getValue(consultation, 'faculty.name') || 
                                       getValue(consultation, 'facultyId.name') || 
                                       getValue(consultation, 'facultyName') || 
                                       'Faculty';
                    
                    const subjectName = getValue(consultation, 'subject.name') || 
                                       getValue(consultation, 'subjectId.name') || 
                                       getValue(consultation, 'subjectName') || 
                                       'Subject';
                    
                    const section = getValue(consultation, 'section') || 'N/A';
                    
                    // Try multiple possible schedule paths
                    const schedule = consultation.schedule || 
                                    consultation.scheduleId || 
                                    {};
                    
                    const scheduleInfo = formatSchedule(schedule);
                    
                    const location = getValue(schedule, 'location') || 
                                    getValue(consultation, 'location') || 
                                    'Room';
                    
                    const status = getValue(consultation, 'status') || 'pending';
                    
                    return (
                      <tr key={consultation._id || index} 
                          className={
                            status === 'approved' ? 'table-success' : status === 'rejected' ? 'table-danger' : ''
                          }
                      >
                        <td className="fw-bold">{studentName}</td>
                        <td>{facultyName}</td>
                        <td>{subjectName}</td>
                        <td>{section}</td>
                        <td>{scheduleInfo}</td>
                        <td>{location}</td>
                        <td>
                          <ConsultationStatusBadge status={status} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">No consultations found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;