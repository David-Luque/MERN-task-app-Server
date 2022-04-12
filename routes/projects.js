//const express = require('express');
import express from 'express';
const router = express.Router();
//const projectController = require('../controllers/projectController');
import {
    createProject,
    getProjects,
    getSingleProject,
    updatedProject,
    deleteProject,
    addPartners,
    removePartners
} from '../controllers/projectController.js';
//const auth = require('../middleware/auth');
import checkAuth from '../middleware/checkAuth.js';
//const { check } = require('express-validator');
import { check } from 'express-validator';
import { getTasks } from '../controllers/taskController.js';

//CREATE NEW PROJECT
router.post('/',
    checkAuth,
    [
        check('name', 'Project name is required').not().isEmpty(),
        check('description', 'Project description is required').not().isEmpty(),
        //check('client', 'Project client is required').not().isEmpty()
    ],
    createProject
);

//GET ALL PROJECT
router.get('/',
    checkAuth,
    getProjects
);

router.route('/')
.get(
    checkAuth,
    getProjects
).post(
    checkAuth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    createProject   
)


//EDIT PROJECT
router.put("/:id",
    checkAuth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    updatedProject
);

//DELETE PROJECT
router.delete('/:id',
    checkAuth,
    deleteProject
);


router.route('/:id')
.get(checkAuth, getSingleProject)
.put(checkAuth, updatedProject)
.delete(checkAuth, deleteProject)

router.post('/add-partner/:id', checkAuth, addPartners);
router.post('/remove-partner/:id', checkAuth, removePartners);


//module.exports = router;
export default router;