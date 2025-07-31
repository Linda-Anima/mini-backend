import Supervisor from '../models/Supervisor.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get all supervisors
// @route   GET /api/supervisors
export const getAllSupervisors = async (req, res, next) => {
  try {
    const supervisors = await Supervisor.find().select('-password');
    res.status(200).json(
      ApiResponse.success(supervisors, 'Supervisors retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get supervisor by ID
// @route   GET /api/supervisors/:id
export const getSupervisorById = async (req, res, next) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id).select('-password');

    if (!supervisor) {
      return res.status(404).json(
        ApiResponse.error('Supervisor not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(supervisor, 'Supervisor retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Update supervisor
// @route   PUT /api/supervisors/:id
export const updateSupervisor = async (req, res, next) => {
  try {
    // Supervisors can only update their own profile
    if (req.params.id !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to update this supervisor')
      );
    }

    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!supervisor) {
      return res.status(404).json(
        ApiResponse.error('Supervisor not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(supervisor, 'Supervisor updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Delete supervisor
// @route   DELETE /api/supervisors/:id
export const deleteSupervisor = async (req, res, next) => {
  try {
    // Supervisors can only delete their own account
    if (req.params.id !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to delete this supervisor')
      );
    }

    const supervisor = await Supervisor.findByIdAndDelete(req.params.id);

    if (!supervisor) {
      return res.status(404).json(
        ApiResponse.error('Supervisor not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(null, 'Supervisor deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};