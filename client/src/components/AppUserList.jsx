import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faChevronUp, faChevronDown, faIdBadge, faUser, faBook, faCalendarAlt, faBuilding, faCogs } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import './sortingcolumn.css';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'boxicons/css/boxicons.min.css';
import ReCAPTCHA from 'react-google-recaptcha';


// Import FontAwesomeIcon component

// Import the specific icons you are using
import { faCheckCircle, faTrash, faExclamationTriangle, faInfoCircle, faCog } from '@fortawesome/free-solid-svg-icons';

const AppUserList = () => {
  // State hooks to manage different parts of the component's state
  const [loading, setLoading] = useState(true); // Loading state
  const [students, setStudents] = useState([]); // List of students
  const [limit, setLimit] = useState(5); // Number of students per page
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering students
  const [newStudent, setNewStudent] = useState({
    school_id: '',
    name: '',
    email: '',
    password: '',
    contact_number: '',
    program: '',
    year_level: '',
    section: '',
    topics_or_subjects: '',
    academic_year: '',
  });
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(5); // Number of items per page for pagination
  const [errorMessage, setErrorMessage] = useState(''); // Error message for failed API calls
  const [sortConfig, setSortConfig] = useState({ key: 'school_id', direction: 'asc' }); // Sorting configuration
  const [sortedStudents, setSortedStudents] = useState([]); // Sorted list of students
  const [isHovered, setIsHovered] = useState(false); // Hover state for UI interactions
  const [showViewModal, setShowViewModal] = useState(false); // Modal visibility for viewing student
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for view/update actions
  
  const [formData, setFormData] = useState({
    school_id: '',
    name: '',
    email: '',
    contact_number: '',
    program: '',
    year_level: '',
    section: '',
    topics_or_subjects: '',
    academic_year: '',
  });

  // Add reCAPTCHA state
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        schoolId: selectedStudent.school_id || '',
        name: selectedStudent.name || '',
        email: selectedStudent.email || '',
        contactNumber: selectedStudent.contact_number || '',
        program: selectedStudent.program || '',
        yearLevel: selectedStudent.year_level || '',
        section: selectedStudent.section || '',
        topicsOrSubjects: selectedStudent.topics_or_subjects.join(', ') || '', // Assuming it's an array
        academicYear: selectedStudent.academic_year || '',
      });
    }
  }, [selectedStudent]); // Run when selectedStudent changes //UPDATE NI SIYA
  
  // Effect to fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []); //UPDATE SAD NI SYA
  // Effect to sort the students whenever the list or sorting configuration changes
  useEffect(() => {
    const sortedData = [...students].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedStudents(sortedData);
  }, [students, sortConfig]);
  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      // Filter students who are 'student' role and have a name
      const filteredStudents = data.filter(student => student.role === 'student' && student.name);
      setStudents(filteredStudents);
    } catch (error) {
      setErrorMessage('Error fetching students. Please try again later.');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };
  // Export student data to a PDF file
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Bukidnon State University", 14, 10);
    doc.setFontSize(12);
    doc.text("College of Technology", 14, 15);
    doc.line(14, 28, 195, 28);

    const columns = ["ID", "Name", "Program", "Year", "Section"];
    const data = students.map(student => [student.school_id, student.name, student.program, student.year_level, student.section]);

    doc.autoTable({ head: [columns], body: data, startY: 20, theme: "grid", margin: { top: 10, left: 10, right: 10, bottom: 10 } });
    doc.save("student-list.pdf");
  };
  // Export student data to an Excel file
  const exportToExcel = () => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  // Clean up the students data to ensure arrays are joined into strings
  const cleanedStudents = students.map(student => {
    if (Array.isArray(student.topics_or_subjects)) {
      // Join array into a string (you can use other delimiters like commas or semicolons)
      student.topics_or_subjects = student.topics_or_subjects.join(', ');
    }
    return student;
  });
  // Convert cleaned data to a worksheet
  const ws = XLSX.utils.json_to_sheet(cleanedStudents);
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Students');
  // Write the file
  XLSX.writeFile(wb, 'Students.xlsx');
};
  // Handle the change in number of students per page
  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      setCurrentPage(1); // Reset to first page
    }
  };
  // Filter students based on the search query
  const filteredStudents = students.filter(student => 
    student && student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Limit the number of students per page
  const limitedStudents = filteredStudents.slice(0, limit);

  // Handle sorting of student data
  const handleSort = (column) => {
    const direction = sortConfig.key === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: column, direction });
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * limit;
  const indexOfFirstStudent = indexOfLastStudent - limit;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / limit);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Handle the view action for a student
  const handleView = (schoolId) => {
    const student = currentStudents.find(student => student.school_id === schoolId);
    setSelectedStudent(student);
    setShowViewModal(true); // Open the View Modal
  };

  // Close the View Modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedStudent(null);
  };

