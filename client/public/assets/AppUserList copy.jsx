import React, { useState, useEffect } from 'react'; // mag import React and hooks
import 'bootstrap/dist/css/bootstrap.min.css'; // mag import Bootstrap CSS for styling
import axios from 'axios';
import Select from 'react-select';

function AppUserList() {
    const [students, setStudents] = useState([]); // state para mag store sa list of students
    const [totalUsers, setTotalUsers] = useState(null); // state to store the total number of users
    const [percentageChange, setPercentageChange] = useState(0); // Percentage change (you can calculate this if needed)
    const [totalStudents, setTotalStudents] = useState(null); // State to store the total number of students
    const [totalFaculty, setTotalFaculty] = useState(null); // State to store the total number of faculty
    const [totalFirstYearStudents, setTotalFirstYearStudents] = useState(null); // null for loading state
    const [totalSecondYearStudents, setTotalSecondYearStudents] = useState(null); // null for loading state
    const [totalThirdYearStudents, setTotalThirdYearStudents] = useState(null); // null for loading state
    const [totalFourthYearStudents, setTotalFourthYearStudents] = useState(null); // null for loading state
    const [limit, setLimit] = useState(5); // Default to 5 students

    
    // Function to fetch students data
    const fetchStudents = async () => {
      try {
          const response = await fetch('http://localhost:5000/api/students'); // API call to fetch students
          if (!response.ok) {
              throw new Error('Failed to fetch students');
          }
          const data = await response.json();
          const filteredStudents = data.filter(student => student.role === 'student'); // Filter only students
          setStudents(filteredStudents); // Set filtered students data in state
      } catch (error) {
          console.error('Error fetching students:', error);
      }
  };

    const fetchTotalFirstYearStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students/total/first-year');
        if (!response.ok) {
          throw new Error('Failed to fetch first year students');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the data to check its structure
        setTotalFirstYearStudents(data.totalFirstYearStudents); // Assuming response contains totalSecondYearStudents
      } catch (error) {
        console.error('Error fetching first year students:', error);
      }
    };
    
    const fetchTotalSecondYearStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students/total/second-year');
        if (!response.ok) {
          throw new Error('Failed to fetch second year students');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the data to check its structure
        setTotalSecondYearStudents(data.totalSecondYearStudents); // Assuming response contains totalSecondYearStudents
      } catch (error) {
        console.error('Error fetching second year students:', error);
      }
    };

    const fetchTotalThirdYearStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students/total/third-year');
        if (!response.ok) {
          throw new Error('Failed to fetch third year students');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the data to check its structure
        setTotalThirdYearStudents(data.totalThirdYearStudents); // Assuming response contains totalSecondYearStudents
      } catch (error) {
        console.error('Error fetching third year students:', error);
      }
    };
    
    const fetchTotalFourthYearStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students/total/fourth-year');
        if (!response.ok) {
          throw new Error('Failed to fetch fourth year students');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the data to check its structure
        setTotalFourthYearStudents(data.totalFourthYearStudents); // Assuming response contains totalSecondYearStudents
      } catch (error) {
        console.error('Error fetching fourth year students:', error);
      }
    };

    const fetchTotalUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/total'); // API call to get total users
            if (!response.ok) {
                throw new Error('Failed to fetch total users');
            }
            const data = await response.json();
            setTotalUsers(data.totalUsers); // Set total users in state
        } catch (error) {
            console.error('Error fetching total users:', error);
        }
    };




    // useEffect to fetch data on component mount
    useEffect(() => {
      
        fetchStudents(); // call fetchStudents to get the student data
        fetchTotalUsers(); // Call function to get total users
        fetchTotalFirstYearStudents();
        fetchTotalSecondYearStudents();
        fetchTotalThirdYearStudents();
        fetchTotalFourthYearStudents();

    }, []);  // empty dependency array means this runs only once

    // Slice the students array based on the limit
    const limitedStudents = students.slice(0, limit);
    const handleLimitChange = (event) => {
      setLimit(parseInt(event.target.value)); // Update the limit based on dropdown selection
  };
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
  });
  
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear);
  const [endYear, setEndYear] = useState(currentYear);
  
  // Generate year options from 10 years ago to the current year
  const years = [];
  for (let year = currentYear - 10; year <= currentYear; year++) {
    years.push(year);
  }
  
  // Handle year start change
  const handleStartYearChange = (event) => {
    setStartYear(event.target.value);
  };
  
  // Handle year end change
  const handleEndYearChange = (event) => {
    setEndYear(event.target.value);
  };
  
  // Handle input changes for the new student form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
   // Handle form submission to add a new student
   const handleAddStudent = async (e) => {
    e.preventDefault();
  
    // Validate required fields before submitting
    if (!newStudent.name || !newStudent.email || !newStudent.school_id) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      // Send the request to the backend API
      const response = await fetch('http://localhost:5000/api/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
  
      // Parse the response if needed
      const result = await response.json();
  
      // Handle the response from the server
      console.log(result); // Optionally log the result to see the server's response
  
      // Optionally reset the form or show a success message
      alert('Student added successfully!');
      setNewStudent({
        name: '',
        email: '',
        school_id: '',
        program: '',
        year_level: '',
        section: '',
        topics_or_subjects: '',
        // Reset other fields if needed
      });
    } catch (error) {
      console.error('Error adding student:', error);
      alert('An error occurred while adding the student.');
    }
  };

