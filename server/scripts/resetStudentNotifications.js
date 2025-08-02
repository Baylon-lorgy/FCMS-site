const mongoose = require('mongoose');
const Consultation = require('../models/Consultation');
require('dotenv').config({ path: '../.env' });

async function resetStudentNotifications() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const result = await Consultation.updateMany(
      { isRead: { $ne: true } },
      { $set: { isRead: true } }
    );
    console.log(`Marked ${result.modifiedCount} notifications as read.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting student notifications:', error);
    process.exit(1);
  }
}

resetStudentNotifications(); 