//ADD STUDENT FUNCTION
const [showAddModal, setShowAddModal] = useState(false);
// Handle modal open
const handleOpenAddModal = () => setShowAddModal(true);
// Handle modal close
const handleCloseAddModal = () => setShowAddModal(false);
// Handle form submission
const handleAddStudent = async (e) => {
  e.preventDefault();

  // Step 1: Close the modal immediately before showing SweetAlert
  handleCloseAddModal(); // Close modal on button click

  // Step 2: Show SweetAlert confirmation first
  const confirmAdd = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to add this student?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, add student!',
    cancelButtonText: 'Cancel',
  });

  // Step 3: If user clicks 'Yes, add student!', proceed with form submission
  if (confirmAdd.isConfirmed) {
    setLoading(true); // Show loading spinner or modal

    const { name, email, school_id } = newStudent;
    if (!name || !email || !school_id) {
      alert('Please fill in all required fields.');
      setLoading(false); // Hide loading if fields are missing
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) throw new Error('Failed to add student');
      const { newStudent: addedStudent } = await response.json();

      // Step 4: Add the new student to the list
      setStudents(prev => [addedStudent, ...prev]);

      // Reset the form fields
      setNewStudent({
        school_id: '', name: '', email: '', password: '', contact_number: '',
        program: '', year_level: '', section: '', topics_or_subjects: '', academic_year: '',
      });

      setLoading(false); // Hide the loading spinner after successful submission

      // Step 5: Show SweetAlert success after student is added
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Student added successfully!',
        confirmButtonText: 'OK',
      });

    } catch (error) {
      console.error('Error adding student:', error);
      setErrorMessage('An error occurred while adding the student.');
      setLoading(false); // Hide loading state even if an error occurs
    }
  }
};
const [showModal, setShowModal] = useState(false); // Matches modal state
const handleInputChange = (e, type) => {
  const { name, value } = e.target;

  // Update the state for 'add' or other types
  if (type === 'add') {
    setNewStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
};


const handleInputChangePut = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value, // Update the specific form field
  }));
 
};

const handleCloseUpdateModal = () => {
  setShowModal(false); // Close the modal
  setSelectedStudent(null); // Reset selected student when modal is closed
};

