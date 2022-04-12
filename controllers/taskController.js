// const Task = require('../models/Tasks');
import Task from '../models/Tasks.js'
// const Project = require('../models/Project');
import Project from '../models/Project.js';
// const { validationResult } = require('express-validator');
import { validationResult } from 'express-validator';

//create task
const createTask = async (req, res)=>{ 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }
  
    const { project } = req.body;

    //check if project exist
    const projectFromDB = await Project.findById(project);
    if(!projectFromDB) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message })
    }
    //verify project owner
    if(projectFromDB.owner.toString() !== req.user._id.toString()) {
        const error = new Error('Unauthorized')
        return res.status(403).json({ msg: error.message })
    }
    
    try {
        //create task
        // const task = new Task(req.body);
        // await task.save();
        const savedTask = Task.create(req.body);
        res.json(savedTask);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};

// get all tasks
const getTasks = async (req, res)=>{
    try {
        const { project } = req.query; //because we sent "{params: { project }}"

        //check if project exist
        const projectFromDB = await Project.findById(project);
        if(!projectFromDB) {
            return res.status(404).json({ msg: 'Project not found' })
        }
        //verify project owner 
        if(projectFromDB.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' })
        }

        //get tasks by project
        const tasks = await Task.find({ project }).sort({ createdAt: -1 });
        res.json({ tasks });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};

//get one task
const getOneTask = async (req, res)=>{
    const { id } = req.params;

    const task = await Task.findById(id).populate("project");
    if(!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message })
    }; 

    const owner = task.project.owner;

    if(owner.toString() !== req.user._id.toString()) {
        const error = new Error('Action not valid');
        return res.status(403).json({ msg: error.message })
    };

    res.json(task);
};

//update task
const updateTask = async (req, res)=>{
    
    // const { project, name, isCompleted } = req.body;
    
    // try {
    //     //check if task exist
    //     const taskInDB = await Task.findById(req.params.id);
    //     if(!taskInDB) {
    //         return res.status(404).json({ msg: 'Task not found' })
    //     }

    //     //extract project
    //     const projectInDB = await Project.findById(project);
        
    //     //verify project owner 
    //     if(projectInDB.owner.toString() !== req.user.id) {
    //         return res.status(401).json({ msg: 'Unauthorized' })
    //     }
        
    //     //create new task with new info
    //     const newTask = {};
    //     if(name) newTask.name = name;
    //     if(isCompleted) newTask.isCompleted = isCompleted;
        
    //     //save task
    //     const task = await Task.findOneAndUpdate({_id: req.params.id}, newTask, { new: true });
    //     res.json({ task });

    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send('Server error');
    // }

    const { id } = req.params;

    const task = await Task.findById(id).populate("project");
    if(!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message })
    }; 

    const owner = task.project.owner;

    if(owner.toString() !== req.user._id.toString()) {
        const error = new Error('Action not valid');
        return res.status(403).json({ msg: error.message })
    };

    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.deadlineDate = req.body.deadlineDate || task.deadlineDate;
    task.priority = req.body.priority || task.priority;
  
    try {
        const updatedTask = await task.save();
        res.json(updatedTask)
    } catch(error) {
        console.log(error);
    }
};

//delete task
const deleteTask = async (req, res)=>{
    
    // const { project } = req.query;

    // try {
    //     //get task from DB
    //     const taskInDB = await Task.findById(req.params.id);
    //     //check if task exist
    //     if(!taskInDB) {
    //         return res.status(404).json({ msg: 'Task not found' })
    //     }

    //     //extract project
    //     const projectInDB = await Project.findById(project);
    //     //verify project owner 
    //     if(projectInDB.owner.toString() !== req.user.id) {
    //         return res.status(401).json({ msg: 'Unauthorized' })
    //     }
        
    //     //delete
    //     await Task.findOneAndRemove({ _id: req.params.id });
    //     res.json({ msg: 'Task deleted' });

    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send('Server error');
    // }

    const { id } = req.params;

    const task = await Task.findById(id).populate("project");
    if(!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message })
    }; 

    const owner = task.project.owner;

    if(owner.toString() !== req.user._id.toString()) {
        const error = new Error('Action not valid');
        return res.status(403).json({ msg: error.message })
    };

    try {
        task.deleteOne();
        res.json({ msg: "Task deleted" });
    } catch(error) {
        console.log(error);
    }

};

const changeStatus = async (req, res)=>{

};


export {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    changeStatus,
    getOneTask
};