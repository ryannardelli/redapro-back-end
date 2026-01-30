const { escape } = require('sequelize/lib/sql-string');
const { toMenuDto } = require('../dtos/menu/toMenuDto');
const { toUpdateDto } = require('../dtos/menu/toUpdateDto');
const menuService = require('../services/menuService');

async function findAll(req, res, next) {
    try {
        const menu = await menuService.getAllMenu();
        const menuDto = menu.map(toMenuDto);
        return res.status(200).json(menuDto);
    } catch(err) {
        next(err)
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const menu = await menuService.getMenuById(id);
        res.status(200).json(toMenuDto(menu));
    } catch(err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        await menuService.createMenu(req.body);
        res.status(201).json({ message: "Menu criado com sucesso!" });
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

        await menuService.updateMenu(updateDto);
        res.status(200).json({ message: "Menu atualizado com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        await menuService.deleteMenu(id);

        return res.status(200).json({ message: "Menu excluído com sucesso!" });
    } catch(err) {
        next(err);
    }
}

module.exports = { findAll, findById, update, remove, create };
