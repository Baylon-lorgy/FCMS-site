const Schedule = require('../models/scheduleModel');

// Get all schedules for a specific user
const getSchedules = async (req, res) => {
  try {
    console.log('Getting schedules for user:', req.user._id);
    const schedules = await Schedule.find({ userId: req.user._id });
    console.log('Found schedules:', schedules);
    res.json(schedules);
  } catch (error) {
    console.error('Error getting schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
};

// Create a new schedule
const createSchedule = async (req, res) => {
  try {
    console.log('Creating schedule with data:', req.body);
    const { day, startTime, endTime, location } = req.body;
    
    // Validate required fields
    if (!day || !startTime || !endTime || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const schedule = new Schedule({
      userId: req.user._id,
      day,
      startTime,
      endTime,
      location
    });

    const savedSchedule = await schedule.save();
    console.log('Created schedule:', savedSchedule);
    res.status(201).json(savedSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(400).json({ message: 'Error creating schedule', error: error.message });
  }
};

// Update a schedule
const updateSchedule = async (req, res) => {
  try {
    console.log('Updating schedule:', req.params.id);
    const { id } = req.params;
    const { day, startTime, endTime, location } = req.body;
    
    // Validate required fields
    if (!day || !startTime || !endTime || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const schedule = await Schedule.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { day, startTime, endTime, location },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    console.log('Updated schedule:', schedule);
    res.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(400).json({ message: 'Error updating schedule', error: error.message });
  }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
  try {
    console.log('Deleting schedule:', req.params.id);
    const { id } = req.params;
    const schedule = await Schedule.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    console.log('Deleted schedule:', schedule);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(400).json({ message: 'Error deleting schedule', error: error.message });
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