const handleUpdateSubmit = async (event) => {
  event.preventDefault();
  console.log('Form data before submission:', formData);

  // Validate that required fields are not empty
  if (
    !formData.name ||
    !formData.email ||
    !formData.contactNumber ||
    !formData.academicYear ||
    !formData.yearLevel ||
    !formData.program ||
    !formData.section ||
    !formData.topicsOrSubjects
  ) {
    alert('Please fill out all required fields.');
    return; // Exit early if validation fails
  }

  // Proceed with form submission if validation passes
  setError(''); // Clear any previous error

  // Step 1: Close the modal immediately before showing SweetAlert
  handleCloseUpdateModal(); // Close modal on button click

  // Step 2: Show SweetAlert confirmation before updating
  const confirmUpdate = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to update this student?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, update student!',
    cancelButtonText: 'Cancel',
  });

  // Step 3: If the user confirms, proceed with the update
  if (confirmUpdate.isConfirmed) {
    const updatedData = {
      school_id: formData.schoolId,
      name: formData.name,
      email: formData.email,
      contact_number: formData.contactNumber,
      academic_year: formData.academicYear,
      year_level: formData.yearLevel,
      program: formData.program,
      section: formData.section,
      topics_or_subjects: formData.topicsOrSubjects
        .split(',')
        .map((subject) => subject.trim()), // Ensure it's an array for backend compatibility
    };

    console.log('Updating student with data:', updatedData);

    try {
      const studentId = selectedStudent?.school_id;
      if (!studentId) {
        alert('Student ID is missing');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/users/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to update student');
      }

      const updatedStudent = await response.json();
      console.log('Student updated:', updatedStudent);

      // Step 4: Show SweetAlert success after update
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Student updated successfully!',
        confirmButtonText: 'OK',
      });

    } catch (error) {
      console.error('Error updating student:', error.message);

      // Step 5: Show SweetAlert error message if the update failed
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while updating the student. Please try again later.',
        confirmButtonText: 'OK',
        position: 'top-end', // Position the alert at the top-right
        toast: true, // Make it a toast
        timer: 3000, // Set a timer to automatically close the toast after 3 seconds
        timerProgressBar: true, // Optionally show a progress bar while waiting
      });
    }
  }
};

