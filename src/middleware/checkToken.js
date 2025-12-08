const TokenInvalid = require("../exceptions/TokenInvalid");
const UnauthorizedError = require("../exceptions/UnauthorizedError");
const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) throw new UnauthorizedError();

    const secret = process.env.SECRET;

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (e) {
        throw new TokenInvalid();
    }

    // req.token = token;
    // next();
}

module.exports = { checkToken };