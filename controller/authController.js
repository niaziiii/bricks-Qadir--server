const AppError = require('./../utilties/appError')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const Admin = require('../model/userLogibmodel')


const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}


const TokenGenerate = id => {
    return jwt.sign({ id: id }, process.env.JWTSECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
};

const createSendTokenCookie = (user, statusCode, res) => {
    const token = TokenGenerate(user._id);


    const cookieOptions = {
        expire: new Date(Date.now() + process.env.JWT_Cookie_EXPIRE_IN * 24 * 30 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE.ENV === "production") cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)

    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    })

    res.status(200).json({
        status: 'success'
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const admin = await Admin.create(req.body);
    createSendTokenCookie(admin, 201, res)
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || !email) return next(new AppError('Provided email & password incorrect', 401));

    const admin = await Admin.findOne({ email }).select('+password')
    if (!admin) return next(new AppError('incorrect email & password', 401));

    const correct = await admin.correctPassword(password, admin.password);

    if (!admin || !correct) return next(new AppError('incorrect email & password', 401));

    createSendTokenCookie(admin, 200, res)

})



exports.protect = catchAsync(async (req, res, next) => {
    //  1). getting token and check it
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) { token = req.headers.authorization.split(' ')[1]; }
    else if (req.cookies.jwt) { token = req.cookies.jwt }
    else if (req.headers.jwt) { token = req.headers.jwt }



    if (!token) return next(new AppError('Your are not logged in! Please login to get access', 401));


    // 2). Verification token like user id 
    const decoded = await promisify(jwt.verify)(token, process.env.JWTSECRET)


    // 3). Check if there user stil exit || deleted himself
    const freshAdmin = await Admin.findOne({ _id: decoded.id })

    if (!freshAdmin) {
        return next(new AppError('The user is not belong to this token! Please login to get access', 401));
    }


    req.user = freshAdmin;
    res.locals.user = freshAdmin;

    next();
});



exports.sendResponse = catchAsync(async (req, res, next) => {
    // console.log(req.user);
    res.status(200).json({
        data: {
            status: 'success'
        }
    })
})


exports.restrictTo = (...roles) => {
    // roles are : lead-guide , admin
    return (req, _, next) => {
        if (!roles.includes(req.user.role)) return next(new AppError('Your have no authorization to performe this 🔥🔥', 401));
        next()
    }
}

