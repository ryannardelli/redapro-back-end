function toProfileDto(profile) {
    return {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        active: profile.active,
        system: profile.system
    }
}

module.exports = { toProfileDto };