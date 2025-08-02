const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Subject = require('../models/Subject');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 
const userController = require('../controllers/userController');  
const { verifyGoogleToken } = require('../controllers/googleAuthController');  
const bcrypt = require('bcryptjs');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Import your existing controller functions
const {
    createUser,
    loginUser,
    getAllUsers,
    getUserBySchoolId,
    updateUserBySchoolId,
    deleteUserBySchoolId,
    getTotalUsers,
    registerUser,
    registerStudent, 
    getTotalFirstYearStudents,
    getTotalSecondYearStudents,
    getTotalThirdYearStudents,
    getTotalFourthYearStudents,
    getTotalStudents,
    getTotalFaculty,
    getCurrentUser,
    getFacultyProfile,
    getFacultyBySchoolId,
    updateFacultyProfile,
    getStudents
} = require('../controllers/userController');

// Debug middleware
router.use((req, res, next) => {
    console.log('User Route:', req.method, req.path);
    console.log('Headers:', req.headers);
    next();
});

// Admin Dashboard Routes - These should be first and protected
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        console.log('Fetching stats...');
        // Only count verified students
        const students = await User.find({ role: 'student', isEmailVerified: true });
        const faculty = await User.find({ role: 'faculty', isEmailVerified: true });

        console.log('Raw student data:', students.map(s => ({ id: s._id, year: s.year_level })));

        const stats = {
            firstYear: students.filter(s => s.year_level === '1st year').length,
            secondYear: students.filter(s => s.year_level === '2nd year').length,
            thirdYear: students.filter(s => s.year_level === '3rd year').length,
            fourthYear: students.filter(s => s.year_level === '4th year').length,
            totalFaculty: faculty.length
        };

        console.log('Stats calculated:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
});

// Admin route to get all faculty
router.get('/faculty', protect, adminOnly, async (req, res) => {
    try {
        console.log('Fetching faculty...');
        const faculty = await User.find({ role: 'faculty', isEmailVerified: true })
            .select('-password')
            .lean();

        console.log('Found faculty:', faculty.length);
        res.json(faculty);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({ message: 'Error fetching faculty', error: error.message });
    }
});

// Admin route to get all students
router.get('/students', protect, adminOnly, async (req, res) => {
    try {
        console.log('Fetching students...');
        const students = await User.find({ role: 'student', isEmailVerified: true })
            .select('-password')
            .lean();

        console.log('Found students:', students.length);
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
});

// Admin route to get all unverified users (excluding admin)
router.get('/unverified', protect, adminOnly, async (req, res) => {
    try {
        console.log('Fetching unverified users (excluding admin)...');
        const unverifiedUsers = await User.find({ 
            isEmailVerified: false,
            role: { $ne: 'admin' },
            school_id: { $ne: 'ADMIN-001' }
        })
            .select('-password')
            .lean();
        console.log('Found unverified users:', unverifiedUsers.length);
        res.json(unverifiedUsers);
    } catch (error) {
        console.error('Error fetching unverified users:', error);
        res.status(500).json({ message: 'Error fetching unverified users', error: error.message });
    }
});

// Get all users route
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .lean();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Current user route
router.get('/current', getCurrentUser);

// User routes
router.get('/total', getTotalUsers);
router.get('/total-students', getTotalStudents);
router.get('/total-faculty', getTotalFaculty);
router.get('/total-first-year', getTotalFirstYearStudents);
router.get('/total-second-year', getTotalSecondYearStudents);
router.get('/total-third-year', getTotalThirdYearStudents);
router.get('/total-fourth-year', getTotalFourthYearStudents);
router.get('/faculty-profile', getFacultyProfile);
router.get('/faculty/:school_id', getFacultyBySchoolId);
router.get('/students', getStudents);
router.get('/:school_id', getUserBySchoolId);

// Update routes
router.put('/faculty-profile', updateFacultyProfile);
router.put('/:school_id', updateUserBySchoolId);

// Admin route to delete a user
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('Attempting to delete user with ID:', userId);
        
        // Try to find and delete by MongoDB _id
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            console.log('No user found with ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Successfully deleted user:', deletedUser._id);
        res.json({ 
            message: 'User deleted successfully',
            deletedUser: {
                _id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email,
                role: deletedUser.role
            }
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            message: 'Error deleting user', 
            error: error.message 
        });
    }
});

