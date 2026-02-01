function toUserDto(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        pictureUrl: user.pictureUrl,
        createdAt: user.createdAt,
        profile: user.Profile ? {
            id: user.Profile.id,
            name: user.Profile.name,
            description: user.Profile.description
        } : null
    }
}

module.exports = { toUserDto };