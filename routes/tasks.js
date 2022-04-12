// const express = require('express');
import express from 'express';
const router = express.Router();
// const auth = require('../middleware/auth');
import checkAuth from '../middleware/checkAuth.js';
// const taskController = require('../controllers/taskController');
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    changeStatus,
    getOneTask
} from '../controllers/taskController.js'
// const { check } = require('express-validator');
import { check } from 'express-validator'; 

//create task
router.post('/',
    checkAuth,
    [
        check('name', 'Task name is required').not().isEmpty(),
        check('project', 'Task project is required').not().isEmpty()
    ], 
    createTask
)

//get all project tasks
router.get('/',
    checkAuth,
    getTasks
);

//edit task
// router.put('/:id',
//     checkAuth,
//     updateTask
// );

// //edit task
// router.delete('/:id',
//     checkAuth,
//     deleteTask
// );

router
    .route('/:id')
        .get(checkAuth, getOneTask)
        .put(checkAuth, updateTask)
        .delete(checkAuth, deleteTask);


router.post('status/:id', checkAuth, changeStatus);



//module.exports = router;
export default router;