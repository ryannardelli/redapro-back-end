const categoryService = require("../services/categoryService");
const { toCategoryDto } = require('../dtos/category/toCategoryDto');
const { toUpdateDto } = require("../dtos/category/toUpdateDto");

async function findAll(req, res, next) {
    try {
        const category = await categoryService.getAllCategory();
        const categoryDto = category.map(toCategoryDto);
        return res.status(200).json(categoryDto);
    } catch(err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        res.status(200).json(toCategoryDto(category));
    } catch(err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        await categoryService.createCategory(req.body);
        res.status(201).json({ message: "Categoria criada com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const updateDto = {
            id: req.params.id,
            ...toUpdateDto(req.body)
        }

        await categoryService.updateCategory(updateDto);
         res.status(200).json({ message: "Categoria atualizada com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id);

        return res.status(200).json({ message: "Categoria excluída com sucesso!" });
    } catch(err) {
        next(err);
    }
}

module.exports = { findAll, findById, update, create, remove };