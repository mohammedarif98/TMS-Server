// import globalErrorHandler from "../middlewares/errorHandler";


function HttpError(message, statusCode) {
    const error = new Error(message);  // Create an error object with the message
    error.statusCode = statusCode;
    error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    error.isOperational = true;

    Error.captureStackTrace(error, HttpError);
    return error;  
}
  

  export default HttpError;