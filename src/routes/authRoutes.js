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
 * /auth/register:
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@exemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT de autenticação
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Credenciais incorretas
 */

router.post("/login", authController.login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicita o reset de senha do usuário
 *     tags: [Auth]
 *     description: Envia um e-mail com link ou token para redefinição de senha, caso o e-mail exista.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@exemplo.com
 *     responses:
 *       200:
 *         description: Solicitação processada com sucesso (mesmo que o e-mail não exista por segurança)
 *       400:
 *         description: Requisição inválida
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefine a senha do usuário
 *     tags: [Auth]
 *     description: Valida o token de redefinição e atualiza a senha do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token enviado por e-mail para validação do reset
 *                 example: "a1b2c3d4e5f6"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Token inválido ou expirado / requisição inválida
 *       401:
 *         description: Não autorizado
 */
router.post("/reset-password", authController.resetPassword);

module.exports = router;
