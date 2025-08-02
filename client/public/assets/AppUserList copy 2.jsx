import React, { useState, useEffect } from 'react'; // mag import React and hooks
import 'bootstrap/dist/css/bootstrap.min.css'; // mag import Bootstrap CSS for styling


function AppUserList() {
    const [students, setStudents] = useState([]); // state para mag store sa list of students
    const [totalUsers, setTotalUsers] = useState(null); // state to store the total number of users

    const [totalFirstYearStudents, setTotalFirstYearStudents] = useState(null); // null for loading state
    const [totalSecondYearStudents, setTotalSecondYearStudents] = useState(null); // null for loading state
    const [totalThirdYearStudents, setTotalThirdYearStudents] = useState(null); // null for loading state
    const [totalFourthYearStudents, setTotalFourthYearStudents] = useState(null); // null for loading state
    const [limit, setLimit] = useState(5); // Default to 5 students


    
    // Function to fetch students data
    const fetchStudents = async () => {
      try {
          const response = await fetch('http://localhost:5000/api/students');
          if (!response.ok) {
              throw new Error('Failed to fetch students');
          }
          const data = await response.json();
          console.log(data); // Log response data to inspect the result
          const filteredStudents = data.filter(student => student.role === 'student');
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
      console.log('useEffect executed');
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
    academic_year: '',
  });
  

  const [inputValue, setInputValue] = useState(''); // Initialize with an empty string or a default value

  const handleChange = (e) => {
    setInputValue(e.target.value); // Set the state when input changes
  };
  
  // Handle input changes for the new student form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStudent({
      ...newStudent,
      [name]: value,  // Update the specific field (academic_year)
    });
  };
  
  const handleAddStudent = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Validate required fields before submitting
    if (!newStudent.name || !newStudent.email || !newStudent.school_id) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add student: ${errorData.message || 'Unknown error'}`);
      }
  
      const result = await response.json();
      console.log('Student added successfully:', result);
      alert('Student added successfully!');
  
      // Assuming the backend returns the new student data with the correct timestamp
      setStudents(prevStudents => [result.newStudent, ...prevStudents]); // Add new student on top
  
      // Reset form fields after successful submission
      setNewStudent({
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
  
    } catch (error) {
      console.error('Error adding student:', error);
      alert('An error occurred while adding the student.');
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
  
  {/* Layout wrapper */}
  <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      {/* Menu */}
      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      
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
        </ul>
      </aside>
      
{/* / Menu */}
{/* Layout container */}
<div className="layout-page">
  {/* Navbar */}
  
        {/* / Navbar */}
        {/* Content wrapper */}
        <div className="content-wrapper">
          {/* Content */}
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* {Cards} */}
 {/* mag add ko diri  */}
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

          <div className="mb-3">
            <label htmlFor="academic_year" className="form-label">Academic Year</label>
            <small> "2014-2015"</small>
            <input
              type="text"
              className="form-control"
              id="academic_year"
              name="academic_year"
              value={newStudent.academic_year}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Manage Student</button>
        </form>
      </div>



      </div>
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