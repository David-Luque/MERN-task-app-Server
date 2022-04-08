//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        irRequired: true,
        trim: true
    },
    description: {
        type: String,
        irRequired: true,
        trim: true
    },
    deadlineDate : {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    partners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});

//module.exports = mongoose.model('Project', projectSchema);
const Project = mongoose.model('Project', projectSchema);
export default Project;