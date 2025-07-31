import mongoose from 'mongoose';
import User from './User.js';

const studentSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  studentId: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
});

const Student = User.discriminator('Student', studentSchema);
export default Student;