import express from 'express';
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('supervisor', 'admin'), getAllStudents);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, authorize('student'), updateStudent);
router.delete('/:id', protect, authorize('student'), deleteStudent);

export default router;