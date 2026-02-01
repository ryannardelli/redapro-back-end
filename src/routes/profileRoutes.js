const express = require("express");
const router = express.Router();

const profileController = require('../controllers/Profile');
const { checkToken } = require("../middleware/checkToken");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /profile/findAll:
 *   get:
 *     summary: Retorna todos os perfis
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Lista de perfis encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/findAll", checkToken, profileController.findAll);

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Cria um novo perfil
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Administrador
 *               description:
 *                 type: string
 *                 example: Perfil com acesso total ao sistema
 *     responses:
 *       201:
 *         description: Perfil criado com sucesso
 *       400:
 *         description: Nome ou descrição inválidos ou ausentes
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 */
router.post("/", checkToken, authorize(["admin"]), profileController.create);

/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Atualiza um perfil
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Administrador
 *               description:
 *                 type: string
 *                 example: Perfil com acesso total ao sistema
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 *       404:
 *         description: Perfil não encontrado
 */
router.put("/:id", checkToken, authorize(["admin"]), profileController.update);

/**
 * @swagger
 * /profile/{id}:
 *   get:
 *     summary: Retorna um perfil por ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       404:
 *         description: Perfil não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/:id", checkToken, profileController.findById);

/**
 * @swagger
 * /profile/{id}:
 *   delete:
 *     summary: Remove um perfil por ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *     responses:
 *       200:
 *         description: Perfil removido com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 *       404:
 *         description: Perfil não encontrado
 */
router.delete("/:id", checkToken, authorize(["admin"]), profileController.remove);

/**
 * @swagger
 * /profile/associateMenu/{id}:
 *   patch:
 *     summary: Associa um menu a um perfil
 *     description: Associa um menu (menuId) a um perfil existente.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do perfil
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
 *               - menuId
 *             properties:
 *               menuId:
 *                 type: integer
 *                 description: ID do menu a ser associado ao perfil
 *                 example: 3
 *     responses:
 *       200:
 *         description: Menu associado ao perfil com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu associado ao perfil com sucesso!
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "menuId é obrigatório."
 *       404:
 *         description: Perfil ou menu não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Perfil ou menu não encontrado."
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

router.patch("/associateMenu/:id", checkToken, authorize(["admin"]), profileController.associateMenuToProfile);

/**
 * @swagger
 * /profile/menus/{id}:
 *   get:
 *     summary: Retorna todos os menus associados a um perfil
 *     description: Retorna a lista de menus vinculados a um perfil existente.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do perfil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de menus do perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Dashboard
 *                   route:
 *                     type: string
 *                     example: /dashboard
 *                   icon:
 *                     type: string
 *                     example: home
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Perfil não encontrado
 */
router.get(
  "/menus/:id",
  checkToken,
  profileController.findMenusByProfile
);

module.exports = router;
