const express = require('express');
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors')
const globalErrorHandler = require('./controller/errorController')
const AppError = require('./utilties/appError');

const userRouter = require('./routes/usersRouter');
const adminRouter = require('./routes/adminRouter');

const app = express();

//Access req.body || parse cookies from front-end & set limit of data to 10kb 
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xss())
app.use(compression())
app.use(cors())



app.use('/api/v1', userRouter.user)
app.use('/api/v1/admin', adminRouter)



app.all('*', (req, res, next) => {
    next(new AppError(`Error :: cant find router -> ${req.originalUrl} <-`, 404))
})
// global middleWare error handler for operational errors
app.use(globalErrorHandler)

module.exports = app; 