// Registration route for admin
router.post('/register', protect, adminOnly, async (req, res) => {
    try {
        console.log('Registering new user:', req.body);
        const { role, email, name, faculty_id, school_id, year_level, section, academic_year, password } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // For faculty, use faculty_id as school_id if provided
        const finalSchoolId = role === 'faculty' ? (faculty_id || school_id || `FAC-${Date.now()}`) : (school_id || `STU-${Date.now()}`);

        // Create base user data with role-specific defaults
        const userData = {
            email,
            name,
            password: password || '11111111', // Let the User model handle hashing
            role,
            school_id: finalSchoolId,
            account_agreement: true,
            contact_number: '',
            department: role === 'faculty' ? 'Information Technology' : '',
            position: role === 'faculty' ? 'Professor' : '',
            program: role === 'student' ? 'BSIT' : 'Not Specified',
            year_level: role === 'student' ? (year_level || 'Not Specified') : 'Not Specified',
            section: role === 'student' ? (section || 'Not Specified') : 'Not Specified',
            academic_year: role === 'student' ? (academic_year || '2023-2024') : 'Not Specified'
        };

        console.log('Creating user with data:', userData);
        const user = new User(userData);
        await user.save();
        console.log('User registered successfully:', user._id);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                school_id: user.school_id
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed', 
            error: error.message 
        });
    }
});

router.post('/register-student', registerStudent);

// Google Login route
router.post('/google-login', async (req, res) => {
    try {
        console.log('\n[Google Login] Attempt with token');
        const { idToken } = req.body;

        if (!idToken) {
            console.log('[Google Login] No token provided');
            return res.status(400).json({ 
                success: false,
                message: 'Google token is required' 
            });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log('[Google Login] Token verified for:', payload.email);

        const { sub: google_user_id, email, name, picture } = payload;

        // Check if user exists by Google ID or email
        let user = await User.findOne({ 
            $or: [
                { google_user_id },
                { email }
            ]
        });

        if (!user) {
            console.log('[Google Login] Creating new user for:', email);
            // Create new user with Google info
            user = new User({
                google_user_id,
                email,
                name,
                picture,
                isGoogleUser: true,
                role: 'student', // Default role
                school_id: `GOOGLE-${Date.now()}`,
                account_agreement: true,
                isEmailVerified: true
            });

            await user.save();
            console.log('[Google Login] New user created:', user._id);
        } else {
            console.log('[Google Login] Existing user found:', user._id);
            // Update Google info if needed
            if (!user.google_user_id) {
                user.google_user_id = google_user_id;
                user.isGoogleUser = true;
                user.picture = picture;
                await user.save();
            }
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('[Google Login] Successful login for:', email);
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.role
            },
            isGoogleUser: true
        });
    } catch (error) {
        console.error('[Google Login] Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error during Google login',
            error: error.message 
        });
    }
});

// Helper function to generate verification code
function generateVerificationCode() {
  // Generate a 4-digit code
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Helper function to get a random quote
function getRandomQuote() {
  const quotes = [
    "The only way to do great work is to love what you do. - rex larot",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - rex larot",
    "Believe you can and you're halfway there. - Dao ming Yu",
    "The future belongs to those who believe in the beauty of their dreams. - dao ming Yu",
    "Don't watch the clock; do what it does. Keep going. - Romel Casquits",
    "The only limit to our realization of tomorrow will be our doubts of today. - Rex larot",
    "It does not matter how slowly you go as long as you do not stop. - romel casquits",
    "Your time is limited, don't waste it living someone else's life. - dao ming yu",
    "The best way to predict the future is to create it. - rex larot",
    "Success is walking from failure to failure with no loss of enthusiasm. - Rex Larot"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    console.log('Received forgot password request:', req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? 'User found' : 'User not found');

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Update user with reset token
    user.resetPasswordCode = resetToken;
    user.resetPasswordCodeExpiry = resetTokenExpiry;
    
    // Save the user document
    await user.save();
    
    console.log('Reset token generated:', {
      email,
      token: resetToken,
      expiry: resetTokenExpiry
    });

    // Return success response with token
    return res.status(200).json({
      message: 'OTP has been sent to your email',
      token: resetToken
    });

  } catch (error) {
    console.error('Error in forgot-password route:', error);
    return res.status(500).json({ message: 'Server error while processing request' });
  }
});

