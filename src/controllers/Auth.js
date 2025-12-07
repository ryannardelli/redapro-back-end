const User = require("../models/User");

const authService = require("../services/authService");

async function create(req, res, next) {
  try {
    await authService.createUser(req.body);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    
  } catch(e) {

  }
}

module.exports = { create }
