const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  school_id: {
    type: String,
    required: [true, 'School ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationCode: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['student', 'faculty', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  account_agreement: {
    type: Boolean,
    required: [true, 'Account agreement is required']
  },
  contact_number: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: ''
  },
  program: {
    type: String,
    default: 'Not Specified'
  },
  year_level: {
    type: String,
    default: 'Not Specified'
  },
  section: {
    type: String,
    default: 'Not Specified'
  },
  academic_year: {
    type: String,
    default: () => `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  profilePicture: { 
    type: String 
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  tempPassword: {
    type: String,
    default: null
  },
  isTemporaryPassword: {
    type: Boolean,
    default: false
  },
  resetPasswordCode: {
    type: String,
    default: null
  },
  resetPasswordCodeExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.tempPassword;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    console.log('Pre-save middleware triggered for user:', this.email);
    
    // Skip hashing for temporary passwords
    if (this.isTemporaryPassword) {
      console.log('Temporary password detected, skipping hashing for:', this.email);
      return next();
    }

    // Only hash the password if it's been modified or is new
    if (!this.isModified('password')) {
      console.log('Password not modified for user:', this.email);
      return next();
    }

    // Skip hashing for Google users
    if (this.isGoogleUser) {
      console.log('Google user detected, skipping password hashing for:', this.email);
      return next();
    }

    // Regular password validation
    if (!this.password || this.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    console.log('Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    console.log('Password hashed successfully for user:', this.email);
    next();
  } catch (error) {
    console.error('Error in password hashing:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing password for user:', this.email);
    
    // Check if password exists
    if (!this.password && !this.tempPassword) {
      console.log('No password set for user:', this.email);
      return false;
    }

    // Skip comparison for Google users
    if (this.isGoogleUser) {
      console.log('Google user detected, password comparison not applicable for:', this.email);
      return false;
    }

    // Validate candidate password
    if (!candidatePassword || typeof candidatePassword !== 'string') {
      console.log('Invalid candidate password provided for user:', this.email);
      return false;
    }

    // Handle temporary password comparison first
    if (this.isTemporaryPassword && this.tempPassword) {
      console.log('Comparing temporary password for user:', this.email);
      console.log('Candidate:', candidatePassword);
      console.log('Stored temp:', this.tempPassword);
      const isMatch = candidatePassword === this.tempPassword;
      console.log('Temporary password match:', isMatch);
      
      if (isMatch) {
        // Clear temporary password after successful login
        this.tempPassword = null;
        this.isTemporaryPassword = false;
        await this.save();
      }
      return isMatch;
    }

    // Regular password comparison
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Regular password comparison result for user:', this.email, ':', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords for user:', this.email, error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
