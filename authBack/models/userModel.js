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

    // User details
    name:{
        type: String,
        required: true
    },

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