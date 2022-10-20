const AppError = require('../utilties/appError')
const Users = require('./../model/usersModel')

const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}

module.exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await Users.find()
    res.status(200).json({
        status: 'success',
        length: users.length,
        users
    })
})


module.exports.createUser = catchAsync(async (req, res, next) => {
    const obj = {
        name: req.body.name,
        address: req.body.address,
        number: req.body.number,
        amount: +req.body.amount,
        bricks: +req.body.bricks,
        userStatus: [
            {
                add: true,
                widthraw: false,
                bricks: req.body.bricks,
                amount: req.body.amount,
                date: Date.now()
            }
        ]
    }

    const user = await Users.create(obj);
    res.status(201).json({
        status: 'success',
        user
    })
})



module.exports.getUser = catchAsync(async (req, res, next) => {
    const user = await Users.findById(req.params.id)
    res.status(200).json({
        status: 'success',
        user
    })
})

module.exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await Users.findById(req.params.id)
    if (!user) return next(new AppError('The document isnt found with that id 🔥🔥', 404));
    if (user.active === false) return next(new AppError('Error, User contract is already ended! 🔥🔥', 404));
    if (req.body.add === true && req.body.widthraw === true) return next(new AppError('Error, Please contact service provider 🔥🔥', 404));
    if (req.body.add === false && req.body.widthraw === false) return next(new AppError('Error, Please contact service provider 🔥🔥', 404));



    let updatedUser;

    // user contract ending
    if (req.body.active === false) {
        updatedUser = await Users.findByIdAndUpdate(user.id, { active: false }, {
            new: true,
            runValidators: true
        })
    }


    // user adding more bricks && amount
    if (req.body.add === true && req.body.widthraw === false) {
        const obj = {
            name: user.name,
            number: user.number,
            amount: user.amount + (+req.body.amount),
            bricks: user.bricks + (+req.body.bricks),
            userStatus: [
                ...user.userStatus,
                {
                    add: true,
                    widthraw: false,
                    bricks: req.body.bricks,
                    amount: req.body.amount,
                    date: Date.now()
                }
            ]
        }
        updatedUser = await Users.findByIdAndUpdate(user.id, obj, {
            new: true,
            runValidators: true
        })
    }


    // user dedcated bricks && amount
    if (req.body.add === false && req.body.widthraw === true) {
        const obj = {
            name: user.name,
            number: user.number,
            amount: user.amount - (+req.body.amount),
            bricks: user.bricks - (+req.body.bricks),
            userStatus: [
                ...user.userStatus,
                {
                    add: false,
                    widthraw: true,
                    bricks: req.body.bricks,
                    amount: req.body.amount,
                    date: Date.now()
                }
            ]
        }
        updatedUser = await Users.findByIdAndUpdate(user.id, obj, {
            new: true,
            runValidators: true
        })
    }



    res.status(200).json({
        status: 'success',
        updatedUser
    })
})

