class ProfileAlreadyExistsError extends Error {
    constructor(profileName) {
        super(`Perfil "${profileName}" já existe.`);
        this.name = 'ProfileAlreadyExistsError';
        this.statusCode = 409;
    }
}

module.exports = ProfileAlreadyExistsError;