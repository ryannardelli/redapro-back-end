const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");
const User = require("../../models/User");

async function getAllUsers() {
    const users = await User.findAll();
    return users;
}

async function getUserById(id) {
    const user = await User.findByPk(id);
    if(!user) throw new UserNotFoundError();
    
    return user;
}


module.exports = { getAllUsers, getUserById };