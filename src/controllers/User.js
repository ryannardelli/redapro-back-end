const User = require("../models/User");

const userService = require("../services/userService");

module.exports = {
  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
};
