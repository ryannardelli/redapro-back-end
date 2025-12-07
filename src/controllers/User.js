const User = require("../models/user");

const userService = require("../services/userService/createUser");

module.exports = {
  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (error) {
      next(error);
    }
  }
};
