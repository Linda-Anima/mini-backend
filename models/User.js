import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },
  contact: {
    type: String,
    required: false,
    trim: true,
    match: /^\d{10}$/,
  },
  department: {
    type: String,
    required: false,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  picture: {
    type: String,
    trim: true,
    default: "https://example.com/default-profile-picture.png",
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  role: {
  type: String,
  enum: ['student', 'supervisor', 'admin'],
  required: true,
  default: 'student'
},
}, {
  discriminatorKey: 'role',
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = User.discriminator('Admin', new mongoose.Schema({}));

const User = mongoose.model('User', userSchema);
export default User;