const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user name required']
    },
    address: {
        type: String,
        required: [true, 'user address required']
    },
    number: {
        type: String,
        required: [true, 'user number required']
    },
    amount: {
        type: Number,
        required: [true, 'user amount required']
    },
    bricks: {
        type: Number,
        required: [true, 'user bricks required']
    },
    userStatus: {
        type: Array
    },
    active : {
        type:Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });




const Users = mongoose.model('users', userSchema);

module.exports = Users;