const userService = require("../services/userService");

async function findAll(req, res, next) {
    try {
        const users = await userService.getAllUsers();
        return res.status(201).json(users);
    } catch(err) {
        next(err);
    }
}

module.exports = { findAll };