// Add OTP verification route
router.post('/verify-otp', async (req, res) => {
  try {
    console.log('Verifying OTP:', req.body);
    const { email, otp } = req.body;

    if (!email || !otp) {
      console.log('Missing email or OTP:', { email, otp });
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('Found user:', user ? 'Yes' : 'No');
    console.log('User document:', user);

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('Checking OTP:', {
      provided: otp,
      stored: user.resetPasswordCode,
      expiry: user.resetPasswordCodeExpiry,
      isExpired: user.resetPasswordCodeExpiry < new Date()
    });

    // Check if OTP exists
    if (!user.resetPasswordCode) {
      console.log('No OTP found for user:', email);
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // Check if OTP has expired
    if (!user.resetPasswordCodeExpiry || user.resetPasswordCodeExpiry < new Date()) {
      console.log('OTP expired for user:', email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    if (otp !== user.resetPasswordCode) {
      console.log('Invalid OTP provided:', { provided: otp, stored: user.resetPasswordCode });
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Generate a new reset token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordCode = resetToken;
    user.resetPasswordCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    console.log('OTP verified successfully, generated reset token');

    return res.status(200).json({ 
      message: 'OTP verified successfully',
      token: resetToken
    });

  } catch (error) {
    console.error('Error in verify-otp route:', error);
    return res.status(500).json({ message: 'Server error while verifying OTP' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  try {
    console.log('Received reset password request:', {
      email: req.body.email,
      hasNewPassword: !!req.body.newPassword
    });
    const { email, newPassword } = req.body;

    // 1. Validate required fields
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? 'User found' : 'User not found');

    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // 3. Update password and clear reset code fields
    console.log('Updating password for user:', email);
    user.password = newPassword; // This will trigger the pre-save middleware
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpiry = undefined;

    await user.save(); // Save the user to hash the password

    console.log('Password updated successfully for:', email);

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Error in reset-password route:', error);
    return res.status(500).json({ message: 'Server error while resetting password' });
  }
});

// Example array to hold faculty data, normally you'd connect to a database
let facultyData = [];
router.post('/addfaculty', (req, res) => {
    try {
      // Get the data sent in the request body
      let facultyList = req.body;
  
      // If the data is not an array, wrap it in an array to treat it as a single item
      if (!Array.isArray(facultyList)) {
        facultyList = [facultyList];
      }
  
      // Validate that each item in the list contains required fields
      facultyList.forEach(faculty => {
        if (!faculty.name || !faculty.email || !faculty.department) {
          return res.status(400).json({ error: 'Faculty data missing required fields.' });
        }
      });
  
      // Here we would typically save the data to a database (MongoDB, SQL, etc.)
      // For now, we're pushing it to an in-memory array
      facultyData.push(...facultyList);
  
      // Respond with a success message and the saved data
      res.status(201).json({
        message: 'Faculty data successfully added.',
        data: facultyList
      });
    } catch (error) {
      // Handle unexpected errors
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  });

// Debug route to get faculty users with their subjects
router.get('/debug-faculty', async (req, res) => {
    try {
        const users = await User.find({ role: 'faculty' }).lean();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No faculty users found' });
        }

        // For each faculty member, fetch their subjects
        const facultyWithSubjects = await Promise.all(users.map(async (faculty) => {
            try {
                const subjects = await Subject.find({ 
                    facultyId: faculty._id,
                    isActive: true 
                }).lean();

                return {
                    ...faculty,
                    subjects: subjects.map(subject => ({
                        id: subject._id,
                        code: subject.subjectCode,
                        name: subject.subjectName,
                        schedule: {
                            day: subject.schedule.day,
                            startTime: subject.schedule.startTime,
                            endTime: subject.schedule.endTime
                        },
                        room: subject.room
                    }))
                };
            } catch (error) {
                console.error(`Error fetching subjects for faculty ${faculty._id}:`, error);
                return faculty;
            }
        }));

        res.json(facultyWithSubjects);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({ message: 'Error fetching faculty' });
    }
});

// Debug route to add a test faculty user
router.post('/debug-add-faculty', async (req, res) => {
    try {
        const testFaculty = new User({
            school_id: 'FAC001',
            name: 'Test Faculty',
            email: 'test.faculty@example.com',
            password: 'password123',
            contact_number: '1234567890',
            department: 'Information Technology',
            position: 'Professor',
            specialization: 'Web Development',
            role: 'faculty',
            topics_or_subjects: ['Web Programming', 'Database Systems']
        });

        await testFaculty.save();
        console.log('Created test faculty user:', testFaculty);
        res.json({ message: 'Test faculty user created', faculty: testFaculty });
    } catch (error) {
        console.error('Error creating test faculty:', error);
        res.status(500).json({ message: 'Error creating test faculty', error: error.message });
    }
});

// Debug route to add test users
router.post('/debug-add-test-users', async (req, res) => {
    try {
        // Create a test faculty member
        const testFaculty = new User({
            school_id: 'FAC123',
            name: 'Test Faculty',
            email: 'faculty@test.com',
            password: await bcrypt.hash('password123', 10),
            role: 'faculty',
            account_agreement: true,
            department: 'Information Technology',
            position: 'Professor'
        });

        // Create a test student
        const testStudent = new User({
            school_id: 'STU123',
            name: 'Test Student',
            email: 'student@test.com',
            password: await bcrypt.hash('password123', 10),
            role: 'student',
            account_agreement: true,
            year_level: '3rd year',
            section: 'A',
            program: 'BSIT',
            academic_year: '2023-2024'
        });

        await Promise.all([
            testFaculty.save(),
            testStudent.save()
        ]);

        res.json({ 
            message: 'Test users created successfully',
            users: {
                faculty: {
                    email: 'faculty@test.com',
                    password: 'password123'
                },
                student: {
                    email: 'student@test.com',
                    password: 'password123'
                }
            }
        });
    } catch (error) {
        console.error('Error creating test users:', error);
        res.status(500).json({ message: 'Error creating test users', error: error.message });
    }
});

// Delete user by email
router.delete('/delete-by-email', protect, adminOnly, async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Attempting to delete user with email:', email);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteOne({ email });
        console.log('User deleted successfully:', email);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('\n[Login] Attempt with:', {
    email: req.body.email,
    hasPassword: !!req.body.password
  });
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email and include the password field
    const user = await User.findOne({ email }).select('+password');
    console.log('[Login] Found user:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Log the hashed password for debugging
    console.log('[Login] Hashed password in database:', user.password);

    // Check regular password
    console.log('[Login] Checking regular password');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[Login] Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('[Login] Login successful for:', email);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      isTemporaryPassword: false
    });
  } catch (error) {
    console.error('[Login] Error:', error);
    res.status(500).json({ message: 'Server error occurred' });
  }
});

// Helper function to send reset email with code
async function sendResetEmail(to, verificationCode) {
  console.log('\n[Sending Reset Email]');
  console.log('To:', to);
  console.log('Code:', verificationCode);
  console.log('Email Config:', {
    user: process.env.EMAIL_USER,
    host: 'smtp.gmail.com',
    port: 587
  });

  const randomQuote = getRandomQuote();

  const mailOptions = {
    from: '"Faculty Consultation System" <<L.Baylon/>@gmail.com>',
    to,
    subject: 'Your Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; text-align: center;">Password Reset OTP</h2>
        <div style="background-color: #f8f9fa; border-radius: 4px; padding: 16px; margin: 24px 0; text-align: center;">
          <h1 style="color: #e53935; letter-spacing: 4px; font-size: 32px; margin: 0;">${verificationCode}</h1>
        </div>
        <p style="color: #666; text-align: center; margin-bottom: 24px;">
          Enter this 4-digit OTP to verify your identity and reset your password.
        </p>
        <div style="background-color: #f0f7ff; border-left: 4px solid #4a90e2; padding: 12px; margin: 24px 0; border-radius: 4px;">
          <p style="color: #4a90e2; font-style: italic; margin: 0;">
            "${randomQuote}"
          </p>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center;">
          This OTP will expire in 15 minutes.
        </p>
      </div>
    `
  };

  try {
    // Create transporter with specific Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('Transporter created, attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = router;
