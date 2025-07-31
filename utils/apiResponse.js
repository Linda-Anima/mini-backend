class ApiResponse {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message, errors = null) {
    return {
      success: false,
      message,
      errors
    };
  }
}

export default ApiResponse;