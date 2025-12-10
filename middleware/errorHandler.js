const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Duplicate data detected';
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        statusCode = 400;
        message = 'Invalid JSON payload';
    }

    if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default errorHandler;