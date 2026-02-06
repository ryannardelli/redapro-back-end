const { toReferenceEssayDto } = require("../dtos/referenceEssay/toReferenceEssayDto");
const { toUpdateDto } = require("../dtos/referenceEssay/toUpdateDto");
const referenceEssayService = require("../services/referenceEssayService.js");

async function findAll(req, res, next) {
    try {
        const { year, categoryId, search } = req.query;

        const essays = await referenceEssayService.getAllReferenceEssay({
            year,
            categoryId,
            search
        });

        const essayDto = essays.map(toReferenceEssayDto);
        return res.status(200).json(essayDto);
    } catch (err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const essay = await referenceEssayService.getReferenceEssayById(id);
        
        return res.status(200).json(toReferenceEssayDto(essay));
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const essay = await referenceEssayService.createReferenceEssay(req.body);

        return res.status(201).json({ 
            message: "Redação cadastrada com sucesso!",
            data: toReferenceEssayDto(essay)
        });
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { id } = req.params;
        const updateDto = toUpdateDto(req.body);

        await referenceEssayService.updateReferenceEssay(id, updateDto);

        return res.status(200).json({ message: "Redação atualizada com sucesso!" });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        await referenceEssayService.deleteReferenceEssay(id);

        return res.status(200).json({ message: "Redação excluída com sucesso!" });
    } catch (err) {
        next(err);
    }
}

module.exports = { 
    findAll, 
    findById, 
    create, 
    update, 
    remove 
};