# USPT Backend API Documentation

A comprehensive backend API for a University Student Project Tracking (USPT) system that manages students, supervisors, and projects with role-based access control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Projects](#projects)
  - [Students](#students)
  - [Supervisors](#supervisors)
  - [Admin](#admin)
- [Data Models](#data-models)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

## Overview

The USPT Backend is a RESTful API built with Node.js, Express, and MongoDB that provides comprehensive project management functionality for university students and supervisors. The system supports three user roles: students, supervisors, and administrators, each with specific permissions and capabilities.

## Features

- **Role-based Access Control**: Secure authentication and authorization for students, supervisors, and admins
- **Project Management**: Create, update, review, and track project progress
- **User Management**: Comprehensive user profile management
- **Documentation Upload**: Support for project documentation uploads
- **Project Review System**: Supervisor review and feedback system
- **Admin Dashboard**: Administrative functions for system management
- **RESTful API**: Clean, consistent API design
- **Error Handling**: Comprehensive error handling and logging
- **Security**: JWT-based authentication with password hashing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Logging**: Winston
- **HTTP Logging**: Morgan
- **CORS**: Cross-Origin Resource Sharing enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/uspt
   JWT_SECRET=your-secret-key-here
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (development/production) | `development` |
| `PORT` | Server port number | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/uspt` |
| `JWT_SECRET` | Secret key for JWT token generation | `your-secret-key` |

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register User
- **POST** `/auth/register`
- **Description**: Register a new user (student, supervisor, or admin)
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "contact": "1234567890",
    "department": "Computer Science",
    "bio": "Student bio",
    "picture": "https://example.com/profile.jpg"
  }
  ```
- **Response**: User object with JWT token

#### Login User
- **POST** `/auth/login`
- **Description**: Authenticate user and return JWT token
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with JWT token

#### Get Current User
- **GET** `/auth/me`
- **Description**: Get current authenticated user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user object

### Projects

#### Get All Projects
- **GET** `/projects`
- **Description**: Get all projects (filtered by user role)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status`: Filter by project status (pending/approved/rejected)
  - `page`: Page number for pagination
  - `limit`: Number of items per page

#### Create Project
- **POST** `/projects`
- **Description**: Create a new project (students only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Project Title",
    "description": "Project description",
    "proposal": "Project proposal content",
    "supervisorId": "supervisor_id_here",
    "dueDate": "2024-12-31"
  }
  ```

#### Get Project by ID
- **GET** `/projects/:id`
- **Description**: Get specific project details
- **Headers**: `Authorization: Bearer <token>`

#### Update Project
- **PUT** `/projects/:id`
- **Description**: Update project details
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Updated project fields

#### Delete Project
- **DELETE** `/projects/:id`
- **Description**: Delete a project (students only)
- **Headers**: `Authorization: Bearer <token>`

#### Review Project
- **PUT** `/projects/:id/review`
- **Description**: Review project (supervisors only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "status": "approved",
    "feedback": "Great work! Approved."
  }
  ```

#### Upload Documentation
- **PUT** `/projects/:id/documentation`
- **Description**: Upload project documentation (students only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "documentation": "Documentation content or file URL"
  }
  ```

#### Get My Projects (Student)
- **GET** `/projects/students/me/projects`
- **Description**: Get projects created by current student
- **Headers**: `Authorization: Bearer <token>`

#### Get Supervised Projects (Supervisor)
- **GET** `/projects/supervisors/me/projects`
- **Description**: Get projects supervised by current supervisor
- **Headers**: `Authorization: Bearer <token>`

### Students

#### Get All Students
- **GET** `/students`
- **Description**: Get all students (supervisors and admins only)
- **Headers**: `Authorization: Bearer <token>`

#### Get Student by ID
- **GET** `/students/:id`
- **Description**: Get specific student details
- **Headers**: `Authorization: Bearer <token>`

#### Update Student
- **PUT** `/students/:id`
- **Description**: Update student profile (students only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Updated student fields

#### Delete Student
- **DELETE** `/students/:id`
- **Description**: Delete student account (students only)
- **Headers**: `Authorization: Bearer <token>`

### Supervisors

#### Get All Supervisors
- **GET** `/supervisors`
- **Description**: Get all supervisors
- **Headers**: `Authorization: Bearer <token>`

#### Get Supervisor by ID
- **GET** `/supervisors/:id`
- **Description**: Get specific supervisor details
- **Headers**: `Authorization: Bearer <token>`

#### Update Supervisor
- **PUT** `/supervisors/:id`
- **Description**: Update supervisor profile (supervisors only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Updated supervisor fields

#### Delete Supervisor
- **DELETE** `/supervisors/:id`
- **Description**: Delete supervisor account (supervisors only)
- **Headers**: `Authorization: Bearer <token>`

### Admin

All admin endpoints require admin role authentication.

#### Assign Student to Supervisor
- **POST** `/admin/assign-student`
- **Description**: Assign a student to a supervisor
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "studentId": "student_id_here",
    "supervisorId": "supervisor_id_here"
  }
  ```

#### Get All Users
- **GET** `/admin/users`
- **Description**: Get all users in the system
- **Headers**: `Authorization: Bearer <token>`

#### Create Admin
- **POST** `/admin/create-admin`
- **Description**: Create a new admin user
- **Headers**: `Authorization: Bearer <token>`
- **Body**: User registration data with admin role

#### Get All Projects
- **GET** `/admin/projects`
- **Description**: Get all projects in the system
- **Headers**: `Authorization: Bearer <token>`

#### Update Project Status
- **PUT** `/admin/projects/:id/status`
- **Description**: Update project status
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "status": "approved"
  }
  ```

#### Delete User
- **DELETE** `/admin/users/:id`
- **Description**: Delete a user from the system
- **Headers**: `Authorization: Bearer <token>`

#### Get Statistics
- **GET** `/admin/stats`
- **Description**: Get system statistics
- **Headers**: `Authorization: Bearer <token>`

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  contact: String (optional),
  department: String (optional),
  bio: String (optional),
  picture: String (optional),
  password: String (required),
  role: String (enum: ['student', 'supervisor', 'admin']),
  timestamps: true
}
```

### Project Model
```javascript
{
  title: String (required),
  description: String (required),
  studentId: ObjectId (ref: 'Student'),
  supervisorId: ObjectId (ref: 'Supervisor'),
  proposal: String (required),
  status: String (enum: ['pending', 'approved', 'rejected']),
  documentation: String (optional),
  dueDate: Date (optional),
  feedback: String (optional),
  timestamps: true
}
```

## Authentication & Authorization

### JWT Token
- All protected routes require a valid JWT token in the Authorization header
- Format: `Authorization: Bearer <token>`
- Token expiration: 30 days

### Role-based Access Control
- **Students**: Can create, update, and delete their own projects
- **Supervisors**: Can review projects and manage their supervised students
- **Admins**: Have full system access and can manage all users and projects

### Password Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- Password minimum length: 8 characters

## Error Handling

The API uses a centralized error handling system with the following error types:

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Invalid or missing authentication token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server-side errors

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack trace (development only)"
}
```

## Usage Examples

### Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "department": "Computer Science"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "AI Chatbot Development",
    "description": "Building an intelligent chatbot using machine learning",
    "proposal": "Detailed project proposal...",
    "supervisorId": "supervisor_id_here",
    "dueDate": "2024-12-31"
  }'
```

### Review a Project
```bash
curl -X PUT http://localhost:5000/api/projects/project_id/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "status": "approved",
    "feedback": "Excellent work! The proposal is well-structured and feasible."
  }'
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production Mode
```bash
npm start
```

### Project Structure
```
mini-backend/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── config/
│   ├── config.js         # Configuration settings
│   └── db.js            # Database connection
├── controllers/          # Route controllers
├── middleware/           # Custom middleware
├── models/              # Database models
├── routes/              # API routes
└── utils/               # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 