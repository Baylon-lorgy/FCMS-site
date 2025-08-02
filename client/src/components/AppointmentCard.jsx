import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import './sortingcolumn.css';
import Swal from 'sweetalert2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const headerStyles = `
  /* CSS Reset for better browser compatibility */
  * {
    box-sizing: border-box;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    overflow-x: hidden;
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
    padding: 1.5rem 0;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: visible;
    height: auto;
  }

  .animated-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(209, 59, 59, 0.1) 50%, rgba(240, 165, 0, 0.1) 100%);
    pointer-events: none;
    z-index: 0;
  }

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

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2.5rem;
    position: relative;
    z-index: 1;
    gap: 2rem;
    overflow: visible;
    height: auto;
  }

  .header-left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .header-logo {
    height: 65px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    transition: all 0.4s ease;
  }

  .header-logo:hover {
    transform: scale(1.08) rotate(2deg);
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
  }

  .header-logo-right {
    height: 60px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
    transition: all 0.4s ease;
    margin-left: 1.5rem;
  }

  .header-logo-right:hover {
    transform: scale(1.05) rotate(-2deg);
    filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.4));
  }

  .header-title-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    text-align: match-parent;
  }

  .header-title {
    font-size: 2rem;
    font-weight: 800;
    color: #FFD700;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
    margin: 0;
    line-height: 1.1;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-align: center;
    text-align: match-parent;
  }

  .header-title:hover {
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
    transform: scale(1.02);
    transition: all 0.3s ease;
  }

  .header-subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.4px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    text-align: center;
    text-align: match-parent;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .header-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 1.5rem;
  }

  .header-navigation {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.2rem;
    background: rgba(255, 255, 255, 0.98);
    border: none;
    border-radius: 10px;
    color: #2E1437;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .nav-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  .nav-button:hover::before {
    left: 100%;
  }

  .nav-button:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 1);
    color: #D13B3B;
    text-decoration: none;
    border-color: rgba(209, 59, 59, 0.3);
  }

  .nav-button:active {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .nav-button:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.4);
  }

  .nav-button svg {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .nav-button:hover svg {
    transform: scale(1.1) rotate(5deg);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-shrink: 0;
    position: relative;
    overflow: visible;
    max-width: 300px;
  }

  .profile-dropdown {
    position: relative;
    z-index: 9998;
    display: inline-block;
    height: auto;
    max-width: 200px;
    overflow: visible;
  }

  .profile-button {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.8rem;
    background: rgba(255, 255, 255, 0.98);
    border: none;
    border-radius: 8px;
    color: #2E1437;
    font-weight: 500;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: visible;
    min-width: fit-content;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    cursor: pointer;
    z-index: 9998;
    pointer-events: auto;
  }

  .profile-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  .profile-button:hover::before {
    left: 100%;
  }

  .profile-button:hover {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 1);
    color: #D13B3B;
    border-color: rgba(209, 59, 59, 0.3);
  }

  .profile-button:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.4);
  }

  .profile-button svg {
    font-size: 0.9rem;
    transition: transform 0.3s ease;
  }

  .profile-button:hover svg {
    transform: scale(1.05) rotate(2deg);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    min-width: 160px;
    max-width: 200px;
    z-index: 9999;
    animation: dropdownFadeIn 0.2s ease-out;
    transform-origin: top right;
    display: block !important;
    visibility: visible !important;
    overflow: visible;
    white-space: nowrap;
    pointer-events: auto;
    transform: translateX(0);
  }

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    color: #2E1437;
    text-decoration: none;
    transition: all 0.2s ease;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .dropdown-item:hover {
    background: rgba(209, 59, 59, 0.1);
    color: #D13B3B;
    transform: translateX(2px);
  }

  .dropdown-item:focus {
    outline: none;
    background: rgba(209, 59, 59, 0.1);
    color: #D13B3B;
  }

  .dropdown-item:first-child {
    border-radius: 8px 8px 0 0;
  }

  .dropdown-item:last-child {
    border-radius: 0 0 8px 8px;
  }

  @media (max-width: 768px) {
    .header-container {
      flex-direction: column;
      gap: 1.5rem;
      padding: 0 1rem;
      overflow: hidden;
    }

    .header-left {
      justify-content: center;
    }

    .header-center {
      gap: 1rem;
    }

    .header-navigation {
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .header-right {
      justify-content: center;
      gap: 1rem;
      max-width: 100%;
    }

    .header-title {
      font-size: 1.5rem;
    }

    .header-subtitle {
      font-size: 0.9rem;
    }

    .nav-button {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
    }

    .nav-button svg {
      font-size: 0.9rem;
    }

    .header-logo-right {
      height: 45px;
    }

    .profile-button {
      padding: 0.4rem 0.7rem;
      font-size: 0.75rem;
    }

    .profile-button svg {
      font-size: 0.8rem;
    }

    .dropdown-menu {
      right: 0;
      max-width: 150px;
    }
  }
`;

const AppointmentCards = () => {
  // State hooks to manage different parts of the component's state
  const [userData, setUserData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const profileDropdownRef = useRef(null);
  const [purposeTexts, setPurposeTexts] = useState({});

  // Consultation status badge component
  const ConsultationStatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'warning';
        case 'approved':
          return 'success';
        case 'rejected':
          return 'danger';
        case 'completed':
          return 'info';
        default:
          return 'secondary';
      }
    };

    return (
      <span className={`badge bg-${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Function to fetch consultations with pagination
  const fetchConsultations = async (userId, page = 1, signal) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Fetching consultations for faculty:', {
        userId,
        page,
        itemsPerPage,
        token: token ? 'present' : 'missing'
      });

      // Fetch all consultations first
      const response = await axios.get(
        `http://localhost:5000/api/consultations/faculty/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
          params: {
            populate: 'studentId subjectId scheduleId' // Add this to ensure we get populated data
          }
        }
      );

      console.log('Raw server response:', response.data);

      // Handle both array and paginated response formats
      let consultationsData = response.data;
      if (response.data && response.data.consultations) {
        consultationsData = response.data.consultations;
      }
      
      if (!Array.isArray(consultationsData)) {
        console.error('Invalid consultations data format:', consultationsData);
        setConsultations([]);
        setTotalPages(1);
        setCurrentPage(1);
        return;
      }

      // Get saved statuses from localStorage
      let savedStatuses = {};
      try {
        savedStatuses = JSON.parse(localStorage.getItem('savedConsultationStatuses') || '{}');
        console.log('Retrieved saved statuses from localStorage:', savedStatuses);
      } catch (storageError) {
        console.error('Error reading from localStorage:', storageError);
      }

      // Process the consultations data
      const processedConsultations = consultationsData.map(consultation => {
        console.log('Processing single consultation:', consultation);

        // Apply saved status if available
        const savedStatus = savedStatuses[consultation._id];
        if (savedStatus) {
          consultation.status = savedStatus;
          console.log(`Applied saved status ${savedStatus} to consultation ${consultation._id}`);
        }
        
        return {
          ...consultation,
          studentName: consultation.studentId ? consultation.studentId.name : 'Unknown Student',
          studentEmail: consultation.studentId ? consultation.studentId.email : 'No email provided',
          subjectName: consultation.subjectId ? consultation.subjectId.subjectName : 'Unknown Subject',
          subjectCode: consultation.subjectId ? consultation.subjectId.subjectCode : 'No code',
          schedule: consultation.scheduleId ? {
            day: consultation.scheduleId.day,
            startTime: consultation.scheduleId.startTime,
            endTime: consultation.scheduleId.endTime,
            location: consultation.scheduleId.location || 'Not specified'
          } : null
        };
      });

      // Calculate pagination
      const totalCount = processedConsultations.length;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      
      // Get the slice for current page
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedConsultations = processedConsultations.slice(startIndex, endIndex);

      console.log('Processed consultations:', processedConsultations);

      setConsultations(paginatedConsultations);
      setTotalPages(totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled:', error.message);
        return;
      }
      
      console.error('Error fetching consultations:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      setError(error.message);
      setConsultations([]);
      setTotalPages(1);
      setCurrentPage(1);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    const token = localStorage.getItem('authToken');
    if (!userDataStr || !token) {
      navigate('/login');
      return;
    }
    try {
      const userData = JSON.parse(userDataStr);
      setUserData(userData);
      const userId = userData.id || userData._id;
      if (userId && token) {
        fetchConsultations(userId, 1);
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.removeItem('userData');
      navigate('/login');
    }

    // Load saved purposes from localStorage
    try {
      const savedPurposes = localStorage.getItem('consultationPurposes');
      if (savedPurposes) {
        setPurposeTexts(JSON.parse(savedPurposes));
      }
    } catch (err) {
      console.error('Error loading saved purposes:', err);
    }
  }, [navigate]);

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (userData?.id) {
      const controller = new AbortController();
      fetchConsultations(userData.id, page, controller.signal);
      return () => controller.abort();
    }
  };

  useEffect(() => {
    // Add the styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Function to handle cleanup of locally saved status changes
  const handleCleanup = async () => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Reset Status Changes?',
        text: 'This will reset all locally saved status changes. The consultation list will return to its original state.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reset all changes!'
      });

      if (result.isConfirmed) {
        setLoading(true);
        
        // Clear saved statuses
        localStorage.removeItem('savedConsultationStatuses');
        
        // Refresh the consultations list
        if (userData?.id) {
          await fetchConsultations(userData.id, currentPage);
        }
        
        setLoading(false);
        
        Swal.fire({
          title: 'Reset Complete',
          text: 'All locally saved status changes have been cleared.',
          icon: 'success'
        });
      }
    } catch (error) {
      console.error('Error during reset:', error);
      
      Swal.fire({
        title: 'Error',
        text: 'There was an error during the reset process.',
        icon: 'error'
      });
      
      setLoading(false);
    }
  };

  // Function to handle purpose text changes
  const handlePurposeChange = (consultationId, newPurpose) => {
    setPurposeTexts(prev => {
      const updated = {
        ...prev,
        [consultationId]: newPurpose
      };
      // Save to localStorage
      localStorage.setItem('consultationPurposes', JSON.stringify(updated));
      return updated;
    });
  };

  // Function to handle consultation purpose update with Enter key
  const handlePurposeUpdate = async (consultationId, purpose) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      Swal.fire({
        title: 'Updating...',
        text: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Call the backend API to update the purpose
      const response = await axios.put(
        `http://localhost:5000/api/consultations/${consultationId}/purpose`,
        { purpose },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear the local purpose text state after successful save
      setPurposeTexts(prev => {
        const newState = { ...prev };
        delete newState[consultationId];
        return newState;
      });

      // Immediately refresh the consultations list after purpose update
      if (userData?.id) {
        await fetchConsultations(userData.id, currentPage);
      }

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Purpose Updated',
        text: 'Consultation purpose has been updated successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });

    } catch (error) {
      Swal.close();
      console.error('Error updating consultation purpose:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the consultation purpose.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Function to handle Enter key press for purpose input
  const handlePurposeKeyPress = (e, consultationId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const purpose = e.target.value.trim();
      if (purpose) {
        handlePurposeUpdate(consultationId, purpose);
      }
    }
  };

  // Function to handle consultation status update - UI ONLY VERSION
  const handleStatusUpdate = async (consultationId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      Swal.fire({
        title: 'Updating...',
        text: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Call the backend API to update the status
      const response = await axios.put(
        `http://localhost:5000/api/consultations/${consultationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle purpose text based on status
      if (newStatus === 'rejected') {
        handlePurposeChange(consultationId, 'Purpose rejected');
      } else if (newStatus === 'approved') {
        // Keep existing purpose or set empty if none exists
        const currentPurpose = purposeTexts[consultationId] || '';
        handlePurposeChange(consultationId, currentPurpose);
      } else if (newStatus === 'completed') {
        // Keep the existing purpose text when marking as completed
        const currentPurpose = purposeTexts[consultationId] || '';
        if (currentPurpose && currentPurpose !== 'Purpose rejected') {
          handlePurposeChange(consultationId, currentPurpose);
        }
      }

      // Immediately refresh the consultations list after status update
      if (userData?.id) {
        await fetchConsultations(userData.id, currentPage);
      }

      Swal.close();

      const statusMessages = {
        approved: 'Consultation request has been approved',
        rejected: 'Consultation request has been rejected',
        completed: 'Consultation has been marked as completed',
        pending: 'Consultation status has been updated to pending'
      };

      Swal.fire({
        icon: newStatus === 'approved' ? 'success' : 
              newStatus === 'rejected' ? 'error' : 'info',
        title: 'Status Updated',
        text: statusMessages[newStatus] || `Status updated to ${newStatus}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });

    } catch (error) {
      Swal.close();
      console.error('Error updating consultation status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the consultation status.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const handleSubjectsClick = () => {
    navigate('/subjects');
  };

  const handleLogout = () => {
    setLoading(false); // Ensure loading spinner is not shown
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.replace('/login');
  };

  // Add exportToPDF function
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const now = new Date();
      const dateString = now.toLocaleString();
      const facultyName = userData?.name || 'Faculty';
      // Title
      doc.setFontSize(16);
      doc.text(`My Consultations`, 14, 15);
      doc.setFontSize(12);
      doc.text(`Faculty: ${facultyName}`, 14, 25);
      doc.text(`Date: ${dateString}`, 14, 32);
      // Table data
      const tableData = consultations.map(c => [
        c.studentName,
        c.subjectName,
        c.section || 'N/A',
        c.status,
      ]);
      doc.autoTable({
        head: [["Student", "Subject", "Section", "Status"]],
        body: tableData,
        startY: 38,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 }
        }
      });
      doc.save('my_consultations.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export consultations to PDF',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="animated-header">
        <div className="header-container">
          {/* Left Section - Official Logo */}
          <div className="header-left">
            <img 
              src="/assets/img/branding/brand-img-small.png" 
              alt="Official Logo" 
              className="header-logo"
            />
          </div>

          {/* Center Section - Title and Navigation */}
          <div className="header-center">
            <div className="header-title-section">
              <h1 className="header-title">
                Faculty Consultation Management System
              </h1>
              <p className="header-subtitle">
                Schedule and manage your faculty consultations efficiently
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div className="header-navigation">
              <Link 
                to="/appointmentcards"
                className="nav-button"
              >
                <AssignmentIcon />
                <span>ConsultEase</span>
              </Link>
              <button 
                className="nav-button"
                onClick={() => navigate('/subject-scheduling')}
              >
                <MenuBookIcon />
                <span>Subject Schedule</span>
              </button>
              <button 
                className="nav-button"
                onClick={() => navigate('/schedule')}
              >
                <EventNoteIcon />
                <span>Schedule Slot</span>
              </button>
            </div>
          </div>

          {/* Right Section - Profile and Secondary Logo */}
          <div className="header-right">
            <div className="profile-dropdown" ref={profileDropdownRef}>
              <button 
                className="profile-button"
                type="button"
                onClick={() => {
                  console.log('Profile button clicked');
                  setShowProfileDropdown(!showProfileDropdown);
                }}
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
              >
                <AccountCircleIcon />
                <span style={{ fontWeight: 500 }}>Carlo P Navarro</span>
                <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem', transition: 'transform 0.2s ease' }}>
                  {showProfileDropdown ? '▼' : '▶'}
                </span>
                <span style={{ fontSize: '0.6rem', marginLeft: '0.5rem', color: showProfileDropdown ? 'green' : 'red' }}>
                  {showProfileDropdown ? 'OPEN' : 'CLOSED'}
                </span>
              </button>
              {showProfileDropdown && (
                <div className="dropdown-menu" role="menu" style={{ display: 'block', visibility: 'visible' }}>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      console.log('Profile menu item clicked');
                      navigate('/faculty-profile');
                      setShowProfileDropdown(false);
                    }}
                    role="menuitem"
                  >
                    <AccountCircleIcon fontSize="small" />
                    <span>Profile</span>
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      console.log('Logout menu item clicked');
                      handleLogout();
                      setShowProfileDropdown(false);
                    }}
                    role="menuitem"
                  >
                    <LogoutIcon fontSize="small" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
            <img 
              src="/assets/img/branding/brand-img-right.png" 
              alt="Secondary Logo" 
              className="header-logo-right"
            />
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col d-flex justify-content-between align-items-center">
            <h2>My Consultations</h2>
            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={exportToPDF}
                disabled={loading}
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>
                Export to PDF
              </button>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Section</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && Array.isArray(consultations) && consultations.length > 0 ? (
                    consultations.map((consultation) => {
                      console.log('Rendering consultation:', consultation); // Debug log
                      return (
                        <tr key={consultation._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <div className="fw-bold">
                                  {consultation.studentName}
                                </div>
                                <div className="small text-muted">
                                  {consultation.studentEmail}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold">
                                {consultation.subjectName}
                              </div>
                              <small className="text-muted">
                                {consultation.subjectCode}
                              </small>
                            </div>
                          </td>
                          <td>{consultation.section || 'N/A'}</td>
                          <td>{consultation.approvedAt ? new Date(consultation.approvedAt).toLocaleString() : '-'}</td>
                          <td>{consultation.completedAt ? new Date(consultation.completedAt).toLocaleString() : '-'}</td>
                          <td>
                            {consultation.status === 'approved' ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ maxWidth: '150px', fontSize: '0.875rem' }}
                                value={purposeTexts[consultation._id] || consultation.purpose || ''}
                                onChange={(e) => handlePurposeChange(consultation._id, e.target.value)}
                                onKeyPress={(e) => handlePurposeKeyPress(e, consultation._id)}
                                placeholder="Enter purpose and press Enter..."
                              />
                            ) : consultation.status === 'rejected' ? (
                              <div className="text-danger small" style={{ maxWidth: '150px' }}>
                                Purpose rejected
                              </div>
                            ) : consultation.status === 'completed' ? (
                              <div className="text-success small" style={{ maxWidth: '150px' }}>
                                {consultation.purpose || purposeTexts[consultation._id] || 'No purpose specified'}
                              </div>
                            ) : (
                              <div className="text-muted small" style={{ maxWidth: '150px' }}>
                                {consultation.purpose || 'No purpose specified'}
                              </div>
                            )}
                          </td>
                          <td>
                            <ConsultationStatusBadge status={consultation.status} />
                          </td>

                          <td>
                            {consultation.status === 'pending' && (
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-success me-1"
                                  onClick={() => handleStatusUpdate(consultation._id, 'approved')}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleStatusUpdate(consultation._id, 'rejected')}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {(consultation.status === 'approved' || consultation.status === 'rejected') && (
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() => handleStatusUpdate(consultation._id, 'completed')}
                                >
                                  Mark as Completed
                                </button>
                              </div>
                            )}
                            {consultation.status === 'completed' && (
                              <span className="text-muted">No actions available</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          {loading ? 'Loading...' : 'No consultations found'}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Navigation */}
            {!loading && Array.isArray(consultations) && consultations.length > 0 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li 
                      key={page} 
                      className={`page-item ${currentPage === page ? 'active' : ''}`}
                    >
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Page {currentPage} of {totalPages}
                  </small>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCards;