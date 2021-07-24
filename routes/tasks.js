const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');
const { check } = require('express-validator');

//create task
router.post('/',
    auth,
    [
        check('name', 'Task name is required').not().isEmpty(),
        check('project', 'Task project is required').not().isEmpty()
    ], 
    taskController.createTask
)

//get all project tasks
router.get('/',
    auth,
    taskController.getTasks
);

//edit task
router.put('/:id',
    auth,
    taskController.updateTask
);

//edit task
router.delete('/:id',
    auth,
    taskController.deleteTask
);

module.exports = router;