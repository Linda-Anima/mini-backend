import Student from '../models/Student.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get all students
// @route   GET /api/students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(
      ApiResponse.success(students, 'Students retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');

    if (!student) {
      return res.status(404).json(
        ApiResponse.error('Student not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(student, 'Student retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
export const updateStudent = async (req, res, next) => {
  try {
    // Students can only update their own profile
if (req.params.id !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json(
    ApiResponse.error('Not authorized to update this student')
  );
}

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json(
        ApiResponse.error('Student not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(student, 'Student updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
export const deleteStudent = async (req, res, next) => {
  try {
    // Students can only delete their own account
    if (req.params.id !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to delete this student')
      );
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json(
        ApiResponse.error('Student not found')
      );
    }

    res.status(200).json(
      ApiResponse.success(null, 'Student deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};