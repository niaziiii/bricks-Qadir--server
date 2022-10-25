const express = require('express')
const authController = require('./../controller/authController')


const adminRouter = express.Router()

adminRouter.post('/signup', authController.signup);
adminRouter.post('/login', authController.login);
adminRouter.get('/logout', authController.logout)

module.exports = adminRouter;