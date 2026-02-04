const express = require("express");
const router = express.Router();

const essayController = require("../controllers/Essay");
const { checkToken } = require("../middleware/checkToken");

/**
 * @swagger
 * /essay/findAll:
 *   get:
 *     summary: Lista todas as redações
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de redações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Essay'
 *       401:
 *         description: Token inválido ou ausente
 */
router.get("/findAll", checkToken, essayController.findAll);

/**
 * @swagger
 * /essay/{id}:
 *   get:
 *     summary: Busca uma redação pelo ID
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da redação
 *     responses:
 *       200:
 *         description: Redação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Essay'
 *       404:
 *         description: Redação não encontrada
 */
router.get("/:id", checkToken, essayController.findById);

/**
 * @swagger
 * /essay/{userId}:
 *   post:
 *     summary: Cria uma nova redação para um usuário
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário que está criando a redação
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEssay'
 *     responses:
 *       201:
 *         description: Redação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário ou categoria não encontrados
 *       409:
 *         description: Redação já existente
 */
router.post("/:id", checkToken, essayController.create);

/**
 * @swagger
 * /essay/{id}:
 *   put:
 *     summary: Atualiza uma redação pendente
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da redação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEssay'
 *     responses:
 *       200:
 *         description: Redação atualizada com sucesso
 *       400:
 *         description: Redação não pode ser atualizada
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Redação não encontrada
 */
router.put("/:id", checkToken, essayController.update);

/**
 * @swagger
 * /essay/{id}:
 *   delete:
 *     summary: Exclui uma redação pendente
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da redação
 *     responses:
 *       200:
 *         description: Redação excluída com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Redação não encontrada
 */
router.delete("/:id", checkToken, essayController.remove);

module.exports = router;