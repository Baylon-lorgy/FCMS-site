import React, { useState, useEffect } from 'react';

const InstructorCard = ({ name, imgSrc }) => (
  <div className="col-sm-6 col-xl-3">
    <div className="card instructor-card">
      <div className="card-body">
        <div className="content-left">
          <div className="d-flex justify-content-center">
            <img src={imgSrc} alt={`${name}'s Profile`} className="profile-pic" />
          </div>
          <h5 className="instructor-name">{name}</h5>
          <button className="btn-appointment">Create Appointment</button>
        </div>
      </div>
    </div>
  </div>
);

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    // Fetch instructor data from the backend when the component mounts
    fetch('http://localhost:5000/api/faculty')
      .then((response) => response.json())
      .then((data) => setInstructors(data))
      .catch((error) => console.error('Error fetching instructors:', error));
  }, []); // Empty dependency array, so it runs only once after the component mounts

  // Function to add a new instructor
  const addInstructor = () => {
    const newInstructor = { name: 'New Instructor', imgSrc: './assets/img/avatars/13.png' };
    setInstructors([...instructors, newInstructor]);
  };

  return (
    <div>
      <div className="row g-4 mb-4">
        {instructors.map((instructor, index) => (
          <InstructorCard key={index} name={instructor.name} imgSrc={instructor.imgSrc} />
        ))}
      </div>
      <button onClick={addInstructor} className="btn-appointment">Add New Instructor</button>
    </div>
  );
};

export default InstructorList;
