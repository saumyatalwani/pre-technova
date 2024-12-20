const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    userDetail: {
        type: Boolean,
        default: false,
        required: true
    },

    // User details
    name:{
        type: String,
        required: true
    },

    // age [enum: 0, 1, 2, 3, 4]
    // sex [enum: 0, 1, 2]
    // experience [enum: 0, 1, 2, 3, 4, 5, 6]
    // type of vehicle [enum: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12, 13, 14, 15, 16]

    age:{
        type: Number,
        required: true
    },

    sex:{
        type: Number,
        required: true
    },

    experience:{
        type: Number,
        required: true
    },

    vehicle:{
        type: Number,
        required: true
    },
    
    verified:{
        type: Boolean,
        default: false,
        required: true
    },
    verificationToken:{
        type: String,
        required: true
    },
    resetToken:{
        type: String
    },
});

module.exports = mongoose.model('User', userSchema);