const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/Dashboard");
const { checkToken } = require("../middleware/checkToken");

/**
 * @swagger
 * /dashboard/student/stats:
 *   get:
 *     summary: Retorna estatísticas do dashboard do estudante
 *     description: >
 *       Retorna métricas gerais das redações do estudante autenticado,
 *       incluindo quantidade total de redações enviadas, média de notas,
 *       quantidade de redações pendentes e corrigidas.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEssays:
 *                   type: integer
 *                   example: 12
 *                   description: Total de redações enviadas pelo estudante
 *                 correctedEssays:
 *                   type: integer
 *                   example: 8
 *                   description: Total de redações corrigidas
 *                 pendingEssays:
 *                   type: integer
 *                   example: 4
 *                   description: Total de redações aguardando correção
 *                 averageScore:
 *                   type: number
 *                   example: 780
 *                   description: Média das notas das redações corrigidas
 *                 lastEssayDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-05T18:10:00.000Z"
 *                   description: Data da última redação enviada
 *       401:
 *         description: Token inválido ou ausente
 */
router.get(
  "/student/stats",
  checkToken,
  dashboardController.getStudentStats
);

/**
 * @swagger
 * /dashboard/recent-essays:
 *   get:
 *     summary: Retorna as últimas redações do usuário
 *     description: >
 *       Retorna as 5 redações mais recentes enviadas pelo usuário autenticado.
 *       Essa informação é utilizada para exibir o histórico de atividades
 *       no dashboard do estudante.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista das últimas redações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 12
 *                     description: ID da redação
 *                   title:
 *                     type: string
 *                     example: "Desafios da educação no Brasil"
 *                     description: Título da redação
 *                   status:
 *                     type: string
 *                     example: "CORRIGIDA"
 *                     description: Status da redação
 *                   note:
 *                     type: number
 *                     example: 820
 *                     description: Nota da redação (se corrigida)
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-05T18:10:00.000Z"
 *                     description: Data de envio da redação
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       name:
 *                         type: string
 *                         example: "Educação"
 *       401:
 *         description: Token inválido ou não enviado
 */

router.get(
  "/recent-essays",
  checkToken,
  dashboardController.getRecentEssays
);

/**
 * @swagger
 * /dashboard/reviewer/stats:
 *   get:
 *     summary: Retorna estatísticas do dashboard do corretor
 *     description: >
 *       Retorna métricas gerais de performance do corretor, incluindo
 *       total de redações corrigidas, quantidade pendente de correção,
 *       total já corrigidas, média das notas atribuídas e data da última correção.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do corretor retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReviewed:
 *                   type: integer
 *                   example: 42
 *                   description: Total de redações corrigidas pelo corretor
 *                 pending:
 *                   type: integer
 *                   example: 10
 *                   description: Total de redações aguardando correção
 *                 corrected:
 *                   type: integer
 *                   example: 32
 *                   description: Total de redações já corrigidas
 *                 averageScore:
 *                   type: number
 *                   example: 785
 *                   description: Média das notas atribuídas pelo corretor
 *                 lastReviewed:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-10T14:20:00.000Z"
 *                   description: Data da última correção realizada
 *       401:
 *         description: Token inválido ou ausente
 */

router.get(
  "/reviewer/stats",
  checkToken,
  dashboardController.getReviewerStats
);

/**
 * @swagger
 * /dashboard/reviewer-activity:
 *   get:
 *     summary: Retorna as últimas redações corrigidas pelo corretor
 *     description: >
 *       Retorna as redações mais recentes que foram corrigidas pelo corretor autenticado.
 *       Usado para exibir o histórico de atividade no dashboard do corretor.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de redações corrigidas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 21
 *                     description: ID da redação
 *                   title:
 *                     type: string
 *                     example: "Impactos da tecnologia na educação"
 *                   status:
 *                     type: string
 *                     example: "CORRIGIDA"
 *                   note:
 *                     type: number
 *                     example: 800
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-04-01T10:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-04-02T12:00:00.000Z"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       name:
 *                         type: string
 *                         example: "João Silva"
 *                       email:
 *                         type: string
 *                         example: "joao@email.com"
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Tecnologia"
 *       401:
 *         description: Token inválido ou não enviado
 */

router.get(
  "/reviewer-activity",
  checkToken,
  dashboardController.getRecentReviewedEssays
);

module.exports = router;