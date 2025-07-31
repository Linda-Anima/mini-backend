import Project from '../models/Project.js';
import Student from '../models/Student.js';
import Supervisor from '../models/Supervisor.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const { title, description, proposal } = req.body;
    const studentId = req.user.id;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json(
        ApiResponse.error('Student not found')
      );
    }

    // Check if supervisor exists
    const supervisor = await Supervisor.findById(req.body.supervisorId);
    if (!supervisor) {
      return res.status(404).json(
        ApiResponse.error('Supervisor not found')
      );
    }

    const project = new Project({
      title,
      description,
      proposal,
      studentId,
      supervisorId: req.body.supervisorId
    });

    await project.save();

    res.status(201).json(
      ApiResponse.success(project, 'Project created successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
export const getProjects = async (req, res, next) => {
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

// @desc    Get project by ID
// @route   GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('supervisorId', 'name email');

    if (!project) {
      return res.status(404).json(
        ApiResponse.error('Project not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(project, 'Project retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(
        ApiResponse.error('Project not found')
      );
    }

    // Check if the user is the student or supervisor associated with the project
if (project.studentId.toString() !== req.user.id && 
    project.supervisorId.toString() !== req.user.id &&
    req.user.role !== 'admin') {
  return res.status(403).json(
    ApiResponse.error('Not authorized to update this project')
  );
}

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(
      ApiResponse.success(updatedProject, 'Project updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(
        ApiResponse.error('Project not found')
      );
    }

    // Only the student who created the project can delete it
    if (project.studentId.toString() !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to delete this project')
      );
    }

    await project.remove();

    res.status(200).json(
      ApiResponse.success(null, 'Project deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Review project (for supervisors)
// @route   PUT /api/projects/:id/review
export const reviewProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(
        ApiResponse.error('Project not found')
      );
    }

    // Check if the user is the supervisor associated with the project
    if (project.supervisorId.toString() !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to review this project')
      );
    }

    const { status, dueDate, feedback } = req.body;

    project.status = status;
    if (dueDate) project.dueDate = dueDate;
    if (feedback) project.feedback = feedback;

    await project.save();

    res.status(200).json(
      ApiResponse.success(project, 'Project reviewed successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Upload project documentation
// @route   PUT /api/projects/:id/documentation
export const uploadDocumentation = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(
        ApiResponse.error('Project not found')
      );
    }

    // Check if the user is the student associated with the project
    if (project.studentId.toString() !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to update documentation for this project')
      );
    }

    project.documentation = req.body.documentation;
    await project.save();

    res.status(200).json(
      ApiResponse.success(project, 'Documentation updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get my projects (for students)
// @route   GET /api/students/me/projects
export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ studentId: req.user.id })
      .populate('supervisorId', 'name email');

    res.status(200).json(
      ApiResponse.success(projects, 'Projects retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get supervised projects (for supervisors)
// @route   GET /api/supervisors/me/projects
export const getSupervisedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ supervisorId: req.user.id })
      .populate('studentId', 'name email');

    res.status(200).json(
      ApiResponse.success(projects, 'Projects retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};