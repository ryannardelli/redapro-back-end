const express = require("express");
const router = express.Router();

const essayController = require("../controllers/Essay");
const { checkToken } = require("../middleware/checkToken");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /essay/findAll:
 *   get:
 *     summary: Lista redações (com filtro por status)
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           example: PENDENTE
 *         description: Filtra redações pelo status
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

/**
 * @swagger
 * /essay/users/{userId}:
 *   get:
 *     summary: Retorna todas as redações de um usuário
 *     description: Busca todas as redações associadas ao usuário informado. Acesso permitido apenas para usuários autenticados.
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de redações do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 15
 *                   title:
 *                     type: string
 *                     example: Acesso à água potável no Brasil
 *                   content:
 *                     type: string
 *                     example: Texto completo da redação...
 *                   status:
 *                     type: string
 *                     example: PENDING
 *                   score:
 *                     type: number
 *                     example: 0
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Sociedade
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Usuário não encontrado ou sem redações
 */

router.get(
  "/users/:id",
  checkToken,
  essayController.findEssayByUser
);

/**
 * @swagger
 * /essay/{id}/start-review:
 *   patch:
 *     summary: Inicia a correção de uma redação
 *     description: >
 *       Altera o status da redação para EM_CORRECAO e
 *       associa o corretor autenticado à redação.
 *       Também notifica o aluno via Socket.IO.
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da redação
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Correção iniciada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Correção iniciada com sucesso
 *       400:
 *         description: Redação não pode ser colocada em correção
 *       403:
 *         description: Usuário não tem permissão para corrigir
 *       404:
 *         description: Redação não encontrada
 *       401:
 *         description: Token inválido ou ausente
 */
router.patch(
  "/:id/start-review",
  checkToken,
  authorize(["corrector"]),
  essayController.startReview
);

/**
 * @swagger
 * /essay/{id}/finish-review:
 *   patch:
 *     summary: Finaliza a correção de uma redação
 *     description: >
 *       Finaliza a correção da redação, atribuindo as notas das competências,
 *       calculando a nota final automaticamente e alterando o status para CORRIGIDA.
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da redação
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - c1
 *               - c2
 *               - c3
 *               - c4
 *               - c5
 *             properties:
 *               c1:
 *                 type: integer
 *                 example: 160
 *                 description: Nota da competência 1 (0 a 200)
 *               c2:
 *                 type: integer
 *                 example: 180
 *                 description: Nota da competência 2 (0 a 200)
 *               c3:
 *                 type: integer
 *                 example: 170
 *                 description: Nota da competência 3 (0 a 200)
 *               c4:
 *                 type: integer
 *                 example: 150
 *                 description: Nota da competência 4 (0 a 200)
 *               c5:
 *                 type: integer
 *                 example: 140
 *                 description: Nota da competência 5 (0 a 200)
 *               generalFeedback:
 *                 type: string
 *                 example: "Bom desenvolvimento das ideias, mas precisa melhorar a coesão."
 *                 description: Feedback geral do corretor sobre a redação
 *     responses:
 *       200:
 *         description: Correção finalizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Correção finalizada com sucesso
 *       400:
 *         description: Redação não pode ser finalizada
 *       403:
 *         description: Usuário não tem permissão para corrigir
 *       404:
 *         description: Redação não encontrada
 *       401:
 *         description: Token inválido ou ausente
 */
router.patch(
  "/:id/finish-review",
  checkToken,
  authorize(["corrector"]),
  essayController.finishReview
);

/**
 * @swagger
 * /essay/{id}/correct-ai:
 *   patch:
 *     summary: Corrige uma redação utilizando IA
 *     description: >
 *       Corrige a redação automaticamente utilizando a API da OpenAI.
 *       Cada usuário pode corrigir no máximo 2 redações por semana.
 *       Também notifica o aluno via Socket.IO.
 *     tags: [Essay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da redação
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Redação corrigida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Redação corrigida com IA com sucesso.
 *                 essay:
 *                   $ref: '#/components/schemas/Essay'
 *       403:
 *         description: Limite de correções de IA atingido
 *       404:
 *         description: Redação não encontrada
 *       401:
 *         description: Token inválido ou ausente
 */
router.patch(
    "/:id/correct-ai",
    checkToken,
    essayController.correctWithAI
);


module.exports = router;