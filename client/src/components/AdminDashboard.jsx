import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Consultation from './Consultation';
import { Modal, Button } from 'react-bootstrap';

// Update the ViewModal component at the top of the file
const ViewModal = ({ show, onHide, item, type }) => {
  if (!item) return null;

  return (
    <>
      <div 
        className={`modal ${show ? 'show' : ''}`} 
        style={{ 
          display: show ? 'block' : 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {type === 'student' ? 'Student Details' : 'Faculty Details'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onHide}
                style={{ cursor: 'pointer' }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <strong>ID: </strong>
                {type === 'student' ? item.school_id : item.school_id}
              </div>
              <div className="mb-3">
                <strong>Name: </strong>
                {item.name}
              </div>
              <div className="mb-3">
                <strong>Email: </strong>
                {item.email}
              </div>
              {type === 'student' ? (
                <>
                  <div className="mb-3">
                    <strong>Year Level: </strong>
                    {item.year_level}
                  </div>
                  <div className="mb-3">
                    <strong>Section: </strong>
                    {item.section}
                  </div>
                  <div className="mb-3">
                    <strong>Program: </strong>
                    {item.program}
                  </div>
                  <div className="mb-3">
                    <strong>Academic Year: </strong>
                    {item.academic_year}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <strong>Department: </strong>
                    {item.department || 'Not specified'}
                  </div>
                  <div className="mb-3">
                    <strong>Position: </strong>
                    {item.position || 'Not specified'}
                  </div>
                  <div className="mb-3">
                    <strong>Contact Number: </strong>
                    {item.contact_number || 'Not specified'}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onHide}
                style={{ cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    firstYear: 0,
    secondYear: 0,
    thirdYear: 0,
    fourthYear: 0,
    totalFaculty: 0
  });
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState('student');
  const [unverifiedUsers, setUnverifiedUsers] = useState([]); // New state for unverified users
  
  // New state variables for managing modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStudentData, setNewStudentData] = useState({
    school_id: '',
    name: '',
    email: '',
    password: '',
    year_level: '',
    section: '',
    academic_year: ''
  });
  const [newFacultyData, setNewFacultyData] = useState({
    school_id: '',
    name: '',
    email: '',
    password: ''
  });

  // Add a new state for consultations
  const [consultations, setConsultations] = useState([]);

  // Update the notifications state to be empty initially
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Add this state variable with the other state declarations
  const [currentPage, setCurrentPage] = useState(1);

  // Add state for messages
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);

  // Add state for the announcement modal
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: '',
    sender: 'Admin',
    sendToAll: true
  });
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  // Add state for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudentData, setEditStudentData] = useState({ school_id: '', name: '', section: '', _id: '' });

  // Add state for originalSchoolId
  const [originalSchoolId, setOriginalSchoolId] = useState('');

  // Add state for faculty edit modal
  const [showFacultyEditModal, setShowFacultyEditModal] = useState(false);
  const [editFacultyData, setEditFacultyData] = useState({ school_id: '', name: '', _id: '' });
  const [originalFacultySchoolId, setOriginalFacultySchoolId] = useState('');

  // Add state for course and semester filters at the top of AdminDashboard
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('1st Semester, 2025–2026');

  // Add these functions before the return statement
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(students.length / entriesPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Add a new function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please login again',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      console.log('Fetching notifications...');
      const response = await axios({
        method: 'get',
        url: 'http://localhost:5000/api/consultations/notifications',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      });

      console.log('Notifications response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      if (response.status === 401) {
        console.error('Authentication failed:', response.data);
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please login again',
          confirmButtonText: 'OK'
        }).then(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          navigate('/login');
        });
        return;
      }

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch notifications');
      }

      const notificationsData = response.data.map(consultation => ({
        id: consultation._id,
        title: 'New Consultation Request',
        message: `Student ${consultation.studentName} requested a consultation for ${consultation.subject}`,
        time: new Date(consultation.createdAt).toLocaleString(),
        isRead: consultation.isRead || false,
        consultationId: consultation._id
      }));
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', {
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      let errorMessage = 'Failed to fetch notifications';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Add this useEffect to fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Add this function to mark notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please login again',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      console.log('Attempting to mark notifications as read...');
      const url = 'http://localhost:5000/api/consultations/notifications/read';
      console.log('Request URL:', url);
      console.log('Request method: PUT');
      console.log('Headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`,
        'Content-Type': 'application/json'
      });
      
      const response = await axios({
        method: 'put',
        url: url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {},
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      });
      
      console.log('Mark notifications response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      if (response.status === 401) {
        console.error('Authentication failed:', response.data);
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please login again',
          confirmButtonText: 'OK'
        }).then(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          navigate('/login');
        });
        return;
      }

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to mark notifications as read');
      }
      
      // Clear the notifications after marking them as read
      setNotifications([]);
      // Fetch notifications again to get the updated list
      await fetchNotifications();

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Notifications marked as read',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Error marking notifications as read:', {
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      let errorMessage = 'Failed to mark notifications as read';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Update the NotificationModal component
  const NotificationModal = ({ show, onHide }) => {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item p-3 border-bottom ${!notification.isRead ? 'bg-light' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNotificationClick(notification.consultationId)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-1">{notification.title}</h6>
                    <small className="text-muted">{notification.time}</small>
                  </div>
                  <p className="mb-0 text-muted">{notification.message}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted my-3">No notifications</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              markNotificationsAsRead();
            }}
          >
            Mark all as read
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        // Configure axios defaults with token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        
        // Log the token and headers for debugging
        console.log('Token:', token);
        console.log('Axios headers:', axios.defaults.headers.common);

        // Check if the user is the admin
        if (userData.email !== '1801101934@student.buksu.edu.ph') {
          console.log('Not admin user, redirecting');
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Only administrators can access this page',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/login');
          });
          return;
        }

        // Fetch all data with proper error handling
        try {
          console.log('Fetching data...');
          
          // First try the stats endpoint
          const statsRes = await axios.get('http://localhost:5000/api/users/stats');
          console.log('Stats response:', statsRes.data);
          setStats(statsRes.data);

          // Then try the students endpoint
          const studentsRes = await axios.get('http://localhost:5000/api/users/students');
          console.log('Students response:', studentsRes.data);
          setStudents(studentsRes.data);

          // Then try the faculty endpoint
          try {
            console.log('Attempting to fetch faculty data...');
            const facultyRes = await axios.get('http://localhost:5000/api/faculty-with-subjects', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            // Log the entire response for debugging
            console.log('Raw faculty response:', facultyRes);
            console.log('Faculty data:', facultyRes.data);
            
            // Ensure we have an array of faculty members
            if (Array.isArray(facultyRes.data)) {
              setFaculty(facultyRes.data);
              console.log('Faculty state updated with:', facultyRes.data.length, 'members');
            } else {
              console.error('Invalid faculty data format:', facultyRes.data);
              setFaculty([]);
            }

            setLoading(false);
          } catch (error) {
            console.error('Error fetching faculty data:', error);
            if (error.response?.status === 401) {
              navigate('/login');
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch faculty data. Please try again later.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
              });
            }
            setFaculty([]);
            setLoading(false);
          }

          setLoading(false);
        } catch (error) {
          console.error('API Error:', error.response?.data || error.message);
          
          if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            Swal.fire({
              icon: 'error',
              title: 'Session Expired',
              text: 'Please login again',
              confirmButtonText: 'OK'
            }).then(() => {
              navigate('/login');
            });
          } else if (error.response?.status === 403) {
            // Unauthorized access
            Swal.fire({
              icon: 'error',
              title: 'Access Denied',
              text: 'You do not have permission to access this resource',
              confirmButtonText: 'OK'
            }).then(() => {
              navigate('/login');
            });
          } else {
            // Other errors
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response?.data?.message || 'Failed to fetch dashboard data'
            });
          }
          
          // Set default values on error
          setStats({
            firstYear: 0,
            secondYear: 0,
            thirdYear: 0,
            fourthYear: 0,
            totalFaculty: 0
          });
          setStudents([]);
          setFaculty([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred'
        });
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleDelete = async (id, role) => {
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
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        
        // Refresh data
        const [dataRes, statsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${role === 'student' ? 'students' : 'faculty'}`),
          axios.get('http://localhost:5000/api/users/stats')
        ]);

        if (role === 'student') {
          setStudents(dataRes.data);
        } else {
          setFaculty(dataRes.data);
        }
        setStats(statsRes.data);

        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
      Swal.fire(
        'Error!',
        'Failed to delete user.',
        'error'
      );
    }
  };

  const handleExcelExport = () => {
    try {
      const data = activeTab === 'student' ? students : faculty;
      const fileName = `${activeTab}_list_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      const ws = XLSX.utils.json_to_sheet(data.map(item => ({
        ID: activeTab === 'student' ? item.school_id : item.school_id,
        Name: item.name,
        Email: item.email,
        ...(activeTab === 'student' ? {
          'Year Level': item.year_level,
          Section: item.section,
          Program: item.program
        } : {
          Subjects: Array.isArray(item.subjects) ? item.subjects.join(', ') : item.subjects
        })
      })));
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeTab === 'student' ? 'Students' : 'Faculty');
      XLSX.writeFile(wb, fileName);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Excel file has been downloaded!'
      });
    } catch (error) {
      console.error('Excel export error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to export Excel file'
      });
    }
  };

  const handlePDFExport = () => {
    try {
      const doc = new jsPDF();
      const data = activeTab === 'student' ? students : faculty;
      
      // Title
      doc.setFontSize(16);
      doc.text(`${activeTab === 'student' ? 'Student' : 'Faculty'} List`, 14, 15);
      
      // Date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

      const columns = activeTab === 'student' 
        ? ['ID', 'Name', 'Email', 'Year Level', 'Section', 'Program']
        : ['ID', 'Name', 'Email', 'Subjects'];

      const rows = data.map(item => 
        activeTab === 'student' 
          ? [
              item.school_id,
              item.name,
              item.email,
              item.year_level,
              item.section,
              item.program
            ]
          : [
              item.school_id,
              item.name,
              item.email,
              Array.isArray(item.subjects) ? item.subjects.join(', ') : item.subjects
            ]
      );

      doc.autoTable({
        startY: 30,
        head: [columns],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      doc.save(`${activeTab}_list_${new Date().toISOString().split('T')[0]}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'PDF file has been downloaded!'
      });
    } catch (error) {
      console.error('PDF export error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to export PDF file'
      });
    }
  };

  const handleManageStudent = () => {
    setShowAddStudentModal(true);
  };

  const handleManageFaculty = () => {
    setShowAddFacultyModal(true);
  };

  // New handler functions for modals
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        {
          ...newStudentData,
          role: 'student'
        }
      );
      
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Student added successfully!'
        });
        setShowAddStudentModal(false);
        setNewStudentData({
          school_id: '',
          name: '',
          email: '',
          password: '',
          year_level: '',
          section: '',
          academic_year: ''
        });
        
        // Refresh data using the correct endpoints
        const [studentsRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/students'),
          axios.get('http://localhost:5000/api/users/stats')
        ]);

        // Update state with new data
        setStats(statsRes.data);
        setStudents(studentsRes.data);
      }
    } catch (error) {
      console.error('Add student error:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add student'
      });
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        {
          ...newFacultyData,
          role: 'faculty'
        }
      );
      
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Faculty added successfully!'
        });
        setShowAddFacultyModal(false);
        setNewFacultyData({
          school_id: '',
          name: '',
          email: '',
          password: ''
        });
        
        // Refresh data using the correct endpoints
        const [facultyRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/faculty-with-subjects'),
          axios.get('http://localhost:5000/api/users/stats')
        ]);

        // Update state with new data
        setStats(statsRes.data);
        setFaculty(facultyRes.data);
      }
    } catch (error) {
      console.error('Add faculty error:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add faculty'
      });
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleInputChange = (e, type) => {
    const { name, value, type: inputType, checked } = e.target;
    if (type === 'student') {
      setNewStudentData(prev => ({
        ...prev,
        [name]: inputType === 'checkbox' ? checked : value
      }));
    } else {
      setNewFacultyData(prev => ({
        ...prev,
        [name]: inputType === 'checkbox' ? checked : value
      }));
    }
  };

  // Add a function to fetch consultations
  const fetchConsultations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/consultations');
      // Only include consultations with status 'approved', 'rejected', or 'completed' (case-insensitive)
      const filtered = response.data.filter(c => ['approved', 'rejected', 'completed'].includes((c.status || '').toLowerCase()));
      console.log('Filtered consultations for admin:', filtered.map(c => c.status));
      setConsultations(filtered);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch consultations'
      });
    }
  };

  // Add functions to fetch faculty and student consultations
  const fetchFacultyConsultations = async () => {
    try {
      const facultyId = 'your-faculty-id-here'; // Replace with the actual faculty ID
      const response = await axios.get(`/api/consultations/faculty/${facultyId}`);
      Swal.fire({
        title: 'Faculty Consultations',
        html: response.data.map(consultation => `
          <div>
            <strong>Faculty:</strong> ${consultation.facultyId}<br/>
            <strong>Details:</strong> ${consultation.details}
          </div>
          <hr/>
        `).join(''),
        width: '600px',
        confirmButtonText: 'Close'
      });
    } catch (error) {
      console.error('Error fetching faculty consultations:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch faculty consultations'
      });
    }
  };

  const fetchStudentConsultations = async () => {
    try {
      const response = await axios.get('/api/consultations/student');
      Swal.fire({
        title: 'Student Consultations',
        html: response.data.map(consultation => `
          <div>
            <strong>Student:</strong> ${consultation.studentName}<br/>
            <strong>Details:</strong> ${consultation.details}
          </div>
          <hr/>
        `).join(''),
        width: '600px',
        confirmButtonText: 'Close'
      });
    } catch (error) {
      console.error('Error fetching student consultations:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch student consultations'
      });
    }
  };

  // Add function to fetch messages
  const fetchMessages = async () => {
    try {
      setMessageLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please login again',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      console.log('Fetching messages...');
      const response = await axios.get('http://localhost:5000/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Messages response:', response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch messages',
        confirmButtonText: 'OK'
      });
    } finally {
      setMessageLoading(false);
    }
  };

  // Add useEffect to fetch messages when activeTab is 'messages'
  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  // Add function to handle message deletion
  const handleDeleteMessage = async (messageId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this message?')) {
        return;
      }

      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove message from state
      setMessages(messages.filter(msg => msg._id !== messageId));
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Message deleted successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete message',
        confirmButtonText: 'OK'
      });
    }
  };

  // Add function to handle announcement form changes
  const handleAnnouncementChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnnouncementData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add function to submit the announcement
  const handleSubmitAnnouncement = async () => {
    try {
      if (!announcementData.title || !announcementData.message) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill in all required fields',
          confirmButtonText: 'OK'
        });
        return;
      }

      setSendingAnnouncement(true);
      const token = localStorage.getItem('authToken');
      
      // Get admin user data
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Create the announcement data
      const announcement = {
        title: announcementData.title,
        message: announcementData.message,
        userName: userData.name || 'Administrator',
        userEmail: userData.email,
        sender: 'Admin',
        reportType: 'Announcement',
        sendToAll: announcementData.sendToAll
      };

      console.log('Sending announcement:', announcement);

      // Send the announcement to the server
      const response = await axios.post(
        'http://localhost:5000/api/messages',
        announcement,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        let successMessage = 'Announcement created successfully';
        if (announcementData.sendToAll) {
          successMessage += ' and will be sent to all users via email';
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: successMessage,
          confirmButtonText: 'OK'
        });
        
        // Reset form and close modal
        setAnnouncementData({
          title: '',
          message: '',
          sender: 'Admin',
          sendToAll: true
        });
        setShowAnnouncementModal(false);
        
        // Refresh messages list
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to send announcement',
        confirmButtonText: 'OK'
      });
    } finally {
      setSendingAnnouncement(false);
    }
  };

  // Edit button handler
  const handleEdit = (student) => {
    setEditStudentData({
      school_id: student.school_id,
      name: student.name,
      section: student.section,
      _id: student._id
    });
    setOriginalSchoolId(student.school_id); // Store the original ID
    setShowEditModal(true);
  };

  // Handle input change in edit modal
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditStudentData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edit
  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${originalSchoolId}`, {
        school_id: editStudentData.school_id,
        name: editStudentData.name,
        section: editStudentData.section
      });
      setShowEditModal(false);
      // Refresh students list
      const res = await axios.get('http://localhost:5000/api/users/students');
      setStudents(res.data);
      Swal.fire({ icon: 'success', title: 'Success', text: 'Student updated!' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to update student' });
    }
  };

  // Edit button handler for faculty
  const handleFacultyEdit = (faculty) => {
    setEditFacultyData({
      school_id: faculty.school_id,
      name: faculty.name,
      _id: faculty._id
    });
    setOriginalFacultySchoolId(faculty.school_id);
    setShowFacultyEditModal(true);
  };

  // Handle input change in faculty edit modal
  const handleFacultyEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFacultyData((prev) => ({ ...prev, [name]: value }));
  };

  // Save faculty edit
  const handleFacultyEditSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${originalFacultySchoolId}`, {
        school_id: editFacultyData.school_id,
        name: editFacultyData.name
      });
      setShowFacultyEditModal(false);
      // Refresh faculty list
      const res = await axios.get('http://localhost:5000/api/users/faculty');
      setFaculty(res.data);
      Swal.fire({ icon: 'success', title: 'Success', text: 'Faculty updated!' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to update faculty' });
    }
  };

  // Add these styles at the top of the file after the imports
  const styles = `
    .notification-item {
      transition: background-color 0.3s;
    }
    
    .notification-item:hover {
      background-color: rgba(0,0,0,0.05);
    }

    .notification-item:last-child {
      border-bottom: none !important;
    }
  `;

  // Add this useEffect after the other useEffects
  useEffect(() => {
    // Add the styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'unverified') {
      // Fetch unverified users when the tab is selected
      const fetchUnverifiedUsers = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const res = await axios.get('http://localhost:5000/api/users/unverified', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setUnverifiedUsers(res.data);
        } catch (error) {
          setUnverifiedUsers([]);
          console.error('Error fetching unverified users:', error);
        }
      };
      fetchUnverifiedUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'consultation') {
      const fetchConsultations = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get('http://localhost:5000/api/consultations', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Admin Dashboard - Fetched consultations:', response.data);
          console.log('Sample consultation purpose:', response.data[0]?.purpose);
          setConsultations(response.data);
        } catch (error) {
          console.error('Error fetching consultations:', error);
        } finally {
          setLoadingConsultations(false);
        }
      };
      fetchConsultations();
    }
  }, [activeTab]);

  // Get unique instructors for the filter dropdown
  const instructorList = Array.from(new Set(
    consultations.map(c => c.facultyId?.name || c.facultyName || 'Unknown Instructor')
  ));

  // Add state for selectedInstructor
  const [selectedInstructor, setSelectedInstructor] = useState('All Instructors');
  const [loadingConsultations, setLoadingConsultations] = useState(true);

  // Add this function before the return statement
  const handleConsultationPDFExport = () => {
    try {
      const doc = new jsPDF();
      let y = 15;
      // Try to add logos if possible
      const addImageToPDF = (doc, imgPath, x, y, w, h, cb) => {
        const img = new window.Image();
        img.src = imgPath;
        img.onload = function () {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            doc.addImage(dataUrl, 'PNG', x, y, w, h);
          } catch (e) {}
          if (cb) cb();
        };
        img.onerror = function () { if (cb) cb(); };
      };
      // Add left logo
      addImageToPDF(doc, '/assets/img/branding/brand-img-small.png', 14, y, 18, 18);
      // Add right logo
      addImageToPDF(doc, '/assets/img/branding/brand-img-right.png', 178, y, 18, 18);
      // School header text
      doc.setFontSize(14);
      doc.text('BUKIDNON STATE UNIVERSITY', 105, y + 6, { align: 'center' });
      doc.setFontSize(10);
      doc.text('College of Technologies', 105, y + 12, { align: 'center' });
      doc.text('Malaybalay City, Bukidnon 8700', 105, y + 17, { align: 'center' });
      doc.text('Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717', 105, y + 22, { align: 'center' });
      doc.setTextColor(41, 128, 185);
      doc.textWithLink('www.buksu.edu.ph', 105, y + 27, { align: 'center', url: 'https://www.buksu.edu.ph' });
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(`COT STUDENT'S CONSULTATION LOG BOOK`, 105, y + 34, { align: 'center' });
      y += 42;
      // Consultation Records title
      doc.setFontSize(14);
      doc.text('Consultation Records', 14, y);
      y += 8;
      // Group by instructor
      const grouped = consultations.reduce((acc, c) => {
        const instructor = c.facultyId?.name || c.facultyName || 'Unknown Instructor';
        if (!acc[instructor]) acc[instructor] = [];
        acc[instructor].push(c);
        return acc;
      }, {});
      Object.entries(grouped).forEach(([instructor, records], idx) => {
        if (y > doc.internal.pageSize.height - 40) {
          doc.addPage();
          y = 15;
        }
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(`Instructor: ${instructor}`, 14, y);
        y += 6;
        doc.setTextColor(0);
        const columns = ['Email', 'Student Name', 'Day of Consultation', 'Purpose', 'Course-Year Level', 'Remarks'];
        const rows = records.map(rec => {
          const student = rec.studentId || rec.student || {};
          const course = student.program || student.course || rec.subject?.program || rec.subject?.course || 'N/A';
          const yearLevel = student.year_level || student.yearLevel || 'N/A';
          const section = student.section || rec.section || 'N/A';
          const courseYearLevel = course !== 'N/A' && yearLevel !== 'N/A' && section !== 'N/A'
            ? `${course} ${yearLevel}${section}`
            : 'N/A';
          let remarks = rec.status ? rec.status.charAt(0).toUpperCase() + rec.status.slice(1) : 'N/A';
          if (rec.status && ['completed', 'rejected'].includes(rec.status.toLowerCase())) {
            remarks = 'Marked as Done';
          }
          return [
            rec.studentId?.email || rec.studentEmail || 'N/A',
            rec.studentId?.name || rec.studentName || 'N/A',
            rec.schedule
              ? `${rec.schedule.day || 'N/A'} ${rec.schedule.startTime || ''}${rec.schedule.endTime ? ' - ' + rec.schedule.endTime : ''}`
              : 'No Schedule',
            rec.purpose || 'No purpose recorded',
            courseYearLevel,
            remarks
          ];
        });
        doc.autoTable({
          startY: y,
          head: [columns],
          body: rows,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 14, right: 14 },
          didDrawCell: function (data) {
            if (data.column.index === 4 && data.cell.raw) {
              // Remarks badge style
              let color = [108, 117, 125]; // gray
              if (data.cell.raw === 'Mark as Complete') color = [40, 167, 69]; // green
              if (data.cell.raw === 'Rejected') color = [220, 53, 69]; // red
              if (data.cell.raw === 'Pending') color = [108, 117, 125]; // gray
              data.cell.styles.fillColor = color;
              data.cell.styles.textColor = 255;
              data.cell.styles.fontStyle = 'bold';
            }
          },
          didDrawPage: (data) => {
            y = data.cursor.y + 8;
          }
        });
      });
      // Add time and date at the bottom in light color
      const pageHeight = doc.internal.pageSize.height;
      doc.setTextColor(180);
      doc.setFontSize(9);
      doc.text(`Exported: ${new Date().toLocaleString()}`, 14, pageHeight - 10);
      doc.save(`consultation_records_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to export PDF file'
      });
    }
  };

  if (loading) {
    return (
      <div className="container-xxl">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Left Sidebar */}
      <div className="sidebar bg-dark text-white" style={{ width: '250px', minHeight: '100vh', position: 'fixed' }}>
        <div className="p-3">
          <h3 className="text-white mb-4">CONSULTEASE</h3>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-white-50 mb-4">ADMIN DASHBOARD</h6>
            <div className="position-relative d-inline-block">
              <i
                className="bx bx-bell text-white"
                style={{ fontSize: '24px', cursor: 'pointer', paddingTop: '1px', paddingBottom: '25px', paddingRight: '10px' }}
                onClick={() => setShowNotifications(true)}
              ></i>
              {notifications.some(n => !n.isRead) && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem', marginLeft: '-8px' }}
                >
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </div>
          </div>
        </div>
        <nav className="nav flex-column">
          <Link 
            to="/admin" 
            className={`nav-link d-flex align-items-center ${activeTab === 'student' ? 'text-white' : 'text-white-50'}`}
            onClick={() => setActiveTab('student')}
          >
            <i className="bx bx-user me-2"></i>
            Student
          </Link>
          <Link 
            to="#" 
            className={`nav-link d-flex align-items-center ${activeTab === 'faculty' ? 'text-white' : 'text-white-50'}`}
            onClick={() => setActiveTab('faculty')}
          >
            <i className="bx bx-group me-2"></i>
            Faculty
          </Link>
          <Link 
            to="#" 
            className={`nav-link d-flex align-items-center ${activeTab === 'unverified' ? 'text-white' : 'text-white-50'}`}
            onClick={() => setActiveTab('unverified')}
          >
            <i className="bx bx-error me-2"></i>
            Unverified Users
          </Link>
          <Link 
            to="#" 
            className={`nav-link d-flex align-items-center ${activeTab === 'consultation' ? 'text-white' : 'text-white-50'}`}
            onClick={() => setActiveTab('consultation')}
          >
            <i className="bx bx-calendar me-2"></i>
            Consultation
          </Link>
          <Link 
            to="#" 
            className={`nav-link d-flex align-items-center ${activeTab === 'messages' ? 'text-white' : 'text-white-50'}`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="bx bx-message-dots me-2"></i>
            Messages / Reports
          </Link>
        </nav>
        {/* Logout Button at bottom */}
        <div style={{ position: 'absolute', bottom: '20px', width: '100%', padding: '0 15px' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              window.location.href = '/login';
            }}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          >
            <i className="bx bx-log-out me-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: '250px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Admin</li>
            <li className="breadcrumb-item active">
              {activeTab === 'student' ? 'Manage Student' : activeTab === 'faculty' ? 'Manage Faculty' : activeTab === 'consultation' ? 'Consultation' : 'Messages / Reports'}
            </li>
            {activeTab === 'consultation' && (
              <li className="ms-auto">
                <button className="btn btn-danger btn-sm" onClick={handleConsultationPDFExport}>
                  <i className="bx bx-file me-1"></i>
                  Export PDF
                </button>
              </li>
            )}
          </ol>
        </nav>

        {activeTab === 'student' && (
          <>
            {/* Statistics Cards */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="content-left">
                        <span style={{ fontWeight: 'bold' }}>1st Year</span>
                        <div className="d-flex align-items-end mt-2">
                          <h4 className="mb-0 me-2">{stats.firstYear}</h4>
                        </div>
                        <small>Total Students</small>
                      </div>
                      <span className="badge bg-label-primary rounded p-2">
                        <i className="bx bx-user bx-sm"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="content-left">
                        <span style={{ fontWeight: 'bold' }}>2nd Year</span>
                        <div className="d-flex align-items-end mt-2">
                          <h4 className="mb-0 me-2">{stats.secondYear}</h4>
                        </div>
                        <small>Total Students</small>
                      </div>
                      <span className="badge bg-label-danger rounded p-2">
                        <i className="bx bx-user bx-sm"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="content-left">
                        <span style={{ fontWeight: 'bold' }}>3rd Year</span>
                        <div className="d-flex align-items-end mt-2">
                          <h4 className="mb-0 me-2">{stats.thirdYear}</h4>
                        </div>
                        <small>Total Students</small>
                      </div>
                      <span className="badge bg-label-success rounded p-2">
                        <i className="bx bx-user bx-sm"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="content-left">
                        <span style={{ fontWeight: 'bold' }}>4th Year</span>
                        <div className="d-flex align-items-end mt-2">
                          <h4 className="mb-0 me-2">{stats.fourthYear}</h4>
                        </div>
                        <small>Total Students</small>
                      </div>
                      <span className="badge bg-label-warning rounded p-2">
                        <i className="bx bx-user bx-sm"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Table Card */}
            <div className="card">
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-2">
                    <div className="d-flex align-items-center">
                      <label className="me-2">Show</label>
                      <select 
                        className="form-select form-select-sm" 
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                      <label className="ms-2">entries</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-primary me-2" onClick={handleManageStudent}>
                      <i className="bx bx-plus me-1"></i>
                      Add Student
                    </button>
                    <button className="btn btn-success me-2" onClick={handleExcelExport}>
                      <i className="bx bx-file me-1"></i>
                      Excel
                    </button>
                    <button className="btn btn-danger" onClick={handlePDFExport}>
                      <i className="bx bx-file me-1"></i>
                      PDF
                    </button>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PROGRAM</th>
                        <th>YEAR</th>
                        <th>SECTION</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">No students found</td>
                        </tr>
                      ) : (
                        students
                          .filter(student => {
                            const term = searchTerm.toLowerCase();
                            return (
                              (student.name?.toLowerCase().includes(term)) ||
                              (student.school_id?.toString().toLowerCase().includes(term))
                            );
                          })
                          .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                          .map(student => (
                            <tr key={student._id}>
                              <td>{student.school_id}</td>
                              <td>{student.name}</td>
                              <td>{student.program}</td>
                              <td>{student.year_level}</td>
                              <td>{student.section}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-info me-2"
                                  onClick={() => handleView(student)}
                                >
                                  View
                                </button>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(student)}>Edit</button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(student._id, 'student')}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="row mt-3">
                  <div className="col-md-12">
                    <nav aria-label="Page navigation">
                      <ul className="pagination justify-content-end">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        <li className="page-item">
                          <span className="page-link">
                            Page {currentPage} of {Math.ceil(students.length / entriesPerPage)}
                          </span>
                        </li>
                        <li className={`page-item ${currentPage === Math.ceil(students.length / entriesPerPage) ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={handleNextPage}
                            disabled={currentPage === Math.ceil(students.length / entriesPerPage)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'faculty' && (
          <>
            {/* Faculty Statistics Card */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="content-left">
                        <span style={{ fontWeight: 'bold' }}>Total Faculty</span>
                        <div className="d-flex align-items-end mt-2">
                          <h4 className="mb-0 me-2">{stats.totalFaculty}</h4>
                        </div>
                        <small>Active Members</small>
                      </div>
                      <span className="badge bg-label-info rounded p-2">
                        <i className="bx bx-group bx-sm"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty Table Card */}
            <div className="card">
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <button className="btn btn-primary me-2" onClick={handleManageFaculty}>
                      <i className="bx bx-plus me-1"></i>
                      Add Faculty
                    </button>
                    <button className="btn btn-success me-2" onClick={handleExcelExport}>
                      <i className="bx bx-file me-1"></i>
                      Excel
                    </button>
                    <button className="btn btn-danger" onClick={handlePDFExport}>
                      <i className="bx bx-file me-1"></i>
                      PDF
                    </button>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, ID, or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {console.log('Current faculty state:', faculty)}
                      {!faculty || faculty.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">No faculty members found</td>
                        </tr>
                      ) : (
                        faculty
                          .filter(f => {
                            const term = searchTerm.toLowerCase();
                            return (
                              (f.name?.toLowerCase().includes(term)) ||
                              (f.email?.toLowerCase().includes(term)) ||
                              (f.school_id?.toString().toLowerCase().includes(term))
                            );
                          })
                          .map(faculty => (
                            <tr key={faculty._id}>
                              <td>{faculty.school_id}</td>
                              <td>{faculty.name}</td>
                              <td>{faculty.email}</td>
                              <td>
                                <button 
                                  className="btn btn-info btn-sm me-2"
                                  onClick={() => handleView(faculty)}
                                >
                                  View
                                </button>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleFacultyEdit(faculty)}>Edit</button>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(faculty._id, 'faculty')}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'unverified' && (
          <>
            {/* Unverified Users Table Card */}
            <div className="row g-4 mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Unverified Users</h5>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unverifiedUsers.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center">No unverified users found</td>
                            </tr>
                          ) : (
                            unverifiedUsers.map(user => (
                              <tr key={user._id}>
                                <td>{user.school_id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                  <button 
                                    className="btn btn-info btn-sm me-2"
                                    onClick={() => handleView(user)}
                                  >
                                    View
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(user._id, user.role)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'consultation' && (
          <>
            {/* School Header with Logos */}
            <div className="school-header text-center mb-3 d-flex align-items-center justify-content-center" style={{ gap: '24px' }}>
              <img src="/assets/img/branding/brand-img-small.png" alt="School Logo" style={{ height: '60px', marginRight: '16px', verticalAlign: 'middle' }} />
              <div style={{ flex: 1 }}>
                <h4 className="mb-1" style={{ fontSize: '18px' }}>BUKIDNON STATE UNIVERSITY</h4>
                <p className="mb-1" style={{ fontSize: '14px' }}>College of Technologies</p>
                <p className="mb-1" style={{ fontSize: '14px' }}>Malaybalay City, Bukidnon 8700</p>
                <p className="mb-1" style={{ fontSize: '14px' }}>Tel (088) 813-5661 to 5663; TeleFax (088) 813-2717</p>
                <p className="mb-1" style={{ fontSize: '14px' }}>
                  <a href="https://www.buksu.edu.ph" target="_blank" rel="noopener noreferrer">www.buksu.edu.ph</a>
                </p>
                <h5 className="mt-2 mb-0" style={{ fontSize: '16px' }}>COT STUDENT'S CONSULTATION LOG BOOK</h5>
              </div>
              <img src="/assets/img/branding/brand-img-right.png" alt="Right Logo" style={{ height: '60px', marginLeft: '16px', verticalAlign: 'middle' }} />
            </div>
            {/* Filter Section */}
            <div className="card p-4 mb-3 filter-section">
              <div className="row g-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">Filter by Instructor:</label>
                  <select className="form-select" value={selectedInstructor} onChange={e => setSelectedInstructor(e.target.value)}>
                    <option>All Instructors</option>
                    {instructorList.map((instructor, idx) => (
                      <option key={idx} value={instructor}>{instructor}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Semester & School Year:</label>
                  <select className="form-select" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
                    <option>1st Semester, 2025–2026</option>
                    <option>2nd Semester, 2025–2026</option>
                    <option>1st Semester, 2026–2027</option>
                    <option>2nd Semester, 2026–2027</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Course:</label>
                  <select className="form-select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                    <option value="All">All</option>
                    <option>BSIT</option>
                    <option>BSEMC</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Consultation Records */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Consultation Records</h5>
                <AdminConsultationRecords 
                  consultations={consultations} 
                  loading={loadingConsultations} 
                  selectedInstructor={selectedInstructor} 
                  selectedCourse={selectedCourse} 
                  selectedSemester={selectedSemester} 
                />
              </div>
            </div>
          </>
        )}
        {activeTab === 'messages' && (
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5 className="card-title">Messages / Reports</h5>
                  <p className="card-text">Manage student feedback, messages, and reports here.</p>
                </div>
                <div className="col-md-6 text-end">
                  <button 
                    className="btn btn-outline-primary me-2"
                    onClick={fetchMessages}
                    disabled={messageLoading}
                  >
                    <i className="bx bx-refresh me-1"></i>
                    Refresh
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAnnouncementModal(true)}
                  >
                    <i className="bx bx-megaphone me-1"></i>
                    Compose Announcement
                  </button>
                </div>
              </div>
              
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>SENDER</th>
                      <th>TITLE</th>
                      <th>MESSAGE</th>
                      <th>EMOJI</th>
                      <th>DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messageLoading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : messages.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">No messages or reports found</td>
                      </tr>
                    ) : (
                      messages.map((message) => (
                        <tr key={message._id}>
                          <td>{message.userName}</td>
                          <td>{message.title}</td>
                          <td>{message.message.length > 50 ? `${message.message.substring(0, 50)}...` : message.message}</td>
                          <td>{message.emoji || 'N/A'}</td>
                          <td>{new Date(message.date).toLocaleString()}</td>
                          <td>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteMessage(message._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Student</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddStudentModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddStudent}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ID Number</label>
                      <input
                        type="number"
                        className="form-control"
                        name="school_id"
                        value={newStudentData.school_id}
                        onChange={(e) => handleInputChange(e, 'student')}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newStudentData.name}
                        onChange={(e) => handleInputChange(e, 'student')}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={newStudentData.email}
                        onChange={(e) => handleInputChange(e, 'student')}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={newStudentData.password}
                        onChange={(e) => handleInputChange(e, 'student')}
                        required
                        minLength="6"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Year Level</label>
                      <select
                        className="form-select"
                        name="year_level"
                        value={newStudentData.year_level}
                        onChange={(e) => handleInputChange(e, 'student')}
                        required
                      >
                        <option value="">Select Year Level</option>
                        <option value="1st year">1st Year</option>
                        <option value="2nd year">2nd Year</option>
                        <option value="3rd year">3rd Year</option>
                        <option value="4th year">4th Year</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Section</label>
                      <input
                        type="text"
                        className="form-control"
                        name="section"
                        value={newStudentData.section}
                        onChange={(e) => {
                          const upperValue = e.target.value.toUpperCase();
                          setNewStudentData(prev => ({
                            ...prev,
                            section: upperValue
                          }));
                        }}
                        maxLength={1}
                        pattern="[A-Z]"
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Academic Year</label>
                      <select
                        className="form-select"
                        name="academic_year"
                        value={newStudentData.academic_year}
                        onChange={(e) => handleInputChange(e, 'student')}
                        required
                      >
                        <option value="">Select Academic Year</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                        <option value="2026-2027">2026-2027</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddStudentModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddFacultyModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Faculty</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddFacultyModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddFaculty}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ID Number</label>
                      <input
                        type="number"
                        className="form-control"
                        name="school_id"
                        value={newFacultyData.school_id}
                        onChange={(e) => handleInputChange(e, 'faculty')}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newFacultyData.name}
                        onChange={(e) => handleInputChange(e, 'faculty')}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={newFacultyData.email}
                        onChange={(e) => handleInputChange(e, 'faculty')}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={newFacultyData.password}
                        onChange={(e) => handleInputChange(e, 'faculty')}
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddFacultyModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Faculty
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      <ViewModal
        show={showViewModal}
        onHide={() => {
          setShowViewModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        type={activeTab}
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Student</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">ID</label>
                    <input type="text" className="form-control" name="school_id" value={editStudentData.school_id} onChange={handleEditInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={editStudentData.name} onChange={handleEditInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Section</label>
                    <input type="text" className="form-control" name="section" value={editStudentData.section} onChange={handleEditInputChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Edit Modal */}
      {showFacultyEditModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Faculty</h5>
                <button type="button" className="btn-close" onClick={() => setShowFacultyEditModal(false)}></button>
              </div>
              <form onSubmit={handleFacultyEditSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">ID</label>
                    <input type="text" className="form-control" name="school_id" value={editFacultyData.school_id} onChange={handleFacultyEditInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={editFacultyData.name} onChange={handleFacultyEditInputChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowFacultyEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal 
        show={showNotifications} 
        onHide={() => setShowNotifications(false)} 
      />

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Compose Announcement</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAnnouncementModal(false)}
                  disabled={sendingAnnouncement}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="announcementTitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="announcementTitle"
                    name="title"
                    value={announcementData.title}
                    onChange={handleAnnouncementChange}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="announcementMessage" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="announcementMessage"
                    name="message"
                    value={announcementData.message}
                    onChange={handleAnnouncementChange}
                    rows="5"
                    placeholder="Enter your announcement message here..."
                    required
                  ></textarea>
                  <small className="text-muted">
                    Examples: Server maintenance notice, system updates, temporary service interruptions, etc.
                  </small>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sendToAll"
                    name="sendToAll"
                    checked={true}
                    disabled={true}
                  />
                  <label className="form-check-label" htmlFor="sendToAll">
                    Send to all users via email
                  </label>
                  <div className="form-text text-muted">
                    Announcements will be sent as an email to all faculty and student accounts
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAnnouncementModal(false)}
                  disabled={sendingAnnouncement}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSubmitAnnouncement}
                  disabled={sendingAnnouncement}
                >
                  {sendingAnnouncement ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Announcement'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

function AdminConsultationRecords({ consultations, loading, selectedInstructor, selectedCourse, selectedSemester }) {
  console.log('AdminConsultationRecords - consultations:', consultations);
  console.log('Sample consultation purpose in records:', consultations[0]?.purpose);
  
  // Group by instructor
  const grouped = consultations.reduce((acc, c) => {
    const instructor = c.facultyId?.name || c.facultyName || 'Unknown Instructor';
    if (!acc[instructor]) acc[instructor] = [];
    acc[instructor].push(c);
    return acc;
  }, {});

  // Helper for badge color
  const getBadgeClass = (status) => {
    if (!status) return 'bg-secondary';
    if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'rejected') return 'bg-dark text-white fw-bold';
    return 'bg-secondary text-white';
  };

  if (loading) return <div>Loading...</div>;

  // Filtered instructors
  const filteredInstructors = selectedInstructor === 'All Instructors'
    ? Object.entries(grouped)
    : Object.entries(grouped).filter(([instructor]) => instructor === selectedInstructor);

  // Filter records by course and semester
  const filterByCourseAndSemester = (rec) => {
    // Course/program match - check this first
    if (selectedCourse && selectedCourse !== 'All') {
      const student = rec.studentId || rec.student || {};
      const program = student.program || student.course || rec.subject?.program || rec.subject?.course || '';
      console.log('Course filter check:', { selectedCourse, program, matches: program.includes(selectedCourse) });
      if (!program.includes(selectedCourse)) return false;
    }
    
    // Semester filter based on consultation date
    if (selectedSemester) {
      const consultationDate = new Date(rec.createdAt || rec.consultationDate);
      const consultationYear = consultationDate.getFullYear();
      const consultationMonth = consultationDate.getMonth() + 1; // January is 0
      
      console.log('Semester filter check:', { 
        selectedSemester, 
        consultationDate: consultationDate.toISOString(),
        consultationYear,
        consultationMonth
      });
      
      // Define semester ranges
      const semesterRanges = {
        '1st Semester, 2025–2026': { startYear: 2025, startMonth: 8, endYear: 2025, endMonth: 12 },
        '2nd Semester, 2025–2026': { startYear: 2026, startMonth: 1, endYear: 2026, endMonth: 5 },
        '1st Semester, 2026–2027': { startYear: 2026, startMonth: 8, endYear: 2026, endMonth: 12 },
        '2nd Semester, 2026–2027': { startYear: 2027, startMonth: 1, endYear: 2027, endMonth: 5 }
      };
      
      const range = semesterRanges[selectedSemester];
      if (range) {
        const isInRange = (
          (consultationYear === range.startYear && consultationMonth >= range.startMonth) ||
          (consultationYear === range.endYear && consultationMonth <= range.endMonth) ||
          (consultationYear > range.startYear && consultationYear < range.endYear)
        );
        
        console.log('Semester range check:', { range, isInRange });
        if (!isInRange) return false;
      }
    }
    
    return true;
  };

  return (
    <>
      {filteredInstructors.map(([instructor, records]) => (
        <div key={instructor}>
          <div className="instructor-title">Instructor: {instructor}</div>
          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Student Name</th>
                  <th>Day of Consultation</th>
                  <th>Purpose</th>
                  <th>Course-Year Level</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.filter(rec => ['approved', 'rejected', 'completed'].includes((rec.status || '').toLowerCase()))
                  .filter(filterByCourseAndSemester)
                  .map((rec, idx) => {
                    console.log('Processing consultation record:', rec);
                    console.log('Purpose in record:', rec.purpose);
                    // Try to get a better course, year level, and section value
                    const student = rec.studentId || rec.student || {};
                    const course = student.program || student.course || rec.subject?.program || rec.subject?.course || 'N/A';
                    const yearLevel = student.year_level || student.yearLevel || 'N/A';
                    const section = student.section || rec.section || 'N/A';
                    const courseYearLevel = course !== 'N/A' && yearLevel !== 'N/A' && section !== 'N/A'
                      ? `${course} ${yearLevel}${section}`
                      : 'N/A';
                    return (
                      <tr key={idx}>
                        <td>{rec.studentId?.email || rec.studentEmail || 'N/A'}</td>
                        <td>{rec.studentId?.name || rec.studentName || 'N/A'}</td>
                        <td>
                          {rec.schedule
                            ? `${rec.schedule.day || 'N/A'} ${rec.schedule.startTime || ''}${rec.schedule.endTime ? ' - ' + rec.schedule.endTime : ''}`
                            : <span className="text-danger">[No Schedule]</span>
                          }
                        </td>
                        <td>
                          {rec.purpose ? (
                            <span className="text-success fw-bold" title={rec.purpose}>
                              {rec.purpose.length > 50 ? `${rec.purpose.substring(0, 50)}...` : rec.purpose}
                            </span>
                          ) : (
                            <span className="text-muted">No purpose recorded</span>
                          )}
                        </td>
                        <td>{courseYearLevel}</td>
                        <td>
                          <span className={`badge ${getBadgeClass(rec.status)}`}>
                            {rec.status && rec.status.toLowerCase() === 'completed' && 'Marked as Done'}
                            {rec.status && rec.status.toLowerCase() === 'rejected' && 'Marked as Done'}
                            {rec.status && !['completed', 'rejected'].includes(rec.status.toLowerCase()) && rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                            {!rec.status && 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}