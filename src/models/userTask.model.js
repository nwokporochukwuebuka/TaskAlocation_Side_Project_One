const validator = require('validator');

module.exports = (sequelize, dataType) => {
    const UserTask = sequelize.define('UserTask', {
        userStatus: {
            type: dataType.ENUM('0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'),
            defaultValue: '0%'
        },
    });
    return UserTask;
}