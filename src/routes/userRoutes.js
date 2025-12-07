const express = require("express");
const router = express.Router();

const userController = require("../controllers/User");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operações relacionadas a usuários
 */

router.get("/findAll", userController.findAll);

module.exports = router;