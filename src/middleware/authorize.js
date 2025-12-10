const AccessDeniedError = require("../exceptions/AccessDeniedError");

function authorize(roles = []) {
    if(typeof roles === "string") {
        roles = [roles];
    }

    return(req, res, next) => {
        const userRole = req.user.role;

        if(!roles.includes(userRole)) throw new AccessDeniedError();

        next();
    }
}

module.exports = authorize;