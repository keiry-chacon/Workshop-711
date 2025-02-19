const API_URLC = "http://localhost:3001/api/courses"; 
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  code: {  
    type: String,  
    required: true, 
    unique: true, 
  },
  description: {  
    type: String, 
    required: false,  
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'teachers', 
    required: true 
  }
});

module.exports = mongoose.model('Course', courseSchema);
