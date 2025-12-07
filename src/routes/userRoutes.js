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
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro na requisição
 */

router.post("/", userController.create);

module.exports = router;