const handleDelete = async (schoolId) => {
  // Show confirmation dialog
  const confirmDelete = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone. Do you want to delete this student?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  // If the user confirms, proceed with deletion
  if (confirmDelete.isConfirmed) {
    try {
      // Send DELETE request to the backend API
      const response = await fetch(`http://localhost:5000/api/users/${schoolId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Remove the student from the state
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.school_id !== schoolId)
      );

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The student has been deleted.',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error deleting student:', error.message);

      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while deleting the student. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  }
};


//CARDS DASHBOARD
useEffect(() => {
  fetchTotalYearStudents('first-year');
  fetchTotalYearStudents('second-year');
  fetchTotalYearStudents('third-year');
  fetchTotalYearStudents('fourth-year');
}, []);

const fetchTotalYearStudents = async (year) => {
  setLoading(true);
  try {
    const response = await fetch(`http://localhost:5000/api/students/total/${year}`);
    if (!response.ok) throw new Error(`Failed to fetch ${year} students`);
    const data = await response.json();
    switch (year) {
      case 'first-year':
        setTotalFirstYearStudents(data.totalFirstYearStudents);
        break;
      case 'second-year':
        setTotalSecondYearStudents(data.totalSecondYearStudents);
        break;
      case 'third-year':
        setTotalThirdYearStudents(data.totalThirdYearStudents);
        break;
      case 'fourth-year':
        setTotalFourthYearStudents(data.totalFourthYearStudents);
        break;
      default:
        break;
    }
  } catch (error) {
    setErrorMessage(`Error fetching ${year} students. Please try again later.`);
    console.error(`Error fetching ${year} students:`, error);
  } finally {
    setLoading(false);
  }
};
const [totalFirstYearStudents, setTotalFirstYearStudents] = useState(null); // null for loading state
const [totalSecondYearStudents, setTotalSecondYearStudents] = useState(null); // null for loading state
const [totalThirdYearStudents, setTotalThirdYearStudents] = useState(null); // null for loading state
const [totalFourthYearStudents, setTotalFourthYearStudents] = useState(null); // null for loading state
//CARDS DASHBOARD


//Dark Mode & Light Mode
const [isDarkMode, setIsDarkMode] = useState(false);

// Define styles for both dark and light themes
const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#fff',
};

const lightModeStyles = {
  backgroundColor: '#ffffff',
  color: '#000',
};

const menuItemStyles = {
  color: isDarkMode ? '#fff' : '#000',
  backgroundColor: isDarkMode ? '#343a40' : '#f1f1f1',
  padding: '10px',
  borderRadius: '5px',
};

// Effect to apply the dark or light theme when state changes
useEffect(() => {
  const body = document.body;
  if (isDarkMode) {
    body.style.backgroundColor = darkModeStyles.backgroundColor;
    body.style.color = darkModeStyles.color;
  } else {
    body.style.backgroundColor = lightModeStyles.backgroundColor;
    body.style.color = lightModeStyles.color;
  }
}, [isDarkMode]);


return (
<div>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin ="true"/>
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/vendor/fonts/boxicons.css" /> 
  <link rel="stylesheet" href="assets/vendor/fonts/boxicons.woff2" /> 
  <link rel="stylesheet" href="assets/vendor/css/rtl/core.css" className="template-customizer-core-css" />
  <link rel="stylesheet" href="assets/vendor/css/rtl/theme-default.css" className="template-customizer-theme-css" />
  <link rel="stylesheet" href="assets/css/demo.css" />
  <link rel="stylesheet" href="assets/vendor/fonts/fontawesome.css" />
  <link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css" rel="stylesheet"/>



  {/* Layout wrapper */}
  <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      {/* Menu */}
  <aside id="layout-menu" 
  className="layout-menu menu-vertical menu" 
  style={{
    backgroundColor: '#343a40', // Dark background color
    color: '#fff', // White text color
  }}
>
  <style>
    {`
      .menu-item:hover {
        background-color: #495057; /* Slightly lighter shade on hover */
        cursor: pointer; /* Change cursor on hover */
      }
      .menu-item:hover .menu-link {
        color: #f8f9fa; /* Lighter text color on hover */
      }
      .menu-item:hover .menu-icon {
        color: #f8f9fa; /* Lighter icon color on hover */
      }
    `}
  </style>

  <div className="menu-inner-shadow" />
  <ul className="menu-inner py-1" style={{ color: '#fff' }}>
    {/* Layouts */}
    <li className="menu-header text-uppercase" style={{ backgroundColor: '#343a40' }}>
      <span className="menu-header-text" style={{ color: '#fff', fontSize: '1.45rem', fontWeight: 'bold' }}>
        ConsultEase
      </span>
    </li>

    <li className="menu-header text-uppercase">
      <span className="menu-header-text" style={{ color: '#fff' }}>Admin Dashboard</span>
    </li>

    {/* Removing these menu items:
    <li className="menu-item">
      <a href="/studentadmindashboard" className="menu-link" style={{ color: '#fff' }}>
        <i className="menu-icon tf-icons bx bx-user-circle"></i>
        <div data-i18n="Tables" style={{ color: '#fff' }}>Student</div>
      </a>
    </li>

    <li className="menu-item">
      <a href="/facultyadmindashboard" className="menu-link" style={{ color: '#fff' }}>
        <i className="menu-icon tf-icons bx bx-chalkboard"></i>
        <div data-i18n="Tables" style={{ color: '#fff' }}>Faculty</div>
      </a>
    </li>
    */}
  </ul>
</aside>

   
{/* / Menu */}
{/* Layout container */}
<div className="layout-page">
  {/* Navbar */}
        {/* Content wrapper */}
        <div className="content-wrapper">
          {/* Content */}
          <div className="container-xxl flex-grow-1 container-p-y">
          <nav aria-label="breadcrumb">
  <ol className="breadcrumb">
    {/* <li className="breadcrumb-item"><a href="/studentadmindashboard">Admin</a></li>
    <li className="breadcrumb-item"><a href="/studentadmindashboard">Manage Student</a></li> */}
    {/* <li className="breadcrumb-item active" aria-current="page">Add Student</li> */}
  </ol>
</nav>

            {/* {Cards} */}
            <div className="row g-4 mb-4">
                <div className="col-sm-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between">

                       <div className="content-left">
                          <span style={{ fontWeight: 'bold' }}>1st Year</span>
                          <div className="d-flex align-items-end mt-2">
                          <h4 className="mb-0 me-2">{totalFirstYearStudents ? totalFirstYearStudents.toLocaleString() : 'Loading...'}</h4>
                            {/* <small class="text-success">(+29%)</small> */}
                          </div>
                          <small>Total Students </small>
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
                        <h4 className="mb-0 me-2">{totalSecondYearStudents ? totalSecondYearStudents.toLocaleString() : 'Loading...'}</h4>
                          {/* <small className="text-success">(+18%)</small> */}
                        </div>
                        <small>Total Students </small>
                      

                      </div>
                      <span className="badge bg-label-danger rounded p-2">
                        <i className="bx bx-user bx-sm" />
                        {/* <span class="year-badge">2nd Year</span> */}
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
                        <h4 className="mb-0 me-2">{totalThirdYearStudents ? totalThirdYearStudents.toLocaleString() : 'Loading...'}</h4>
                          {/* <small className="text-danger">(-14%)</small> */}
                        </div>
                        <small>Total Students </small>
                      </div>
                      <span className="badge bg-label-success rounded p-2">
                      <i className="bx bx-user bx-sm" />
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
                        <h4 className="mb-0 me-2">{totalFourthYearStudents ? totalFourthYearStudents.toLocaleString() : 'Loading...'}</h4>
                          {/* <small className="text-success">(+42%)</small> */}
                        </div>
                        <small>Total Students </small>
                      </div>
                      <span className="badge bg-label-warning rounded p-2">
                      <i className="bx bx-user bx-sm" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

{/* USERS LIST TABLE */}
<div className="container mt-1"> 
{/* <h1 className="text-center mb-5">Student Management</h1> */}
<h4>Student Table</h4> 
{/* Row for Search and Limit Dropdown */}
<div className="d-flex mb-3 align-items-center justify-content-between">

{/* Dropdown Section (5, 10, 15, 20) */}
<div>
    <label htmlFor="limitSelect">Show: </label>
    <span style={{ marginLeft: '5px' }}></span>
    <select  id="limitSelect"  value={limit}  onChange={handleLimitChange}  style={{    width: '80px',    padding: '0.48rem 0.75rem',    fontSize: '1rem',    border: '1px solid #ccc',    borderRadius: '0.25rem',    marginLeft: '1px', marginRight: '10px', marginBottom: '10px'  }}>
  <option value={5}>5</option>
  <option value={10}>10</option>
  <option value={20}>20</option>
  <option value={50}>50</option>
  <option value={100}>100</option>
    </select>
    <label htmlFor="limitSelect"> entries </label>
</div>
{/* EXCEL & PDF */}
<div className="d-flex align-items-center">
<div style={{ display: 'flex', gap: '10px' }}>

{/* Export to Excel */}
<button   onClick={exportToExcel}   className="btn btn-success">  <i className="bi bi-file-earmark-excel ms-2" style={{ marginRight: '5px' }}></i> {/* Adds Excel icon */}  Excel</button>
{/* Export to PDF Button */}
<button   onClick={exportToPDF}   className="btn btn-danger">  <i className="bi bi-file-earmark-pdf ms-2" style={{ marginRight: '5px' }}></i> {/* Adds PDF icon */}  PDF</button>

</div>
  {/* Search Icon */}
  <i className="bi bi-search" style={{ marginLeft: '20px' , marginRight: '10px' }}></i>
  {/* Search Input */}
  <input    type="text"    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name" style={{padding: '0.375rem 0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem', width: '500px', }}  />
</div>
</div>




{/* Add Student Button */}
<button 
type="submit" className="btn btn-primary mb-3" onClick={handleOpenAddModal} >   Manage Student <i className="bi bi-plus-circle ms-2"></i>
</button>
{showAddModal && (
  <div className="modal show" style={{ display: "block" }}>
    <div
      className="modal-dialog modal-lg"
      onClick={(e) => e.stopPropagation()} // Ensures inner clicks don't close modal
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Manage Student</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseAddModal}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          {/* Error Alert */}
          {error && <div className="alert alert-danger">{error}</div>}
          {/* Add Student Form */}

          {/* Show loading spinner if loading is true */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
          <form onSubmit={handleAddStudent}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="school_id" className="form-label">School ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="school_id"
                  name="school_id"
                  value={newStudent.school_id}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={newStudent.name}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                />
              </div>
            </div>


 

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={newStudent.email}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={newStudent.password}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="contact_number" className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="contact_number"
                  name="contact_number"
                  value={newStudent.contact_number}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="program" className="form-label">Program</label>
                <select
                  className="form-select"
                  id="program"
                  name="program"
                  value={newStudent.program}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                >
                  <option value="">Select Program</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BSCS">BSCS</option>
                  {/* Add other programs here */}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="year_level" className="form-label">Year Level</label>
                <select
                  className="form-select"
                  id="year_level"
                  name="year_level"
                  value={newStudent.year_level}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                >
                  <option value="">Select Year Level</option>
                  <option value="1st year">1st year</option>
                  <option value="2nd year">2nd year</option>
                  <option value="3rd year">3rd year</option>
                  <option value="4th year">4th year</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
              <label htmlFor="section" className="form-label">Section</label>
              <input
                type="text"
                className="form-control"
                id="section"
                name="section"
                value={newStudent.section}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().slice(0, 1); // Format the value
                  setNewStudent(prevState => ({
                    ...prevState,
                    section: value, // Update state with the formatted value
                  }));
                }}
                maxLength={1}
                required
              />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="topics_or_subjects" className="form-label">Subjects</label>
                <select
                  className="form-select"
                  id="topics_or_subjects"
                  name="topics_or_subjects"
                  value={newStudent.topics_or_subjects}
                  onChange={(e) => handleInputChange(e, 'add')}
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Integrative Programming">Integrative Programming</option>
                  <option value="Technopreneurship">Technopreneurship</option>
                  <option value="Advanced Database and Systems">Advanced Database and Systems</option>
                  <option value="Capstone 1">Capstone 1</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="academic_year" className="form-label">Academic Year</label>
                <small> "2014-2015"</small>
                <input
                  type="text"
                  className="form-control"
                  id="academic_year"
                  name="academic_year"
                  value={newStudent.academic_year}
                  onChange={(e) => handleInputChange(e, 'add')}
                  pattern="\d{4}-\d{4}"
                  title="Enter the academic year in YYYY-YYYY format"
                  required
                />
              </div>
            </div>
            <ReCAPTCHA
              sitekey="6Lc8M1crAAAAAEmcoJJmlWSo5dR1ndpF1WINoYIS"
              onChange={token => {
                setRecaptchaToken(token);
                console.log('reCAPTCHA token:', token);
              }}
            />
            <button type="submit" className="btn btn-primary">Manage Student</button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}



{/* Table with Sorting */}
<table className="table table-bordered mb-5">
<thead>
  <tr>
    <th className="bg-light" onClick={() => handleSort('school_id')}>
      <div className="sort-label d-flex align-items-center justify-content-start">
        <FontAwesomeIcon icon={faIdBadge} className="me-2" />
        ID

      </div>
    </th>
    <th className="bg-light" onClick={() => handleSort('name')}>
      <div className="sort-label d-flex align-items-center justify-content-start">
        <FontAwesomeIcon icon={faUser} className="me-2" />
        Name

      </div>
    </th>
    <th className="bg-light" onClick={() => handleSort('program')}>
      <div className="sort-label d-flex align-items-center justify-content-start">
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Program

      </div>
    </th>
    <th className="bg-light" onClick={() => handleSort('year_level')}>
      <div className="sort-label d-flex align-items-center justify-content-start">
        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
        Year

      </div>
    </th>
    <th className="bg-light" style={{ width: '130px' }} onClick={() => handleSort('section')}>
      <div className="sort-label d-flex align-items-center justify-content-start">
        <FontAwesomeIcon icon={faBuilding} className="me-2" />
        Section

      </div>
    </th>
    <th className="bg-light">
      <div className="sort-label d-flex align-items-center justify-content-start">
        <FontAwesomeIcon icon={faCogs} className="me-2" />
        Actions
      </div>
    </th>
  </tr>
</thead>


  <tbody>
    {currentStudents.length > 0 ? (
      currentStudents.map(student => (
        <tr key={student.school_id}>
          <td>{student.school_id}</td>
          <td>{student.name}</td>
          <td>{student.program}</td>
          <td>{student.year_level}</td>
          <td>{student.section}</td>
          <td>


{/* View Button */}
<button 
  className="btn btn-success btn-sm me-2" 
  onClick={() => handleView(student.school_id)} 
  title="View Student">
  <FontAwesomeIcon icon={faEye} />
</button>
 {/* View Modal */}
 {showViewModal && selectedStudent && (
        <div className="modal show" style={{ display: "block" }} onClick={handleCloseViewModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
              <h4 className="modal-title" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: 'black', textTransform: 'uppercase' }}><p>{selectedStudent.name}</p></h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseViewModal}
                />
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {selectedStudent.school_id}</p>
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>Program:</strong> {selectedStudent.program}</p>
                <p><strong>Year Level:</strong> {selectedStudent.year_level}</p>
                <p><strong>Section:</strong> {selectedStudent.section}</p>     
                <p><strong>Academic Year:</strong> {selectedStudent.academic_year}</p>
                <p><strong>Contact Number:</strong> {selectedStudent.contact_number}</p>
                <p><strong>Subjects:</strong> {selectedStudent.topics_or_subjects.join(', ')}</p>

              </div>
            </div>
          </div>
        </div>
)}

{/* Update Button */}
<button
  className="btn btn-warning btn-sm me-2"
  onClick={() => {
    console.log('Student before setting:', student); // Log student data before setting
    setSelectedStudent(student); // Ensure student data is passed correctly
    setShowModal(true);
   
  }}
>
  <FontAwesomeIcon icon={faEdit} />
</button>
{/* Update Modal */}
{showModal && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header" >
          
          <h5 className="modal-title">Edit Student</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowModal(false);
              setSelectedStudent(null); // Reset selected student on modal close
            }}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleUpdateSubmit}>
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="updateSchoolId" className="form-label">
                    School ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateSchoolId"
                    name="schoolId"
                    value={formData.schoolId || ''}
                    onChange={handleInputChangePut}
                    required
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="updateName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateName"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChangePut}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="updateEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="updateEmail"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChangePut}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="updateContactNumber" className="form-label">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateContactNumber"
                    name="contactNumber"
                    value={formData.contactNumber || ''}
                    onChange={handleInputChangePut}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="updateProgram" className="form-label">
                    Program
                  </label>
                  <select
                    className="form-select"
                    id="updateProgram"
                    name="program"
                    value={formData.program || ''}
                    onChange={handleInputChangePut}
                    required
                  >
                    <option value="">Select Program</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                  </select>
                </div>

                <div className="mb-3">
                <label htmlFor="updateYearLevel" className="form-label">
                  Year Level
                </label>
                <select
                  className="form-select"
                  id="updateYearLevel"
                  name="yearLevel"
                  value={formData.yearLevel || ''}
                  onChange={handleInputChangePut}
                  required
                >
                  <option value="">Select Year Level</option>
                  <option value="1st year">1st year</option>
                  <option value="2nd year">2nd year</option>
                  <option value="3rd year">3rd year</option>
                  <option value="4th year">4th year</option>
                </select>
              </div>

                <div className="mb-3">
                  <label htmlFor="updateSection" className="form-label">
                    Section
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateSection"
                    name="section"
                    value={formData.section || ''}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().slice(0, 1);
                      setFormData((prevState) => ({
                        ...prevState,
                        section: value,
                      }));
                    }}
                    maxLength={1}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="updateSubjects" className="form-label">
                    Subjects
                  </label>
                  <select
                    className="form-select"
                    id="updateSubjects"
                    name="topicsOrSubjects"
                    value={Array.isArray(formData.topicsOrSubjects)
                      ? formData.topicsOrSubjects[0] // Get the first element if it's an array
                      : formData.topicsOrSubjects || ''} // Use the value directly if it's not an array
                    onChange={handleInputChangePut}
                    required
                  >
                    <option value="Integrative Programming">Integrative Programming</option>
                    <option value="Technopreneurship">Technopreneurship</option>
                    <option value="Advanced Database and Systems">Advanced Database and Systems</option>
                    <option value="Capstone 1">Capstone 1</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="updateAcademicYear" className="form-label">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateAcademicYear"
                    name="academicYear"
                    value={formData.academicYear || ''}
                    onChange={handleInputChangePut}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-warning">
              Update Student
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}


