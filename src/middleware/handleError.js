const InternalServerError = require("../exceptions/common/InternalServerError");

function handleError(err, req, res, next) {
    console.log(err); // log para debug

    // Se o erro já tiver statusCode definido (erros de domínio / validação)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    const internalError = new InternalServerError();
    res.status(internalError.statusCode).json({
        message: internalError.message
    })
}

module.exports = handleError;
