import express from 'express';
import {
  getAllSupervisors,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor
} from '../controllers/supervisorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllSupervisors);
router.get('/:id', protect, getSupervisorById);
router.put('/:id', protect, authorize('supervisor'), updateSupervisor);
router.delete('/:id', protect, authorize('supervisor'), deleteSupervisor);

export default router;