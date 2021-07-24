const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res)=>{
    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        //create new project
        const project = new Project(req.body);

        //save owner by JWT
        project.owner = req.user.id

        await project.save();

        res.json(project)

    } catch(error) {
        console.log(error);
        res.status(500).send("there wan an error" );
    }
    
};


//obtain all project from current user
exports.getProjects = async (req, res)=>{
    try {
        const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 })
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error')
    }
};


//update project
exports.updatedProject = async (req, res)=>{
    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    //extract project info
    const { name } = req.body;
    const newProject = {};
    if(name) {
        newProject.name = name;
    }

    try {
        //check project ID
        let project = await Project.findById(req.params.id)
        
        //check if project exist
        if(!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        //verify project owner 
        if(project.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' })
        }

        //update
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true })
        res.json({ project });

    } catch (error) {
        console.log(error)
        res.status(500).send('There was an error on server')
    }
};

//delete project
exports.deleteProject = async (req, res)=>{
    try {
        //check project ID
        let project = await Project.findById(req.params.id)
        
        //check if project exist
        if(!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        //verify project owner 
        if(project.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' })
        }

        //delete the project
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Project deleted' });

    } catch (error) {
        console.log(error)
        res.status(500).send('There was an error on server')
    }
};