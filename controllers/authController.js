import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Supervisor from "../models/Supervisor.js";
import config from "../config/config.js";
import ApiResponse from "../utils/apiResponse.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  const { name, email, password, role, ...rest } = req.body;

  try {
    let user;
    // Update the register function to handle admin registration
    if (role === "admin") {
      return res
        .status(403)
        .json(
          ApiResponse.error(
            "Admin accounts can only be created by existing admins"
          )
        );
    }
    if (role === "student") {
      user = new Student({
        name,
        email,
        password,
        ...rest,
      });
    } else if (role === "supervisor") {
      user = new Supervisor({
        name,
        email,
        password,
        ...rest,
      });
    } else {
      return res.status(400).json(ApiResponse.error("Invalid role specified"));
    }

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json(
      ApiResponse.success(
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        "Registration successful"
      )
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  const { email, password, userType } = req.body;

  try {
    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user || user.role !== userType) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"));
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json(
      ApiResponse.success(
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        "Login successful"
      )
    );
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found"));
    }

    res
      .status(200)
      .json(ApiResponse.success(user, "User retrieved successfully"));
  } catch (err) {
    next(err);
  }
};
