//const mongoose = require('mongoose');
import mongoose from  'mongoose';

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    deadlineDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now()
    // }
}, {
    timestamps: true
});

//module.exports = mongoose.model('Task', taskSchema);
const Task = mongoose.model('Task', taskSchema);
export default Task;

