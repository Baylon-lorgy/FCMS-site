const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateAllFaculty = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty-consultation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Find all faculty users
        const faculty = await User.find({ role: 'faculty' });
        console.log('Found', faculty.length, 'faculty users');

        // Update each faculty user
        for (const f of faculty) {
            console.log('\nProcessing faculty:', f.email);
            
            // Update the user with isActive set to true
            const updatedUser = await User.findByIdAndUpdate(
                f._id,
                { 
                    $set: { 
                        isActive: true,
                        // Ensure other required fields have default values
                        department: f.department || 'Not Specified',
                        contact_number: f.contact_number || '',
                        position: f.position || '',
                        program: f.program || 'Not Specified',
                        year_level: f.year_level || 'Not Specified',
                        section: f.section || 'Not Specified'
                    }
                },
                { new: true }
            );

            console.log('Updated:', updatedUser.email);
            console.log('Is Active:', updatedUser.isActive);
            console.log('Department:', updatedUser.department);
        }

        // Verify all updates
        const updatedFaculty = await User.find({ role: 'faculty' });
        console.log('\nFinal Status:');
        console.log('Total faculty:', updatedFaculty.length);
        
        updatedFaculty.forEach(f => {
            console.log('\nFaculty Details:');
            console.log('Name:', f.name);
            console.log('Email:', f.email);
            console.log('Is Active:', f.isActive);
            console.log('Department:', f.department);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

updateAllFaculty(); 