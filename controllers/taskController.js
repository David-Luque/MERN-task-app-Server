const Task = require('../models/Tasks');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

//create task
exports.createTask = async (req, res)=>{ 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }

    try {
        const { project } = req.body;

        //check if project exist
        const projectFromDB = await Project.findById(project);
        if(!projectFromDB) {
            return res.status(404).json({ msg: 'Project not found' })
        }
        //verify project owner 
        if(projectFromDB.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' })
        }
        //create task
        const task = new Task(req.body);
        await task.save();
        res.json({ task });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};

// get all tasks
exports.getTasks = async (req, res)=>{
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

//update task
exports.updateTask = async (req, res)=>{
    try {
        const { project, name, isCompleted } = req.body;

        //check if task exist
        const taskInDB = await Task.findById(req.params.id);
        if(!taskInDB) {
            return res.status(404).json({ msg: 'Task not found' })
        }

        //extract project
        const projectInDB = await Project.findById(project);
        
        //verify project owner 
        if(projectInDB.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' })
        }
        
        //create new task with new info
        const newTask = {};
        newTask.name = name;
        newTask.isCompleted = isCompleted;
        //save task
        const task = await Task.findOneAndUpdate({_id: req.params.id}, newTask, { new: true });
        res.json({ task });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};

//delete task
exports.deleteTask = async (req, res)=>{
    try {
        const { project } = req.query;

        //check if task exist
        const taskInDB = await Task.findById(req.params.id);
        if(!taskInDB) {
            return res.status(404).json({ msg: 'Task not found' })
        }

        //extract project
        const projectInDB = await Project.findById(project);
        
        //verify project owner 
        if(projectInDB.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' })
        }
        
        //delete
        await Task.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Task deleted' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};