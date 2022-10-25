const mongoose = require('mongoose');
var isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

const newUserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name isnt provided'],
    },
    email: {
        type: String,
        required: [true, 'Email isnt provided'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Email isnt provided Correctly']
    },
    password: {
        type: String,
        required: [true, 'Pasword isnt provided'],
        select: false,
        minlength: [5, 'Password must have more than 5 charcter'],
    }
});




newUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next()
})


newUserSchema.methods.correctPassword = async function (candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass)
}

const Admin = mongoose.model('admin', newUserSchema);
module.exports = Admin;