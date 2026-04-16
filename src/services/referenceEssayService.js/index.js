const ReferenceEssayAlreadyExistsError = require("../../exceptions/domain/referenceEssay/ReferenceEssayAlreadyExistsError");
const ReferenceEssayContentTooShortError = require("../../exceptions/domain/referenceEssay/ReferenceEssayContentTooShortError");
const ReferenceEssayNotFoundError = require("../../exceptions/domain/referenceEssay/ReferenceEssayNotFoundError");
const ReferenceEssayValidationTitle = require("../../exceptions/domain/referenceEssay/ReferenceEssayValidationTitleError");
const ReferenceEssayYearOutOfRangeError = require("../../exceptions/domain/referenceEssay/ReferenceEssayYearOutOfRangeError");
const CategoryNotFoundError = require("../../exceptions/domain/category/CategoryNotFoundError");
const categoryRepository = require("../../repositories/categoryRepository");
const referenceEssayRepository = require("../../repositories/referenceEssayRepository");
const ReferenceEssayValidationAuthorName = require("../../exceptions/domain/referenceEssay/ReferenceEssayValidationAuthorName");

async function getAllReferenceEssay(filters = {}) {
    return referenceEssayRepository.findAll(filters);
}

async function getReferenceEssayById(id) {
    const essay = await referenceEssayRepository.findById(id);
    if(!essay) throw new ReferenceEssayNotFoundError();
    return essay;
}

async function createReferenceEssay(data) {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) throw new CategoryNotFoundError();

    // Validar se já existe redação com mesmo título e ano (evitar duplicidade do INEP)
    const existing = await referenceEssayRepository.findAll({ 
        search: data.title, 
        year: data.year 
    });
    if (existing.length > 0) throw new ReferenceEssayAlreadyExistsError(data.title);

    if (!data.title || data.title.trim().length < 5 || data.title.trim().length > 200) {
        throw new ReferenceEssayValidationTitle();
    }

    if (!data.content || data.content.trim().length < 1000) {
        throw new ReferenceEssayContentTooShortError();
    }

    const currentYear = new Date().getFullYear();
    if (!data.year || data.year < 1998 || data.year > currentYear) {
        throw new ReferenceEssayYearOutOfRangeError(1998, currentYear);
    }

    return referenceEssayRepository.create({
        authorName: data.authorName.trim(),
        title: data.title.trim(),
        content: data.content.trim(),
        year: data.year,
        pdf_url: data.pdf_url || null,
        categoryId: data.categoryId
    });
}

async function updateReferenceEssay(id, updateDto) {
    const essay = await referenceEssayRepository.findById(id);
    if (!essay) {
        throw new ReferenceEssayNotFoundError();
    }

    const updateData = {};

    if (updateDto.authorName !== undefined) {
        const title = updateDto.title.trim();

         if (title.authorName < 5 || title.authorName > 100) {
            throw new ReferenceEssayValidationAuthorName();
        }

        updateData.title = title;
    }

    if (updateDto.title !== undefined) {
        const title = updateDto.title.trim();

         if (title.authorName < 5 || title.length > 100) {
            throw new ReferenceEssayValidationTitle();
        }

        updateData.title = title;
    }

    if (updateDto.content !== undefined) {
        const content = updateDto.content.trim();

        if (content.length < 1000) {
            throw new ReferenceEssayContentTooShortError();
        }

        updateData.content = content;
    }

    if (updateDto.category_id !== undefined) {
        const category = await categoryRepository.findById(updateDto.category_id);

        if (!category) {
            throw new CategoryNotFoundError();
        }

        updateData.categoryId = updateDto.category_id;
    }

    if (updateDto.year !== undefined) {
        const currentYear = new Date().getFullYear();

        if (updateDto.year < 1998 || updateDto.year > currentYear) {
            throw new ReferenceEssayYearOutOfRangeError(1998, currentYear);
        }

        updateData.year = updateDto.year;
    }

    if (updateDto.pdf_url !== undefined) {
        updateData.pdf_url = updateDto.pdf_url;
    }

    return referenceEssayRepository.update(id, updateData);
}

async function deleteReferenceEssay(id) {
    const essay = await referenceEssayRepository.findById(id);
    if (!essay) throw new ReferenceEssayNotFoundError();

    await referenceEssayRepository.delete(id);
    return { message: "Redação excluída com sucesso." };
}

module.exports = { getAllReferenceEssay, getReferenceEssayById, createReferenceEssay, updateReferenceEssay, deleteReferenceEssay }