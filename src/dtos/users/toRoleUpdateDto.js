function toRoleUpdateDto(body) {
    return {
        idUser: body.idUser,
        role: body.role
    }
}

module.exports = { toRoleUpdateDto };