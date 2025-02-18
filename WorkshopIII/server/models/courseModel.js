const API_URLC = "http://localhost:3001/api/courses"; 
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  credits: { 
    type: Number, 
    required: true, 
    min: [1, 'Credits must be at least 1'],
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'teachers', 
    required: true 
  }
});

module.exports = mongoose.model('Course', courseSchema);
