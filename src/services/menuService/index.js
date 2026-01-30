const menuRepository = require("../../repositories/menuRepository");
const MenuNotFoundError = require("../../exceptions/domain/menu/MenuNotFoundError");
const RouteAlreadyExistsError = require("../../exceptions/domain/menu/RouteAlreadyExistsError");
const MenuNameValidationError = require("../../exceptions/domain/menu/MenuNameValidationError");
async function getAllMenu() {
    return menuRepository.findAll();
}

async function getMenuById(id) {
    const menu = await menuRepository.findById(id);
    if(!menu) throw new MenuNotFoundError();
}

async function createMenu(data) {
    const ROUTE_REGEX = /^[a-z0-9\-\/]+$/;
    const existing = await menuRepository.findByRoute(data.route);

    if(existing) throw new RouteAlreadyExistsError();

    if(data.name.lenght > 100 || data.name.lenght < 3) throw new MenuNameValidationError();

    if(!ROUTE_REGEX.test(data.route)) throw new MenuNameValidationError();
    
    return menuRepository.create(data);
}

async function updateMenu(updateDto) {
    const { id, ...updateData } = updateDto;
    const exists = await menuRepository.findByRoute(updateDto.route);
    const menu = await menuRepository.findById(id);

    if(!menu) throw new MenuNotFoundError();
    if(exists) throw new MenuRouteValidationError();

    await menu.update(updateData);
    return menu.get({ plain: true });
}

async function deleteMenu(id) {
    const menu = await getMenuById(id);

    if(!menu) throw new MenuNotFoundError();

    await menu.destroy();
    return { message: "Menu excluído com sucesso!" };
} 

module.exports = { getAllMenu, getMenuById, createMenu, updateMenu, deleteMenu };