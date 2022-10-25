const express = require('express');
const userController = require('./../controller/userController')
const authController = require('./../controller/authController')

const userRouter = express.Router()



userRouter.route('/')
.get(authController.protect,userController.getUsers)
.post(authController.protect,userController.createUser)

userRouter
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
module.exports = {
    user: userRouter
};