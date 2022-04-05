//const mongoose = require('mongoose');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    // register: {
    //     type: Date,
    //     default: Date.now()
    // }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) {
        next();
    } 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
}) 

userSchema.methods.isCorrectPass = async function(formPassword) {
    return await bcrypt.compare(formPassword, this.password)
};



//module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;