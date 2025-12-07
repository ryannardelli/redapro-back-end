function handleError(err, req, res, next) {
    console.log(err); // log para debug

    // Se o erro já tiver statusCode definido (erros de domínio / validação)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    // Erros inesperados
    res.status(500).json({
        message: "Aconteceu um erro interno no servidor. Tente novamente mais tarde."
    });
}

module.exports = handleError;
