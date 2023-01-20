const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, taskService } = require('../services');
const logger = require('../config/logger');

const createNewTask = catchAsync(async (req, res) => {
    const task = await taskService.createNewTask(req.body);
    res.status(httpStatus.CREATED).send(task);
});

const assignTaskToSingleUser = catchAsync(async (req, res) => {
    const task = taskService.assignTaskToSingleUser(req.params.userId, req.params.taskId);
    if (!task) {
        res.status(httpStatus.BAD_REQUEST, 'Task could not be assigned')
    }
    res.status(httpStatus.OK).json("Task assigned");
});

const getAllTask = catchAsync(async (req, res) => {
    const tasks = await taskService.getAllTask()
    if (!tasks){ 
        res.status(httpStatus.BAD_REQUEST, "No task has been created by the admin");
    }
    res.status(httpStatus.OK).json(tasks);
});

const userGetAllTask = catchAsync(async (req, res) => {
    const tasks = await taskService.userGetAllTask(req.userId)
    if (!tasks){ 
        res.status(httpStatus.BAD_REQUEST, "No task has been created by the admin");
    }
    res.status(httpStatus.OK).json(tasks);
});

const updateTask = catchAsync(async (req, res) => {
    const task = await taskService.updateTask(req.params.taskId, req.body);
    res.status(httpStatus.OK).json(task);
});

const userUpdateTask = catchAsync(async (req, res) => {
    const task = await taskService.userUpdateTask(req.params.taskId, req.body, req.userId);
    res.status(httpStatus.OK).json(task);
})

const unassignTask = catchAsync(async (req, res) => {
    await taskService.deleteTaskAssignment(req.params.taskId, req.params.userId);
    res.status(httpStatus.NO_CONTENT, "Task Unassigned Successfully").json();
});

const deleteTask = catchAsync(async (req, res) => {
    taskService.deleteTask(req.params.taskId);
    res.status(httpStatus.NO_CONTENT).json()
})

module.exports = {
    createNewTask,
    assignTaskToSingleUser,
    getAllTask,
    updateTask,
    unassignTask,
    deleteTask,
    userUpdateTask,
    userGetAllTask,
}