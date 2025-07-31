import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  reviewProject,
  uploadDocumentation,
  getMyProjects,
  getSupervisedProjects
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('student'), createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, authorize('student'), deleteProject);

router.put('/:id/review', protect, authorize('supervisor'), reviewProject);
router.put('/:id/documentation', protect, authorize('student'), uploadDocumentation);

// Student-specific routes
router.get('/students/me/projects', protect, authorize('student'), getMyProjects);

// Supervisor-specific routes
router.get('/supervisors/me/projects', protect, authorize('supervisor'), getSupervisedProjects);

export default router;