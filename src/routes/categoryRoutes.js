const express = require("express");
const router = express.Router();

const categoryController = require('../controllers/Category');
const { checkToken } = require("../middleware/checkToken");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /category/findAll:
 *   get:
 *     summary: Retorna todas as categorias
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lista de categorias encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/findAll", checkToken, categoryController.findAll);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Retorna uma categoria por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/:id", checkToken, categoryController.findById);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Category]
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
 *                 example: Eletrônicos
 *               description:
 *                 type: string
 *                 example: Categoria de produtos eletrônicos
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Nome ou descrição inválidos ou ausentes
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 */
router.post("/", checkToken, authorize(["admin"]), categoryController.create);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Eletrônicos
 *               description:
 *                 type: string
 *                 example: Categoria atualizada de produtos eletrônicos
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 *       404:
 *         description: Categoria não encontrada
 */
router.put("/:id", checkToken, authorize(["admin"]), categoryController.update);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser deletada
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 *       404:
 *         description: Categoria não encontrada
 */
router.delete("/:id", checkToken, authorize(["admin"]), categoryController.remove);
module.exports = router;