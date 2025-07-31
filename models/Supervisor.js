import mongoose from 'mongoose';
import User from './User.js';

const supervisorSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
});

const Supervisor = User.discriminator('Supervisor', supervisorSchema);
export default Supervisor;