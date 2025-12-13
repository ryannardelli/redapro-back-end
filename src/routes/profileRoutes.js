// const express = require("express");
// const router = express.Router();

// const profileController = require('../controllers/Profile');
// const { checkToken } = require("../middleware/checkToken");
// const authorize = require("../middleware/authorize");

// router.get("/findAll", checkToken, profileController.findAll);
// router.put("/update", checkToken, authorize(["admin"]), profileController.update);

// router.get("/:id", checkToken, profileController.findById);
// router.delete("/:id", checkToken, authorize(["admin"]), profileController.remove);

// module.exports = router;

const express = require("express");
const router = express.Router();

const profileController = require('../controllers/Profile');
const { checkToken } = require("../middleware/checkToken");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /profiles/findAll:
 *   get:
 *     summary: Retorna todos os perfis
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Lista de perfis encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/findAll", checkToken, profileController.findAll);

/**
 * @swagger
 * /profiles/update:
 *   put:
 *     summary: Atualiza um perfil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (usuário sem permissão)
 */
router.put("/update", checkToken, authorize(["admin"]), profileController.update);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Retorna um perfil por ID
 *     tags: [Profiles]
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
 * /profiles/{id}:
 *   delete:
 *     summary: Remove um perfil por ID
 *     tags: [Profiles]
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

module.exports = router;
