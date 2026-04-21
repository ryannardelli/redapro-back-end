const { toEssayDto } = require('../dtos/essay/toEssayDto');
const { toUpdateDto } = require('../dtos/essay/toUpdateDto');
const essayService = require('../services/essayService');

async function findAll(req, res, next) {
    try {
        const { status } = req.query;

        const essays = await essayService.getAllEssay({
            status
        });

        const essayDto = essays.map(toEssayDto);
        return res.status(200).json(essayDto);
    } catch(err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const essay = await essayService.getEssayById(id);
        res.status(200).json(toEssayDto(essay));
    } catch(err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const userId = Number(req.params.id);

        await essayService.createEssay(req.body, userId);

        res.status(201).json({ message: "Redação criada com sucesso!" });
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const essayId = Number(req.params.id);
        const updateDto = toUpdateDto(req.body);
        const userId = req.user.id;

        await essayService.updateEssay(essayId, updateDto, userId);

        res.status(200).json({ message: "Redação atualizada com sucesso!" });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        await essayService.deleteEssay(id);

        return res.status(200).json({ message: "Redação excluída com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function findEssayByUser(req, res, next) {
    try {
        const { id } = req.params;
        const essay = await essayService.getEssayByUser(id);

        return res.status(200).json(essay.map(toEssayDto));
    } catch(err) {
        next(err);
    }
}

async function startReview(req, res, next) {
    try {
        const essayId = Number(req.params.id);
        const reviewerId = req.user.id;

        const essay = await essayService.startReview(essayId, reviewerId);

        const io = req.app.get("io");

        console.log("🚀 Emitindo evento para sala:", `user_${essay.userId}`);

        io.to(`user_${essay.userId}`).emit("essay:status", {
            id: essay.id,
            status: essay.status,
            message: "Sua redação entrou em correção."
        });

        return res.status(200).json({
            message: "Correção iniciada com sucesso."
        });
    } catch(err) {
        next(err);
    }
}

async function finishReview(req, res, next) {
    try {
        const essayId = Number(req.params.id);
        const reviewerId = req.user.id;

        const { c1, c2, c3, c4, c5, generalFeedback } = req.body;

        const essay = await essayService.finishReview(
            essayId,
            reviewerId,
            { c1, c2, c3, c4, c5, generalFeedback }
        );

        const io = req.app.get("io");

         io.to(`user_${essay.userId}`).emit("essay:status", {
            id: essay.id,
            status: essay.status,
            note: essay.note,
            feedback: essay.feedback,
            message: "Sua redação foi corrigida."
        });

        return res.status(200).json({
            message: "Correção finalizada com sucesso.",
        });
    } catch (err) {
        next(err);
    }
}

async function correctWithAI(req, res, next) {
    try {
        const essayId = Number(req.params.id);
        const userId = req.user.id;

        const essay = await essayService.correctEssayWithAI(userId, essayId);

        const io = req.app.get("io");

        io.to(`user_${essay.userId}`).emit("essay:status", {
            message: "Sua redação foi corrigida pela IA."
        });

        io.to(`user_${essay.userId}`).emit("essay:status", {
            id: essay.id,
            status: essay.status,
            note: essay.note,
            feedback: {
                c1: essay.c1,
                c2: essay.c2,
                c3: essay.c3,
                c4: essay.c4,
                c5: essay.c5,
                general: essay.generalFeedback
            },
            message: "Sua redação foi corrigida pela IA.",
            generalFeedback: essay.generalFeedback,
            });

    } catch (err) {
        next(err);
    }
}

async function uploadEssayAttachment(req, res, next) {
  try {
    const essayId = req.params.id;

    const result = await essayService.uploadEssayAttachment(
      essayId,
      req.file
    );

    return res.status(200).json({
      message: "Arquivo anexado com sucesso!",
      url: result.url,
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { findAll, findById, update, remove, create, findEssayByUser, startReview, finishReview, correctWithAI, uploadEssayAttachment };