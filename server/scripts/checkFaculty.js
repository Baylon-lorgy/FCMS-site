const mongoose = require('mongoose');
const User = require('../models/User');
const axios = require('axios');

const MONGODB_URI = 'mongodb+srv://rxjking17:Joshmark123@facultyconsultationsyst.xkf6e.mongodb.net/?retryWrites=true&w=majority&tls=true&appName=FacultyConsultationSystem';

const checkAllUsers = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        // IMPORTANT: This is a protected admin operation. Do not modify these credentials.
        // Only the system admin account can bypass captcha and access all user data.
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: '1801101934@student.buksu.edu.ph',  // Admin account - DO NOT CHANGE
            password: 'anypassword123'                  // Admin password - DO NOT CHANGE
        });

        const token = loginResponse.data.token;
        console.log('Authentication successful');

        // Find all users with authentication
        const users = await User.find({}).setOptions({
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('\nTotal Users:', users.length);

        // Group users by role
        const usersByRole = {
            admin: [],
            faculty: [],
            student: []
        };

        users.forEach(user => {
            if (user.role) {
                usersByRole[user.role].push(user);
            }
        });

        // Display users by role
        Object.entries(usersByRole).forEach(([role, roleUsers]) => {
            console.log(`\n=== ${role.toUpperCase()} USERS (${roleUsers.length}) ===`);
            roleUsers.forEach((user, index) => {
                console.log(`\n${role} #${index + 1}:`);
                console.log('Name:', user.name);
                console.log('Email:', user.email);
                console.log('School ID:', user.school_id);
                console.log('Role:', user.role);
                if (user.role === 'faculty') {
                    console.log('Department:', user.department);
                    console.log('Position:', user.position);
                }
                if (user.role === 'student') {
                    console.log('Year Level:', user.year_level);
                    console.log('Section:', user.section);
                    console.log('Program:', user.program);
                }
                console.log('Contact Number:', user.contact_number);
                console.log('Is Active:', user.isActive);
                console.log('Is Google User:', user.isGoogleUser);
                console.log('Created At:', user.createdAt);
                console.log('Updated At:', user.updatedAt);
            });
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkAllUsers(); 