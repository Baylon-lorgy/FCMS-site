// Mock data for ConsultEase demo version
export const mockData = {
  // User data
  currentUser: {
    id: '1',
    name: 'Demo User',
    email: 'demo@student.buksu.edu.ph',
    role: 'student',
    schoolId: '1801101934',
    department: 'Information Technology'
  },

  // Faculty members
  faculty: [
    {
      id: '1',
      name: 'Anthony I Manalo',
      email: 'anthony.manalo@buksu.edu.ph',
      department: 'Information Technology',
      subjects: ['Integrative Programming', 'Technopreneurship'],
      schedule: [
        { day: 'Monday', time: '09:00-11:00', location: 'FACULTY' },
        { day: 'Wednesday', time: '13:30-15:30', location: 'FACULTY' }
      ]
    },
    {
      id: '2',
      name: 'Carlo P Navarro',
      email: 'carlo.navarro@buksu.edu.ph',
      department: 'Information Technology',
      subjects: ['Advanced Database and Systems', 'Capstone 1'],
      schedule: [
        { day: 'Tuesday', time: '13:30-15:00', location: 'FACULTY' },
        { day: 'Thursday', time: '10:00-12:00', location: 'FACULTY' }
      ]
    },
    {
      id: '3',
      name: 'Jay F Nabaliz',
      email: 'jay.nabaliz@buksu.edu.ph',
      department: 'Information Technology',
      subjects: ['Multimedia Systems', 'Web Development'],
      schedule: [
        { day: 'Monday', time: '13:22-15:22', location: 'FACULTY' },
        { day: 'Friday', time: '08:00-10:00', location: 'FACULTY' }
      ]
    }
  ],

  // Students
  students: [
    {
      id: '1',
      schoolId: '1801101934',
      name: 'Demo Student',
      email: 'demo@student.buksu.edu.ph',
      department: 'Information Technology',
      yearLevel: '4th Year',
      academicYear: '2024-2025'
    }
  ],

  // Consultations
  consultations: [
    {
      id: '1',
      studentId: '1',
      facultyId: '1',
      subject: 'Integrative Programming',
      purpose: 'Project consultation',
      date: '2025-02-10',
      time: '09:00-10:00',
      status: 'confirmed',
      location: 'FACULTY'
    },
    {
      id: '2',
      studentId: '1',
      facultyId: '2',
      subject: 'Advanced Database and Systems',
      purpose: 'Database design review',
      date: '2025-02-12',
      time: '13:30-14:30',
      status: 'pending',
      location: 'FACULTY'
    }
  ],

  // Subjects
  subjects: [
    {
      id: '1',
      code: 'T123-IT123',
      name: 'Integrative Programming',
      facultyId: '1',
      schedule: 'Monday 09:00-11:00'
    },
    {
      id: '2',
      code: 'T127-IT727',
      name: 'Multimedia Systems',
      facultyId: '3',
      schedule: 'Monday 13:22-15:22'
    },
    {
      id: '3',
      code: 'T125-IT525',
      name: 'Advanced Database and Systems',
      facultyId: '2',
      schedule: 'Tuesday 13:30-15:00'
    }
  ],

  // Messages
  messages: [
    {
      id: '1',
      from: 'Anthony I Manalo',
      to: 'Demo Student',
      subject: 'Consultation Reminder',
      message: 'Please bring your project files for tomorrow\'s consultation.',
      date: '2025-02-08',
      read: false
    },
    {
      id: '2',
      from: 'Carlo P Navarro',
      to: 'Demo Student',
      subject: 'Database Consultation',
      message: 'Your consultation has been confirmed for Wednesday.',
      date: '2025-02-07',
      read: true
    }
  ],

  // Statistics
  stats: {
    totalStudents: 150,
    totalFaculty: 25,
    totalConsultations: 45,
    pendingConsultations: 12,
    completedConsultations: 33
  }
};

// Mock API functions
export const mockAPI = {
  // Auth
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'admin@buksu.edu.ph' && credentials.password === 'admin123') {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: { ...mockData.currentUser, role: 'admin' }
      };
    } else if (credentials.email === 'faculty@buksu.edu.ph' && credentials.password === 'faculty123') {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: { ...mockData.currentUser, role: 'faculty' }
      };
    } else if (credentials.email === 'demo@student.buksu.edu.ph' && credentials.password === 'student123') {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: { ...mockData.currentUser, role: 'student' }
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  // Faculty
  getFacultyWithSubjects: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.faculty;
  },

  // Students
  getStudents: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.students;
  },

  // Consultations
  getConsultations: async (userId, role) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (role === 'student') {
      return mockData.consultations.filter(c => c.studentId === userId);
    } else if (role === 'faculty') {
      return mockData.consultations.filter(c => c.facultyId === userId);
    }
    return mockData.consultations;
  },

  // Messages
  getMessages: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.messages;
  },

  // Stats
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.stats;
  }
}; 