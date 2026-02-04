const EssayAlreadyExistsError = require('../../exceptions/domain/essay/EssayAlreadyExistsError');
const EssayCategoryNotFoundError = require('../../exceptions/domain/essay/EssayCategoryNotFoundError');
const UserNotFoundError = require('../../exceptions/domain/auth/UserNotFoundError');
const EssayForbiddenError = require('../../exceptions/domain/essay/EssayForbiddenError');
const EssayNoteNotAllowedError = require('../../exceptions/domain/essay/EssayNoteNotAllowedError');
const EssayNotFoundError = require('../../exceptions/domain/essay/EssayNotFoundError');
const EssayUpdateNotAllowedError = require('../../exceptions/domain/essay/EssayUpdateAllowedError');
const EssayValidationContentError = require('../../exceptions/domain/essay/EssayValidationContentError');
const EssayValidationTitleError = require('../../exceptions/domain/essay/EssayValidationTitleError');
const essayRepository = require('../../repositories/essayRepository');
const categoryRepository = require('../../repositories/categoryRepository');
const userRepository = require('../../repositories/userRepository');

async function getAllEssay(filters = {}) {
    return essayRepository.findAll(filters);
}


async function getEssayById(id) {
    const essay = await essayRepository.findById(id);
    if(!essay) throw new EssayNotFoundError();
    return essay;
}

async function getEssayByUser(userId) {
    const user = await essayRepository.findByWithUsers(userId);

    if (!user) throw new UserNotFoundError();

    return user.essay;
}

async function createEssay(data, userId) {
    // Validar categoria
    const category = await categoryRepository.findById(data.category_id);
    const user = await userRepository.findById(userId);
    if (!category) {
        throw new EssayCategoryNotFoundError();
    }

    if(!user) {
        throw new UserNotFoundError();
    }

    // Evitar duplicidade (title + user + category)
    const existing = await essayRepository.findByTitle(
        data.title,
        userId,
        data.category_id
    );

    if (existing) {
        throw new EssayAlreadyExistsError(data.title);
    }

    if (!data.title || data.title.trim().length < 5 || data.title.trim().length > 50) {
        throw new EssayValidationTitleError();
    }

    if (!data.content || data.content.trim().length < 1000 || data.content.trim().length > 5000) {
        throw new EssayValidationContentError();
    }
    if (data.note !== undefined && data.note !== null) {
        throw new EssayNoteNotAllowedError();
    }

    return essayRepository.create({
        title: data.title.trim(),
        content: data.content.trim(),
        categoryId: data.category_id,
        userId: userId,
        status: "PENDENTE",
        note: null
    });
}

async function updateEssay(essayId, updateDto, userId) {

    // Buscar redação
    const essay = await essayRepository.findById(essayId);
    if (!essay) {
        throw new EssayNotFoundError();
    }

    // Garantir que o usuário é o dono
    if (essay.userId !== userId) {
        throw new EssayForbiddenError();
    }

    // Bloquear edição se não estiver pendente
    if (essay.status !== "PENDENTE") {
        throw new EssayUpdateNotAllowedError();
    }

    const updateData = {};

    if (updateDto.title !== undefined) {
        if (updateDto.title.trim().length < 5 || updateDto.title.trim().length > 50) {
            throw new EssayValidationTitleError();
        }
        updateData.title = updateDto.title.trim();
    }

    if (updateDto.content !== undefined) {
        if (updateDto.content.trim().length < 1000 || updateDto.content.trim().length > 5000) {
            throw new EssayValidationContentError();
        }
        updateData.content = updateDto.content.trim();
    }

    if (updateDto.category_id !== undefined) {
        const category = await categoryRepository.findById(updateDto.category_id);
        if (!category) {
            throw new EssayCategoryNotFoundError();
        }
        updateData.category_id = updateDto.category_id;
    }

    await essayRepository.updateById(essayId, updateData);
}

async function deleteEssay(id) {
    const essay = await getEssayById(id);
    if(!essay) throw new EssayNotFoundError();

    await essay.destroy();
     return { message: "Redação excluída com sucesso!" };
};

module.exports = { getAllEssay, getEssayById, updateEssay, createEssay, deleteEssay, getEssayByUser };
