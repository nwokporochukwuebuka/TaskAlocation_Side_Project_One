const allRoles = {
  user: [],
  admin: ['taskManager', 'getUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};