const express = require("express");
const router = express.Router();

const authController = require("../controllers/Auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operações relacionadas a autenticação
 */


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Auth]
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
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro na requisição
 */

router.post("/register", authController.create);
module.exports = router;
