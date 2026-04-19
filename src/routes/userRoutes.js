const express = require("express");
const router = express.Router();

const userController = require("../controllers/User");
const { checkToken } = require("../middleware/checkToken");
const authorize = require("../middleware/authorize");
const { uploadImage } = require("../middleware/uploadImage");

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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: João
 *                 email:
 *                   type: string
 *                   example: joao@email.com
 *                 role:
 *                   type: string
 *                   example: student 
 *                 pictureUrl:
 *                   type: string
 *                   example: string
 *                 createdAt:
 *                   type: string
 *                   example: string
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: João
 *         email:
 *           type: string
 *           example: joao@email.com
 *         pictureUrl:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualiza um usuário existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João da Silva"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário excluído com sucesso!
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 */

/**
 * @swagger
 * /users/associateProfile/{userId}:
 *   patch:
 *     summary: Associa um perfil a um usuário
 *     description: Associa um perfil (profileId) a um usuário existente.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileId
 *             properties:
 *               profileId:
 *                 type: integer
 *                 description: ID do perfil a ser associado ao usuário
 *                 example: 2
 *     responses:
 *       200:
 *         description: Perfil associado ao usuário com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Perfil associado ao usuário com sucesso!
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "profileId é obrigatório."
 *       404:
 *         description: Usuário ou perfil não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário ou perfil não encontrado."
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acesso não autorizado."
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna o usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado
 */

/**
 * @swagger
 * /users/me/picture:
 *   patch:
 *     summary: Atualiza a imagem de perfil do usuário autenticado
 *     description: |
 *       Permite que o usuário autenticado envie uma nova imagem de perfil.
 *       A imagem é enviada via multipart/form-data e armazenada no Cloudinary.
 *       Caso o usuário já possua uma imagem anterior, ela será removida automaticamente do Cloudinary.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem (jpg, png, jpeg, etc.)
 *     responses:
 *       200:
 *         description: Imagem de perfil atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem atualizada com sucesso!
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/.../profile.jpg
 *       400:
 *         description: Nenhum arquivo foi enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Arquivo não enviado
 *       401:
 *         description: Não autenticado (token inválido ou ausente)
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

router.get("/me", checkToken, userController.me);
router.get("/findAll", checkToken, userController.findAll);
router.patch("/associateProfile/:id", checkToken, authorize(["admin"]), userController.updateUserProfile);

router.get("/:id", checkToken, userController.findById);
router.patch("/:id", checkToken, userController.update);
router.delete("/:id", checkToken, authorize(["admin"]), userController.remove);

router.patch(
  "/me/picture",
  checkToken,
  uploadImage.single("file"),
  userController.uploadProfileImage
);

module.exports = router;