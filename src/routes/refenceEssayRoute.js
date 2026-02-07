const express = require("express");
const router = express.Router();

const referenceEssayController = require("../controllers/ReferenceEssay");
const { checkToken } = require("../middleware/checkToken");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * tags:
 *   - name: ReferenceEssay
 *     description: Acervo de redações Nota 1000 (INEP) para consulta e estudo.
 */

/**
 * @swagger
 * /reference-essay/findAll:
 *   get:
 *     summary: Lista redações nota 1000 (com filtros)
 *     tags:
 *       - ReferenceEssay
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtra pelo ano do ENEM (ex. 2023)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: ID da categoria/tema
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por palavras no título
 *     responses:
 *       200:
 *         description: Lista de redações de referência encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReferenceEssay'
 */
router.get("/findAll", checkToken, referenceEssayController.findAll);

/**
 * @swagger
 * /reference-essay/{id}:
 *   get:
 *     summary: Busca uma redação de referência pelo ID
 *     tags:
 *       - ReferenceEssay
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da redação de referência
 *     responses:
 *       200:
 *         description: Redação encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReferenceEssay'
 *       404:
 *         description: Redação não encontrada
 */
router.get("/:id", checkToken, referenceEssayController.findById);

/**
 * @swagger
 * /reference-essay:
 *   post:
 *     summary: Cadastra uma nova redação Nota 1000
 *     tags:
 *       - ReferenceEssay
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReferenceEssay'
 *     responses:
 *       201:
 *         description: Redação cadastrada com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (apenas Admin)
 *       409:
 *         description: Redação com mesmo título/ano já existe
 */
router.post("/", checkToken, authorize(["admin"]), referenceEssayController.create);

/**
 * @swagger
 * /reference-essay/{id}:
 *   put:
 *     summary: Atualiza dados de uma redação de referência
 *     tags:
 *       - ReferenceEssay
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReferenceEssay'
 *     responses:
 *       200:
 *         description: Redação atualizada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Redação não encontrada
 */
router.put("/:id", checkToken, authorize(["admin"]), referenceEssayController.update);

/**
 * @swagger
 * /reference-essay/{id}:
 *   delete:
 *     summary: Remove uma redação do acervo
 *     tags:
 *       - ReferenceEssay
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Redação removida com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete("/:id", checkToken, authorize(["admin"]), referenceEssayController.remove);

module.exports = router;