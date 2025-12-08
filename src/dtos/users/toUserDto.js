function toUserDto(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        pictureUrl: user.pictureUrl,
        createdAt: user.createdAt
    }
}

module.exports = { toUserDto };