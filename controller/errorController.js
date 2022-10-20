const AppError = require("./../utilties/appError")

const setCastError = err => new AppError(`the user isnt found with ID : / ${err.value} /`, 404)


const setValidatorError = err => {
    const msgs = Object.values(err.errors).map(el => el.message).join(',');
    return new AppError(`/ ${msgs}  /`, 404);
}
const setJwtError = err => new AppError(`${err.message}! Please login again`, 401)


const productionError = (err, req, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message ? err.message : err.Newmessage,
            statusCode: err.statusCode,
            isOperational: err.isOperational,
        })
    }
    return res.status(500).json({
        status: err.status,
    })
}


const developmentError = (err, req, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        status: err.status,
        statusCode: err.statusCode,
        isOperational: err.isOperational,
        error: err,
        stack: err.stack
    })

}




const globalErrorHandler = ((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        developmentError(err, req, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        // error.message = err.message

        if (err.name === 'MongoNetworkError') error.message = 'Mongo Not working';
        if (err.name === 'CastError') error = setCastError(error);

        if (err._message === 'Tour validation failed') error = setValidatorError(error);
        if (err._message === 'users validation failed') error = setValidatorError(error);

        if (err.name === 'JsonWebTokenError') error = setJwtError(error);
        if (err.name === 'TokenExpiredError') error = setJwtError(error);

        productionError(error, req, res)
    }

    next()
})

module.exports = globalErrorHandler;