function toMenuDto(menu) {
    return {
        id: menu.id,
        name: menu.name,
        route: menu.route,
        icon: menu.icon,
        order: menu.order
    }
}

module.exports = { toMenuDto };