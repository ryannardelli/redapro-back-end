const userService = require("../services/userService");

async function findAll(req, res, next) {
    try {
        const users = await userService.getAllUsers();
        return res.status(201).json(users);
    } catch(err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch(err) {
        next(err);
    }
}

module.exports = { findAll, findById};