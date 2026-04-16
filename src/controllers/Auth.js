const authService = require("../services/authService");

async function create(req, res, next) {
  try {
    const result = await authService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.status(200).json(result);
  } catch(e) {
    next(e);
  }
}

module.exports = { create, login }
