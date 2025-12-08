const UnauthorizedError = require("../exceptions/UnauthorizedError");

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) throw new UnauthorizedError();

    req.token = token;
    next();
}

module.exports = { checkToken };