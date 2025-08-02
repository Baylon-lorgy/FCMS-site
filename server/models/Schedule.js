const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  maxSlots: {
    type: Number,
    required: true,
    default: 2,
    min: 1,
    max: 10
  }
}, { timestamps: true });

// Create index for efficient querying
scheduleSchema.index({ facultyId: 1, subjectId: 1, day: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
