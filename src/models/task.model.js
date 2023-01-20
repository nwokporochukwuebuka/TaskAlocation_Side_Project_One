const validator = require('validator');

module.exports = (sequelize, dataType) => {
    const task = sequelize.define('task', {
        name: {
            type: dataType.STRING,
            allowNull: true,
            unique: false,
        },
        
        description: {
            type: dataType.TEXT,
            allowNull: false
        },

        taskStatus: {
            type: dataType.ENUM('unassigned', 'assigned'),
            defaultValue: "unassigned"
        },

        numberofPeopleAssigned: {
            type: dataType.INTEGER,
            defaultValue: 0
        },
        
        startDate: {
            type: dataType.DATE,
            allowNull: false
        },
        startTime: {
            type: dataType.TIME
        },
        endDate: {
            type: dataType.DATE,
            allowNull: false
        },
        endTime: {
            type: dataType.TIME,
            allowNull: false
        }
    });
    return task;
};