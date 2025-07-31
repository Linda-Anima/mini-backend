import express from 'express';
import {
  assignStudentToSupervisor,
  getAllUsers,
  createAdmin,
  getAllProjects,
  updateProjectStatus,
  deleteUser,
  getStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes protected and only accessible by admin
router.use(protect);
router.use(authorize('admin'));

router.post('/assign-student', assignStudentToSupervisor);
router.get('/users', getAllUsers);
router.post('/create-admin', createAdmin);
router.get('/projects', getAllProjects);
router.put('/projects/:id/status', updateProjectStatus);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

export default router;