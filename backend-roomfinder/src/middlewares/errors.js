export function errorHandler(err, req, res, next) {
    console.error(err); // Log the error

    const status = err.status || 500; // Set the status code
    const message = err.message || 'Something went wrong'; // Set the message

    // Send the response
    res.status(status).json({
        error: {
            message: message,
            status: status
        },
    });
}