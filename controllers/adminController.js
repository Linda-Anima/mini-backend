import Student from '../models/Student.js';
import Supervisor from '../models/Supervisor.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Assign student to supervisor
// @route   POST /api/admin/assign-student
export const assignStudentToSupervisor = async (req, res, next) => {
  try {
    const { studentId, supervisorId } = req.body;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json(
        ApiResponse.error('Student not found')
      );
    }

    // Check if supervisor exists
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json(
        ApiResponse.error('Supervisor not found')
      );
    }

    // Add student to supervisor's list
    if (!supervisor.students.includes(studentId)) {
      supervisor.students.push(studentId);
      await supervisor.save();
    }

    res.status(200).json(
      ApiResponse.success(
        { student: studentId, supervisor: supervisorId },
        'Student assigned to supervisor successfully'
      )
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(
      ApiResponse.success(users, 'Users retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Create admin user
// @route   POST /api/admin/create-admin
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(
        ApiResponse.error('User already exists')
      );
    }

    const admin = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await admin.save();

    res.status(201).json(
      ApiResponse.success(
        { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
        'Admin created successfully'
      )
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get all projects with filters
// @route   GET /api/admin/projects
export const getAllProjects = async (req, res, next) => {
  try {
    const { status, studentId, supervisorId } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    if (supervisorId) query.supervisorId = supervisorId;

    const projects = await Project.find(query)
      .populate('studentId', 'name email')
      .populate('supervisorId', 'name email');

    res.status(200).json(
      ApiResponse.success(projects, 'Projects retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Update project status (admin override)
// @route   PUT /api/admin/projects/:id/status
export const updateProjectStatus = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json(
        ApiResponse.error('Project not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(project, 'Project status updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Delete any user
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json(
        ApiResponse.error('User not found')
      );
    }

    // Delete associated projects if needed
    if (user.role === 'student') {
      await Project.deleteMany({ studentId: user._id });
    } else if (user.role === 'supervisor') {
      await Project.deleteMany({ supervisorId: user._id });
    }

    res.status(200).json(
      ApiResponse.success(null, 'User deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get statistics
// @route   GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [students, supervisors, projects, pendingProjects, approvedProjects] = await Promise.all([
      Student.countDocuments(),
      Supervisor.countDocuments(),
      Project.countDocuments(),
      Project.countDocuments({ status: 'pending' }),
      Project.countDocuments({ status: 'approved' })
    ]);

    res.status(200).json(
      ApiResponse.success({
        students,
        supervisors,
        projects,
        pendingProjects,
        approvedProjects,
        rejectedProjects: projects - pendingProjects - approvedProjects
      }, 'Statistics retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};