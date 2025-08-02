import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const SubjectsScheduling = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('subjectCode');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedDay, setSelectedDay] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentSubject, setCurrentSubject] = useState({
    id: null,
    subjectCode: '',
    subjectName: '',
    schedule: {
      day: '',
      startTime: '',
      endTime: ''
    },
    room: ''
  });

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

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
      fetchSubjects();
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
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch subjects'
        });
      }
    }
  };

  // Sort function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort subjects
  const getFilteredAndSortedSubjects = () => {
    return subjects
      .filter(subject => {
        const matchesSearch = (
          subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.room.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesDay = !selectedDay || subject.schedule.day === selectedDay;
        return matchesSearch && matchesDay;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'subjectCode':
            comparison = a.subjectCode.localeCompare(b.subjectCode);
            break;
          case 'subjectName':
            comparison = a.subjectName.localeCompare(b.subjectName);
            break;
          case 'schedule':
            comparison = a.schedule.day.localeCompare(b.schedule.day);
            if (comparison === 0) {
              comparison = a.schedule.startTime.localeCompare(b.schedule.startTime);
            }
            break;
          case 'room':
            comparison = a.room.localeCompare(b.room);
            break;
          default:
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Only include subjectSchedule if not empty (but do not send to backend)
      const subjectData = {
        subjectCode: currentSubject.subjectCode,
        subjectName: currentSubject.subjectName,
        schedule: {
          day: currentSubject.schedule.day,
          startTime: currentSubject.schedule.startTime,
          endTime: currentSubject.schedule.endTime
        },
        room: currentSubject.room
      };
      // subjectSchedule is NOT sent to backend
      console.log('Submitting subjectData:', subjectData);

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/subjects/${currentSubject.id}`,
          subjectData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/subjects', subjectData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowModal(false);
      fetchSubjects();
      setCurrentSubject({
        id: null,
        subjectCode: '',
        subjectName: '',
        schedule: {
          day: '',
          startTime: '',
          endTime: ''
        },
        room: ''
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Subject ${isEditing ? 'updated' : 'added'} successfully`
      });
    } catch (error) {
      console.error('Error saving subject:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error saving subject'
      });
    }
  };

  const handleDelete = async (id) => {
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
        if (!token) {
          navigate('/login');
          return;
        }

        await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        Swal.fire(
          'Deleted!',
          'Subject has been deleted.',
          'success'
        );
        fetchSubjects();
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete subject'
      });
    }
  };

  const handleModalShow = (subject = null) => {
    if (subject) {
      setCurrentSubject({
        id: subject._id,
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        schedule: subject.schedule,
        room: subject.room
      });
      setIsEditing(true);
    } else {
      setCurrentSubject({
        id: null,
        subjectCode: '',
        subjectName: '',
        schedule: {
          day: '',
          startTime: '',
          endTime: ''
        },
        room: ''
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const formatSchedule = (schedule) => {
    return `${schedule.day} ${schedule.startTime} - ${schedule.endTime}`;
  };

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
                onClick={() => navigate('/subject-scheduling')}
              >
                <MenuBookIcon />
                Subject Schedule
              </button>
              <div className="dropdown">
                <button 
                  className="btn nav-button d-flex align-items-center gap-2"
                  onClick={toggleDropdown}
                >
                  <AccountCircleIcon />
                  <span>{userData?.name || 'User'}</span>
                </button>
                {showProfileDropdown && (
                  <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      <AccountCircleIcon className="me-2" fontSize="small" />
                      Profile
                    </button>
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

      <Container className="py-4">
        <Card className="shadow">
          <Card.Header className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-link text-decoration-none text-dark"
                  onClick={() => navigate('/appointmentcards')}
                >
                  <ArrowBackIcon /> Back
                </button>
                <h5 className="mb-0 ms-3">Subjects Management</h5>
              </div>
              <div className="d-flex align-items-center">
                <Button variant="primary" onClick={() => handleModalShow()}>
                  <AddIcon className="me-1" /> Add Subject
                </Button>
              </div>
            </div>
            <div className="d-flex gap-3">
              <InputGroup>
                <InputGroup.Text>
                  <SearchIcon />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Form.Select
                style={{ width: 'auto' }}
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">All Days</option>
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Form.Select>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('subjectCode')} style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center">
                        Subject Code
                        {sortField === 'subjectCode' && (
                          <SortIcon className={`ms-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => handleSort('subjectName')} style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center">
                        Subject Name
                        {sortField === 'subjectName' && (
                          <SortIcon className={`ms-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => handleSort('schedule')} style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center">
                        Schedule
                        {sortField === 'schedule' && (
                          <SortIcon className={`ms-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => handleSort('room')} style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center">
                        Room
                        {sortField === 'room' && (
                          <SortIcon className={`ms-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAndSortedSubjects().map((subject) => (
                    <tr key={subject._id}>
                      <td>
                        <Badge bg="primary" className="fw-normal">
                          {subject.subjectCode}
                        </Badge>
                      </td>
                      <td>{subject.subjectName}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <AccessTimeIcon className="me-2" fontSize="small" />
                          <div>
                            {subject.schedule
                              ? formatSchedule(subject.schedule)
                              : <span className="text-muted">No schedule</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <RoomIcon className="me-2" fontSize="small" />
                          <Badge bg="secondary" className="fw-normal">
                            {subject.room}
                          </Badge>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleModalShow(subject)}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(subject._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Edit Subject & Schedule' : 'Add Subject & Schedule'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter subject code"
                      value={currentSubject.subjectCode}
                      onChange={(e) =>
                        setCurrentSubject({
                          ...currentSubject,
                          subjectCode: e.target.value
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter subject name"
                      value={currentSubject.subjectName}
                      onChange={(e) =>
                        setCurrentSubject({
                          ...currentSubject,
                          subjectName: e.target.value
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Day of Consultation</Form.Label>
                    <Form.Select
                      value={currentSubject.schedule.day}
                      onChange={(e) =>
                        setCurrentSubject({
                          ...currentSubject,
                          schedule: {
                            ...currentSubject.schedule,
                            day: e.target.value
                          }
                        })
                      }
                      required
                    >
                      <option value="">Select Day</option>
                      <option value="M">M</option>
                      <option value="T">T</option>
                      <option value="W">W</option>
                      <option value="Th">Th</option>
                      <option value="F">F</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={currentSubject.schedule.startTime}
                      onChange={(e) =>
                        setCurrentSubject({
                          ...currentSubject,
                          schedule: {
                            ...currentSubject.schedule,
                            startTime: e.target.value
                          }
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={currentSubject.schedule.endTime}
                      onChange={(e) =>
                        setCurrentSubject({
                          ...currentSubject,
                          schedule: {
                            ...currentSubject.schedule,
                            endTime: e.target.value
                          }
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  value={currentSubject.room}
                  onChange={(e) =>
                    setCurrentSubject({
                      ...currentSubject,
                      room: e.target.value
                    })
                  }
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {isEditing ? 'Update' : 'Add'} Subject
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default SubjectsScheduling;