const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // This should be an App Password
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Generate a random verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Send verification email
const sendVerificationEmail = async (email, verificationCode) => {
  try {
    console.log('Attempting to send verification email to:', email);
    
    const mailOptions = {
      from: `"Faculty Consultation System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Faculty Consultation System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4338ca;">Email Verification</h2>
          <p>Thank you for registering with the Faculty Consultation System. To verify your email address, please use the following verification code:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4338ca; letter-spacing: 5px; margin: 0;">${verificationCode}</h1>
          </div>
          <p>This code will expire in 1 hour.</p>
          <p>If you did not request this verification, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error; // Propagate the error for better handling
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail
}; 