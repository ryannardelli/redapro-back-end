const express = require("express");
const router = express.Router();

const menuController = require("../controllers/Menu");
const { checkToken } = require("../middleware/checkToken");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /menu/findAll:
 *   get:
 *     summary: Retorna todos os menus
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de menus encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/findAll", checkToken, menuController.findAll);

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Retorna um menu por ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do menu
 *     responses:
 *       200:
 *         description: Menu encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Menu não encontrado
 */
router.get("/:id", checkToken, menuController.findById);

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Cria um novo menu
 *     tags: [Menu]
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
 *               - route
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *                 example: Usuários
 *               route:
 *                 type: string
 *                 example: /usuarios
 *               icon:
 *                 type: string
 *                 example: users
 *     responses:
 *       201:
 *         description: Menu criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 *       409:
 *         description: Rota já cadastrada
 */
router.post("/", checkToken, authorize(["admin"]), menuController.create);

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Atualiza um menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do menu a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Usuários
 *               route:
 *                 type: string
 *                 example: /usuarios
 *               icon:
 *                 type: string
 *                 example: users
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Menu atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Menu não encontrado
 *       409:
 *         description: Rota já cadastrada
 */
router.put("/:id", checkToken, authorize(["admin"]), menuController.update);

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Remove um menu por ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do menu
 *     responses:
 *       200:
 *         description: Menu removido com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Menu não encontrado
 */
router.delete("/:id", checkToken, authorize(["admin"]), menuController.remove);

module.exports = router;