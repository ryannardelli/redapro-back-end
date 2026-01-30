function toUpdateDto(body) {
    return {
        name: body.name,
        route: body.route,
        icon: body.icon,
    }
}

module.exports = { toUpdateDto };