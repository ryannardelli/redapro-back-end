const menuRepository = require("../../repositories/menuRepository");

const MenuNotFoundError = require("../../exceptions/domain/menu/MenuNotFoundError");
const RouteAlreadyExistsError = require("../../exceptions/domain/menu/RouteAlreadyExistsError");
async function getAllMenu() {
    return menuRepository.findAll();
}

async function getMenuById(id) {
    const menu = await menuRepository.findById(id);
    if(!menu) throw new MenuNotFoundError();
    return menu;
}

async function updateMenu(updateDto) {
    const { id, ...updateData } = updateDto;
    const exists = await menuRepository.findByRoute(updateDto.route);
    const menu = await menuRepository.findById(id);

    if(!menu) throw new MenuNotFoundError();
    if(exists) throw new RouteAlreadyExistsError();

    await menu.update(updateData);
    return menu.get({ plain: true });
}

async function deleteMenu(id) {
    const menu = await getMenuById(id);

    if(!menu) throw new MenuNotFoundError();

    await menu.destroy();
    return { message: "Menu excluído com sucesso!" };
} 

module.exports = { getAllMenu, getMenuById, updateMenu, deleteMenu };