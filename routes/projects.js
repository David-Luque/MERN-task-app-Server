const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//CREATE NEW PROJECT
router.post('/',
    auth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    projectController.createProject
);

//GET ALL PROJECT
router.get('/',
    auth,
    projectController.getProjects
);

//EDIT PROJECT
router.put("/:id",
    auth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    projectController.updatedProject
);

//DELETE PROJECT
router.delete('/:id',
    auth,
    projectController.deleteProject
);

module.exports = router;