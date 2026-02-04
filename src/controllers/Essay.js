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

module.exports = { findAll, findById, update, remove, create, findEssayByUser };