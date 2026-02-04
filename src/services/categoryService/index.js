const categoryRepository = require('../../repositories/categoryRepository');
const CategoryNotFoundError = require('../../exceptions/domain/category/CategoryNotFoundError');
const CategoryAlreadyExistisError = require('../../exceptions/domain/category/CategoryAlreadyExistisError');
const CategoryNameValidationError = require('../../exceptions/domain/category/CategoryNameValidationError');
const CategoryDescriptionValidationError = require('../../exceptions/domain/category/CategoryDescriptionValidationError');

async function getAllCategory() {
    return categoryRepository.findAll();
}

async function getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if(!category) throw new CategoryNotFoundError();
    return category;
}

async function createCategory(data) {
    const existing = await categoryRepository.findByName(data.name);
    if(existing) throw new CategoryAlreadyExistisError(data.name);

    if(data.length > 50) throw new CategoryNameValidationError();
    if(data.description && data.description.length > 255) throw new CategoryDescriptionValidationError();

    return categoryRepository.create(data);
}

async function updateCategory(updateDto) {
    const { id, ...updateData } = updateDto;
    const exists = await categoryRepository.findByName(updateCategory.name);
    const category = await categoryRepository.findById(id);

    if(!category) throw new CategoryNotFoundError();
    if(exists) throw new CategoryAlreadyExistisError();

    await category.update(updateData);
    return category.get({ plain: true });
}

async function deleteCategory(id) {
    const category = await getCategoryById(id);

    if(!category) throw new CategoryNotFoundError();
    await category.destroy();
    return { message: "Categoria excluída com sucesso!" };
}

module.exports = { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory }