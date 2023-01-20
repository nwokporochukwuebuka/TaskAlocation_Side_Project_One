const Joi = require('joi');

const createNewTask = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required()
    })
}

const assignTaskToSingleUser = {
    params: Joi.object().keys({
        taskId: Joi.number().required(),
        userId: Joi.number().required()
    })
}

const unassignTask = {
    params: Joi.object().keys({
        taskId: Joi.number().required(),
        userId: Joi.number().required()
    })
}

const userUpdateTask = {
    params: Joi.object().keys({
        taskId: Joi.number().required()
    }),
    body: Joi.object().keys({
        userStatus: Joi.string()
    })
};

const adminUpdateTask = {
    params: Joi.object().keys({
        taskId: Joi.number().required()
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        status: Joi.string(),
        startDate: Joi.date(),
        startTime: Joi.string(),
        endDate: Joi.date(),
        endTime: Joi.string()
    })
};

const deleteTask = {
    params: Joi.object().keys({
        taskId: Joi.number().required()
    })
}

module.exports = {
    createNewTask,
    assignTaskToSingleUser,
    userUpdateTask,
    adminUpdateTask,
    unassignTask,
    deleteTask,
}