//PUT ===============
const [newStudentPut, setNewStudentPut] = useState({
  id: '', 
  name: '',
  gender: '',
  section: '',
  hobby: ''
});
const handleInputChangePut = (e) => { //handle changes in the input fields
  const { name, value} = e.target;
  setNewStudentPut((prev) => ({
    ...prev, //Retain previous state values
    [name]: value //Update only the specific property
  }));
};

//Log the state whenever it updates
useEffect(() => {
  console.log('Update state:', newStudentPut);
}, [newStudentPut]);

const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:5000/api/users/${newStudentPut.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newStudentPut)
    });
    console.log(newStudentPut.gender)
    if (!response.ok){
      throw new Error ('Failed to update student');
    }
    await fetchStudents(); //refresh the list of students
  } catch (error) {
    console.error('Error updating student: ', error);
  }
};

//DELETE ========================================
const [deleteId, setDeleteId] = useState('');
const handleDeleteChange = (e) => {
  setDeleteId(e.target.value);
};
  const handleDeleteSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:5000/api/users/${deleteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
    await fetchStudents(); // Refresh the list of students
    setDeleteId('')
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};



  return (
<div>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
  <title>User List - Pages | Sneat - Bootstrap 5 HTML Admin Template - Pro</title>
  <meta name="description" content="true" />
  {/* Favicon */}
  <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />
  {/* Fonts */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin ="true"/>
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
  <link rel="stylesheet" href="assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
  <link rel="stylesheet" href="assets/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css" />
  <link rel="stylesheet" href="assets/vendor/libs/datatables-buttons-bs5/buttons.bootstrap5.css" />
  <link rel="stylesheet" href="assets/vendor/libs/select2/select2.css" />
  <link rel="stylesheet" href="assets/vendor/libs/formvalidation/dist/css/formValidation.min.css" />
  
  {/* Page CSS */}
  {/* Helpers */}
  {/*! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section */}
  {/*? Template customizer: To hide customizer set displayCustomizer value false in config.js.  */}
  {/*? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  */}
  {/* Layout wrapper */}
  <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      {/* Menu */}
      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="app-brand demo">
          <a href="index.html" className="app-brand-link">
            <span className="app-brand-logo demo">
              <svg width={25} viewBox="0 0 25 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <defs>
                  <path d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z" id="path-1" />
                  <path d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z" id="path-3" />
                  <path d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z" id="path-4" />
                  <path d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z" id="path-5" />
                </defs>
                <g id="g-app-brand" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                  <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                    <g id="Icon" transform="translate(27.000000, 15.000000)">
                      <g id="Mask" transform="translate(0.000000, 8.000000)">
                        <mask id="mask-2" fill="white">
                          <use xlinkHref="#path-1" />
                        </mask>
                        <use fill="#696cff" xlinkHref="#path-1" />
                        <g id="Path-3" mask="url(#mask-2)">
                          <use fill="#696cff" xlinkHref="#path-3" />
                          <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-3" />
                        </g>
                        <g id="Path-4" mask="url(#mask-2)">
                          <use fill="#696cff" xlinkHref="#path-4" />
                          <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-4" />
                        </g>
                      </g>
                      <g id="Triangle" transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) ">
                        <use fill="#696cff" xlinkHref="#path-5" />
                        <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-5" />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            <span className="app-brand-text demo menu-text fw-bolder ms-2">Sneat</span>
          </a>
          <a href="#" className="layout-menu-toggle menu-link text-large ms-auto">
            <i className="bx bx-chevron-left bx-sm align-middle" />
          </a>
        </div>
        <div className="menu-inner-shadow" />
        <ul className="menu-inner py-1">

          {/* Layouts */}


          {/* Apps & Pages */}
          <li className="menu-header small text-uppercase">
            <span className="menu-header-text">Apps &amp; Pages</span>
          </li>
     
          
          <li className="menu-item">
          <a href="/studentadmindashboard" className="menu-link">
            <i className="menu-icon tf-icons bx bx-user"></i>
              <div data-i18n="Tables">Student</div>
            </a>
          </li>

       
          {/* Tables */}
          <li className="menu-item">
            <a href="tables-basic.html" className="men`u-link">
              <i className="menu-icon tf-icons bx bx-table" />
              <div data-i18n="Tables">Tables</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link menu-toggle">
              <i className="menu-icon tf-icons bx bx-grid" />
              <div data-i18n="Datatables">Datatables</div>
            </a>
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="tables-datatables-basic.html" className="menu-link">
                  <div data-i18n="Basic">Basic</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="tables-datatables-advanced.html" className="menu-link">
                  <div data-i18n="Advanced">Advanced</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="tables-datatables-extensions.html" className="menu-link">
                  <div data-i18n="Extensions">Extensions</div>
                </a>
              </li>
            </ul>
          </li>

        </ul>
      </aside>
      
{/* / Menu */}
{/* Layout container */}
<div className="layout-page">
  {/* Navbar */}
  <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
    <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
      <a className="nav-item nav-link px-0 me-xl-4" href="#" onClick={(e) => e.preventDefault()}>
        <i className="bx bx-menu bx-sm" />
      </a>
    </div>
    <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">


            <ul className="navbar-nav flex-row align-items-center ms-auto">
       
              {/* Style Switcher */}
              <li className="nav-item me-2 me-xl-0">
                <a className="nav-link style-switcher-toggle hide-arrow" href="#">
                  <i className="bx bx-sm" />
                </a>
              </li>
              {/*/ Style Switcher */}
              
              
              
              {/* User */}
              <li className="nav-item navbar-dropdown dropdown-user dropdown">
                <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                  <div className="avatar avatar-online">
                    <img src="assets/img/avatars/1.png" alt="true" className="w-px-40 h-auto rounded-circle" />
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="pages-account-settings-account.html">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar avatar-online">
                            <img src="assets/img/avatars/1.png" alt="true" className="w-px-40 h-auto rounded-circle" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <span className="fw-semibold d-block">John Doe</span>
                          <small className="text-muted">Admin</small>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-profile-user.html">
                      <i className="bx bx-user me-2" />
                      <span className="align-middle">My Profile</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-account-settings-account.html">
                      <i className="bx bx-cog me-2" />
                      <span className="align-middle">Settings</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-account-settings-billing.html">
                      <span className="d-flex align-items-center align-middle">
                        <i className="flex-shrink-0 bx bx-credit-card me-2" />
                        <span className="flex-grow-1 align-middle">Billing</span>
                        <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-help-center-landing.html">
                      <i className="bx bx-support me-2" />
                      <span className="align-middle">Help</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-faq.html">
                      <i className="bx bx-help-circle me-2" />
                      <span className="align-middle">FAQ</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="pages-pricing.html">
                      <i className="bx bx-dollar me-2" />
                      <span className="align-middle">Pricing</span>
                    </a>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="auth-login-cover.html" target="_blank">
                      <i className="bx bx-power-off me-2" />
                      <span className="align-middle">Log Out</span>
                    </a>
                  </li>
                </ul>
              </li>
              {/*/ User */}
            </ul>
            
          </div>
          {/* Search Small Screens */}
        
        </nav>
        {/* / Navbar */}
        {/* Content wrapper */}
        <div className="content-wrapper">
          {/* Content */}
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* {Cards} */}
              <div className="row g-4 mb-4">
                <div className="col-sm-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between">
                        {/* <div class="content-left">
                          <span>1st </span>
                          <div class="d-flex align-items-end mt-2">
                          <h4 className="mb-0 me-2">{totalUsers ? totalUsers.toLocaleString() : 'Loading...'}</h4>
                            <small class="text-success">(+29%)</small>
                          </div>
                          <small>Total Users</small>
                        </div>
                        <span class="badge bg-label-primary rounded p-2">
                          <i class="bx bx-user bx-sm"></i>
                        </span>
                      </div> */}
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
            {/* Users List Table */}
            <div className="container mt-1"> 
      {/* <h1 className="text-center mb-5">Student Management</h1> */}
      <h4>Student    Table</h4> 
      {/* Dropdown to select the limit */}
            <div>
            <label htmlFor="limitSelect">Show: </label>
            <span style={{ marginLeft: '5px' }}></span>
                <select
  id="limitSelect"
  value={limit}
  onChange={handleLimitChange}
  style={{
    width: '120px',  // Set the width directly here
    padding: '0.375rem 0.75rem',  // Optional: Adjust padding to make it look better
    fontSize: '1rem',  // Optional: Adjust font size
    border: '1px solid #ccc',  // Optional: Border style
    borderRadius: '0.25rem',  // Optional: Rounded corners
    marginLeft: '1px', marginBottom: '10px' // Adding margin-top for spacing  
  }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

      <table className="table table-bordered mb-5">
        <thead>
          <tr >
            <th className='bg-light'>ID</th>
            <th className='bg-light'>Name</th>
            <th className='bg-light'>Email</th>
            <th className='bg-light'>Program</th>
            {/* <th className='bg-light'>Year</th>   */}
            <th className='bg-light'>Year</th>
            <th className='bg-light'>Section</th>
            <th className='bg-light'>Academic Year</th>

          </tr>
        </thead>
        
        <tbody>
        {students.length > 0 ? (
       limitedStudents
        .filter(student => student.role === 'student')  // Adjust this filter based on how role is defined
        .map(student => (
          <tr key={student.school_id}>
            <td>{student.school_id}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.program}</td>
            <td>{student.year_level}</td>
            <td>{student.section}</td>
            <td>{student.academic_year}</td>
          </tr>
          ))
          ):(
          <tr>
            <td colSpan="7" className="text-center">No students found</td>
          </tr>
            )}
        </tbody>

              {/* Button to adjust the limit */}

      </table>

      <hr className="my-4" />
      <div className="row">


      {/* Add Student Form */}
      <div className="col-md-4">
        <h4>Add User</h4>
        <form onSubmit={handleAddStudent}>
          <div className="mb-3">
            <label htmlFor="school_id" className="form-label">School ID</label>
            <input
              type="text"
              className="form-control"
              id="school_id"
              name="school_id"
              value={newStudent.school_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={newStudent.name} // Bind the value
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={newStudent.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={newStudent.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contact_number" className="form-label">Contact Number</label>
            <input
              type="text"
              className="form-control"
              id="contact_number"
              name="contact_number"
              value={newStudent.contact_number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="program" className="form-label">Program</label>
            <select
              className="form-select"
              id="program"
              name="program"
              value={newStudent.program}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Program</option>
              <option value="BSIT">BSIT</option>
              <option value="BSCS">BSCS</option>
              {/* Add other programs here */}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="year_level" className="form-label">Year Level</label>
            <select
              className="form-select"
              id="year_level"
              name="year_level"
              value={newStudent.year_level}
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
          <div className="mb-3">
            <label htmlFor="section" className="form-label">Section</label>
            <input
              type="text"
              className="form-control"
              id="section"
              name="section"
              value={newStudent.section}
              onChange={(e) => {
                // Automatically convert to uppercase and limit to 1 character
                const value = e.target.value.toUpperCase().slice(0, 1);
                setNewStudent({
                  ...newStudent,
                  section: value,
                });
              }}
              maxLength={1} // Limits input to 1 character
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="topics_or_subjects" className="form-label">Subjects</label>
            <select
              className="form-select"
              id="topics_or_subjects"
              name="topics_or_subjects"
              value={newStudent.topics_or_subjects}
              onChange={handleInputChange}
              required
            >
              <option value="Integrative Programming">Integrative Programming</option>
              <option value="Technopreneurship">Technopreneurship</option>
              <option value="Advanced Database and Systems">Advanced Database and Systems</option>
              <option value="Capstone 1">Capstone 1</option>
            </select>
          </div>
          {/* <div className="mb-3">
            <label htmlFor="academic_year" className="form-label">Academic Year</label>
            <input
              type="text"
              className="form-control"
              id="academic_year"
              name="academic_year"
              value={newStudent.academic_year}
              onChange={handleInputChange}
              required
            />
          </div> */}

<div className="mb-3">
    <label htmlFor="startYear" className="form-label">Select Year Range</label>
    <div className="d-flex">
      <select
        id="startYear"
        className="form-control"
        value={startYear}
        onChange={handleStartYearChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        id="endYear"
        className="form-control ms-2"
        value={endYear}
        onChange={handleEndYearChange}
        min={startYear}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  </div>



          <button type="submit" className="btn btn-primary">Add Student</button>
        </form>
      </div>


        {/* Update Student Form */}
        <div className="col-md-4">
          <h4>Update User</h4>
          <form onSubmit = {handleUpdateSubmit}>
            <div className="mb-3">
              <label htmlFor="updateId" className="form-label">Student ID</label>
              <input
                type="text"
                className="form-control"
                id="updateId"
                name="id"
                required
                onChange = {handleInputChangePut}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="updateName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                id="updateName"
                onChange={handleInputChangePut}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="updateGender" className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                id="updateGender"
                onChange={handleInputChangePut}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="updateSection" className="form-label">Section</label>
              <input
                type="text"
                className="form-control"
                name="section"
                id="updateSection"
                onChange={handleInputChangePut}
              />
              
            </div>
            <div className="mb-3">
              <label htmlFor="updateHobby" className="form-label">Hobby</label>
              <input
                type="text"
                className="form-control"
                id="updateHobby"
                name="hobby"
                onChange={handleInputChangePut}
              />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-warning">Update</button>
            </div>
          </form>
        </div>

        {/* Delete Student Form */}
        <div className="col-md-4">
          <h4>Delete User</h4>
          <form onSubmit = {handleDeleteSubmit}>
            <div className="mb-3">
              <label htmlFor="deleteId" className="form-label">Student ID</label>
              <input
                type="text"
                className="form-control"
                id="deleteId"
                value={deleteId}
                onChange = {handleDeleteChange}
                required
              />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-danger">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>                  
          </div>
          {/* / Content */}         
          <div className="content-backdrop fade" />
        </div>
        {/* Content wrapper */}
      </div>
      {/* / Layout page */}
    </div>
    {/* Overlay */}
    <div className="layout-overlay layout-menu-toggle" />
    {/* Drag Target Area To SlideIn Menu On Small Screens */}
    <div className="drag-target" />
  </div>
  {/* / Layout wrapper */}
  {/* Core JS */}
  {/* Vendors JS */}
  {/* Main JS */}
  {/* Page JS */}
</div>


  )
}

export default AppUserList