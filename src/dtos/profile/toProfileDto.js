function toProfileDto(profile) {
    return {
        id: profile.id,
        name: profile.name,
        description: profile.description
    }
}

module.exports = { toProfileDto };