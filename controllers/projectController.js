// const Project = require('../models/Project');
// const { validationResult } = require('express-validator');
import Project from '../models/Project.js';
import { validationResult } from 'express-validator';

const createProject = async (req, res)=>{
    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        //create new project
        const project = new Project(req.body);

        //save owner by JWT
        project.owner = req.user._id
        const savedProject = await project.save();
        res.json(savedProject)

    } catch(error) {
        console.log(error);
        res.status(500).send("there wan an error" );
    }
    
};

//obtain all project from current user
const getProjects = async (req, res)=>{
    try {
        //const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 })
        const projects = Project.find().where('owner').equals(req.user);
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error')
    }
};

const getSingleProject = async (req, res)=>{
    const { id } = req.params;

    const project = Project.findById(id);

    if(!project) {
        const error = new Error("Not found");
        return res.status(404).json({ msg: error.message });
    }

    if(project.owner.toString() !== req.user._id.toString()) {
        const error = new Error("Not valid");
        return res.status(401).json({ msg: error.message });
    };
};

//update project
const updatedProject = async (req, res)=>{
    // //check for errors
    // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    
    // //extract project info
    // const { name } = req.body;
    
    // const newProject = {};
    // if(name) newProject.name = name;

    // try {
    //     //check project ID
    //     let project = await Project.findById(req.params.id)
        
    //     //check if project exist
    //     if(!project) {
    //         return res.status(404).json({ msg: 'Project not found' });
    //     }

    //     //verify project owner 
    //     if(project.owner.toString() !== req.user.id) {
    //         return res.status(401).json({ msg: 'Unauthorized' })
    //     }

    //     //update
    //     project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true })
    //     res.json({ project });

    // } catch (error) {
    //     console.log(error)
    //     res.status(500).send('There was an error on server')
    // }

    const { id } = req.params;

    const project = Project.findById(id);

    if(!project) {
        const error = new Error("Not found");
        return res.status(404).json({ msg: error.message });
    }

    if(project.owner.toString() !== req.user._id.toString()) {
        const error = new Error("Not valid");
        return res.status(401).json({ msg: error.message });
    };

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deadlineDate = req.body.deadlineDate || project.deadlineDate;
    project.client = req.body.client || project.client;
    
    try {
        const savedProject = project.save();
        res.json(savedProject);

    } catch (error) {
        console.log(error)
    }
};

//delete project
const deleteProject = async (req, res)=>{
    // try {
    //     //check project ID
    //     let project = await Project.findById(req.params.id)
        
    //     //check if project exist
    //     if(!project) {
    //         return res.status(404).json({ msg: 'Project not found' });
    //     }

    //     //verify project owner 
    //     if(project.owner.toString() !== req.user.id) {
    //         return res.status(401).json({ msg: 'Unauthorized' })
    //     }

    //     //delete the project
    //     await Project.findOneAndRemove({ _id: req.params.id });
    //     res.json({ msg: 'Project deleted' });

    // } catch (error) {
    //     console.log(error)
    //     res.status(500).send('There was an error on server')
    // }

    const { id } = req.params;

    const project = Project.findById(id);

    if(!project) {
        const error = new Error("Not found");
        return res.status(404).json({ msg: error.message });
    }

    if(project.owner.toString() !== req.user._id.toString()) {
        const error = new Error("Not valid");
        return res.status(401).json({ msg: error.message });
    };

    try {
        await project.deleteOne();
        res.json({ msg: "Project deleted" });

    } catch (error) {
        console.log(error);
    }
};

const addPartners = async (req, res)=>{

};

const removePartners = async (req, res)=>{
    
};

//const getTasks = async (req, res)=>{};

export {
    createProject,
    getProjects,
    getSingleProject,
    updatedProject,
    deleteProject,
    addPartners,
    removePartners
};