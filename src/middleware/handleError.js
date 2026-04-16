const InternalServerError = require("../exceptions/common/InternalServerError");

function handleError(err, _req, res, _next) {
    console.log(err);

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
