class EssayDeletionNotAllowedError extends Error {
    constructor() {
        super("Esta redação não pode ser excluída pois já está em correção por um corretor.");
        this.name = "EssayDeletionNotAllowedError";
        this.statusCode = 400;
    }
}

module.exports = EssayDeletionNotAllowedError;