{/* Delete Button */}
<button 
  className="btn btn-danger btn-sm" 
  onClick={() => handleDelete(student.school_id)} 
  title="Delete Student"
>
  <FontAwesomeIcon icon={faTrash} />
</button>





          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" className="text-center">No students found</td>
      </tr>
    )}
  </tbody>


{/* Pagination Controls */}
<tfoot>
  <tr>
    <td colSpan="7" style={{ textAlign: 'right' }}>
      <div className="pagination" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <button 
          onClick={handlePrevPage} 
          className="btn btn-light me-2"
          disabled={currentPage === 1}
          style={{
            borderRadius: '0.25rem', 
            backgroundColor: currentPage === 1 ? '#e0e0e0' : 'transparent',
            borderColor: currentPage === 1 ? '#dcdcdc' : '#ced4da'
          }}
        >
          Previous
        </button>

        {/* Show first page */}
        {currentPage > 3 && (
          <button
            onClick={() => handlePageChange(1)}
            className="btn btn-light me-2"
            style={{
              borderRadius: '0.25rem',
              backgroundColor: currentPage === 1 ? '#007bff' : 'transparent',
              color: currentPage === 1 ? '#fff' : '#000',
              borderColor: currentPage === 1 ? '#007bff' : '#ced4da'
            }}
          >
            1
          </button>
        )}

        {/* Show ellipsis if there are pages before the current range */}
        {currentPage > 4 && (
          <span className="btn btn-light me-2" style={{ borderRadius: '0.25rem' }}>...</span>
        )}

        {/* Display a range of pages around the current page */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          const rangeStart = Math.max(1, currentPage - 1);
          const rangeEnd = Math.min(totalPages, currentPage + 1);

          if (pageNumber >= rangeStart && pageNumber <= rangeEnd) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className="btn btn-light me-2"
                style={{
                  borderRadius: '0.25rem',
                  backgroundColor: currentPage === pageNumber ? '#007bff' : 'transparent',
                  color: currentPage === pageNumber ? '#fff' : '#000',
                  borderColor: currentPage === pageNumber ? '#007bff' : '#ced4da'
                }}
              >
                {pageNumber}
              </button>
            );
          }

          return null;
        })}

        {/* Show ellipsis if there are pages after the current range */}
        {currentPage < totalPages - 3 && (
          <span className="btn btn-light me-2" style={{ borderRadius: '0.25rem' }}>...</span>
        )}

        {/* Show last page */}
        {currentPage < totalPages - 2 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className="btn btn-light me-2"
            style={{
              borderRadius: '0.25rem',
              backgroundColor: currentPage === totalPages ? '#007bff' : 'transparent',
              color: currentPage === totalPages ? '#fff' : '#000',
              borderColor: currentPage === totalPages ? '#007bff' : '#ced4da'
            }}
          >
            {totalPages}
          </button>
        )}

        <button 
          onClick={handleNextPage} 
          className="btn btn-light ms-2"
          disabled={currentPage === totalPages}
          style={{
            borderRadius: '0.25rem',
            backgroundColor: currentPage === totalPages ? '#e0e0e0' : 'transparent',
            borderColor: currentPage === totalPages ? '#dcdcdc' : '#ced4da'
          }}
        >
          Next
        </button>
      </div>
    </td>
  </tr>
</tfoot>



</table>
      {/* <hr className="my-4" />
      <div className="row">
      </div> */}
    </div>                  
          </div>
          <div className="content-backdrop fade" />
        </div>
      </div>
    </div>
    <div className="layout-overlay layout-menu-toggle" />
    <div className="drag-target" />
  </div>
</div>

  )
}

export default AppUserList