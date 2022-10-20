const express = require('express');
const userController = require('./../controller/userController')
const userRouter = express.Router()

userRouter.route('/')
.get(userController.getUsers)
.post(userController.createUser)

userRouter
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
module.exports = {
    user: userRouter
};