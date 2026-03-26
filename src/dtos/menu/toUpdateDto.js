function toUpdateDto(body) {
    return {
        name: body.name,
        icon: body.icon,
    }
}

module.exports = { toUpdateDto };