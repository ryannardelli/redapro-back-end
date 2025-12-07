const User = require("../../models/User");

async function getAllUsers() {
    const users = await User.findAll();
    return users;
}

module.exports = { getAllUsers };