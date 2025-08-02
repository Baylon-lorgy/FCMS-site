const nodemailer = require('nodemailer');
const User = require('../models/User');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

// Function to verify transporter connection
const verifyTransporter = async () => {
  console.log('Verifying email transporter connection...');
  console.log('Email credentials:', {
    EMAIL_USER: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.slice(0, 3)}...${process.env.EMAIL_USER.slice(-5)}` : 'Not set',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set (hidden)' : 'Not set'
  });
  
  try {
    const verification = await transporter.verify();
    console.log('Transporter verification result:', verification);
    return verification;
  } catch (error) {
    console.error('Transporter verification failed:', error);
    return false;
  }
};

// Function to send a test email
const sendTestEmail = async (recipient) => {
  console.log(`Sending test email to ${recipient}...`);
  
  try {
    // Setup email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: 'BOSS System - Email Test',
      html: `
        <h2>BOSS System Email Test</h2>
        <p>This is a test email from the BOSS system to verify email functionality.</p>
        <p>If you received this email, it means the email service is working correctly!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
        <hr>
        <small>This is an automated message. Please do not reply.</small>
      `
    };
    
    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Failed to send test email:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    };
  }
};

// Function to send announcement to all users via email
const sendAnnouncementToAll = async (announcement) => {
  console.log('Starting sendAnnouncementToAll function...');
  console.log('Email environment variables status:', {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'
  });
  
  try {
    // Verify connection first
    const isConnected = await verifyTransporter();
    if (!isConnected) {
      return {
        success: false, 
        message: 'Email service connection failed. Check credentials.'
      };
    }
    
    const users = await User.find({}, 'email firstName lastName role');
    console.log(`Found ${users.length} users to send emails to`);
    
    if (users.length === 0) {
      return {
        success: false,
        message: 'No users found in the database'
      };
    }
    
    // Split users into batches to avoid Gmail recipient limits
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < users.length; i += batchSize) {
      batches.push(users.slice(i, i + batchSize));
    }
    
    console.log(`Split users into ${batches.length} batches of max ${batchSize} recipients`);
    
    const results = {
      totalUsers: users.length,
      successful: 0,
      failed: 0,
      errors: []
    };
    
    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} recipients`);
      
      try {
        const recipients = batch.map(user => user.email).join(',');
        
        // Setup email options
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipients,
          subject: announcement.subject,
          html: `
            <h2>${announcement.subject}</h2>
            <p>${announcement.content}</p>
            <p>Date: ${new Date(announcement.createdAt).toLocaleDateString()}</p>
            <p>- BOSS Admin Team</p>
          `
        };
        
        // Send mail
        const info = await transporter.sendMail(mailOptions);
        console.log(`Batch ${i+1} email sent:`, info.messageId);
        results.successful += batch.length;
      } catch (error) {
        console.error(`Error sending batch ${i+1}:`, error);
        results.failed += batch.length;
        results.errors.push({
          batch: i+1,
          error: error.message
        });
      }
    }
    
    console.log('Email sending completed with results:', results);
    return {
      success: results.successful > 0,
      message: `Email sent to ${results.successful} out of ${results.totalUsers} users`,
      results
    };
  } catch (error) {
    console.error('Error in sendAnnouncementToAll:', error);
    return {
      success: false,
      message: 'Failed to send announcement emails',
      error: error.message
    };
  }
};

// Function to send consultation status update email to a student
const sendConsultationStatusEmail = async (recipient, studentName, facultyName, subjectName, status) => {
  let statusText = '';
  let statusColor = '#4338ca';
  if (status === 'approved') {
    statusText = 'approved';
    statusColor = '#28a745';
  } else if (status === 'rejected') {
    statusText = 'rejected';
    statusColor = '#dc3545';
  } else {
    statusText = status;
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: `Consultation Request ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4338ca;">Consultation Status Update</h2>
        <p>Dear ${studentName},</p>
        <p>Your consultation request for <strong>${subjectName}</strong> with <strong>${facultyName}</strong> has been <span style="color: ${statusColor}; font-weight: bold;">${statusText.toUpperCase()}</span>.</p>
        <p>If you have any questions, please contact your faculty member.</p>
        <p>Thank you for using the Faculty Consultation System.</p>
      </div>
    `
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Consultation status email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending consultation status email:', error);
    return false;
  }
};

module.exports = {
  sendAnnouncementToAll,
  sendTestEmail,
  verifyTransporter,
  sendConsultationStatusEmail
}; 