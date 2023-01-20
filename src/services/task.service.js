const httpStatus = require('http-status');
const userService = require('./user.service');
const { db } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');


// checke if task name have been chosen 
const isNameTaken = async (name) => {
    const task = await db.tasks.findOne({
        where: { name }
    });
    return !!task;
}

const getTaskById = async (taskId) => {
    return await db.tasks.findByPk(taskId);
}

/**
 * 
 * @param {Object} taskBody 
 * @returns {Promise<Task>}
 */
const createNewTask = async (taskBody) => {
    if (await isNameTaken(taskBody.name)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Name of task already taken")
    }
    // date must be greater than today's date 
    // check how the time string format can be compared to the string that was provided in the input

    // further validations 
    const today = new Date().getDate();
    const startDate = new Date(taskBody.startDate).getDate();
    const endDate = new Date(taskBody.endDate).getDate();
    if (startDate < today) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Choose a valid date')
    }

    if (startDate > endDate) {
        throw new ApiError(httpStatus.BAD_REQUEST, "End date cannot be before start date");
    }
    return db.tasks.create(taskBody);
};

const assignTaskToSingleUser = async (userId, taskId) => {
    // ckeck for the user
    const user = await userService.getUserById(userId);

    // throw error if user does not exist 
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User does not exits");
    }

    // checking if the task has been created if it is done
    const task = await getTaskById(taskId);

    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Task does not exist");
    }

    // check if the task has been assigned previously
    const assignedTask = await db.UserTask.findOne({
        where: {
            taskId: taskId,
            userId: userId
        }
    });

    if (assignedTask) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This task has been assigned previously");
    }

    // update the status of the task to "assigned"
    await updateTask(taskId, { "taskStatus": "assigned",  "numberofPeopleAssigned": task.dataValues.numberofPeopleAssigned + 1})
    // then assign the task
    return await user.addTask(taskId);
}

const getAllTask = async () => {
    return await db.tasks.findAll({
        include: [{
            model: db.users
        }]
    });
}

const userGetAllTask = async (userId) => {
    const user = await userService.getUserById(userId);
    return await user.getTasks({
        attributes: ["id", "name", "description", "startDate", "endDate", "startTime", "endTime"]
    })
}

const updateTask = async (taskId, taskBody) => {
    const task = await getTaskById(taskId);

    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    }

    if (taskBody.name && (await isNameTaken(taskBody.name))) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Name of task taken already");
    }
    Object.assign(task, taskBody);
    await db.tasks.update(task.dataValues, {
        where: {
            id: taskId,
        }
    });

    return await getTaskById(taskId);
}

// user update task
const userUpdateTask = async (taskId, taskBody, userId) => {
    const task = await getTaskById(taskId);

    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    }

    if (taskBody.name && (await isNameTaken(taskBody.name))) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Name has been choosen already");
    }
    
   await db.UserTask.update(taskBody, {
    where: {
        taskId: taskId,
        userId: userId
    }
   })
   return await db.UserTask.findOne({
    where: {
        taskId: taskId,
        userId: userId
    }
   });
}

// unassign task
const deleteTaskAssignment = async (taskId, userId) => {

    // first check if the user existed previosly and the task
    const user = await userService.getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'This user does not exist');
    }

    const task = await getTaskById(taskId);
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This task does not exist");
    }

    // set the task back to unassigned
    await updateTask(taskId, { "taskStatus": "unassigned" })
    // get the join table and destroy the row
    return db.UserTask.destroy({
        where: {
            userId,
            taskId
        }
    });
};


const deleteTask = async (taskId) => {
    // first: check if the task exist in the database, 
    // second: we delete all instance from the usertask table
    // third: we delete from the task table itelf

    const task = await getTaskById(taskId)

    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Task does not exist in the database");
    }

    // deleting from the user task table
    await db.UserTask.destroy({
        where: {
            taskId: taskId
        }
    });
    // delete from the task table
    await db.tasks.destroy({
        where: {
            id: taskId
        }
    });
    return;
}

module.exports = {
    createNewTask,
    assignTaskToSingleUser,
    getAllTask,
    getTaskById,
    updateTask,
    deleteTaskAssignment,
    deleteTask,
    userUpdateTask,
    userGetAllTask,
}