const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { taskValidation } = require('../../validations');
const { taskController} = require('../../controllers/');

const router = express.Router();

router 
    .route('/')
    .post(auth('taskManager'), validate(taskValidation.createNewTask), taskController.createNewTask)
    .get(auth('taskManager'), taskController.getAllTask)

router
    .route('/all')
    .get(auth(), taskController.userGetAllTask)

router
    .route('/:userId/:taskId')
    // assign a task
    .post(auth('taskManager'), validate(taskValidation.assignTaskToSingleUser), taskController.assignTaskToSingleUser)
    // to unassign a task ---- to be contd
    .delete(auth('taskManager'), validate(taskValidation.unassignTask), taskController.unassignTask)
    
router
    .route('/:taskId')
    // admin updating a task
    .put(auth('taskManager'), validate(taskValidation.adminUpdateTask), taskController.updateTask)
    .delete(auth('taskManager'), validate(taskValidation.deleteTask), taskController.deleteTask)

router
    .route('/:taskId/status')
    // user updating the status of a task
    .put(auth(), validate(taskValidation.userUpdateTask), taskController.userUpdateTask)



module.exports = router;