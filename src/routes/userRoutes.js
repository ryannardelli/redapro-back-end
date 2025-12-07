const express = require("express");
const router = express.Router();

const userController = require("../controllers/User");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operações relacionadas a usuários
 */

/**
 * @swagger
 * /users/findAll:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */

router.get("/findAll", userController.findAll);

module.exports = router;