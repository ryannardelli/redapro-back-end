const User = require("../models/user");

const InvalidEmailError = require("../exceptions/domain/user/InvalidEmailError");
const InvalidPasswordError = require("../exceptions/domain/user/InvalidPasswordError ");

module.exports = {
    async create(req, res, next) {
        try {
            const { name, email, password } = req.body;

            if(password.length < 8 || password.length > 20) {
                throw new InvalidPasswordError();
            }

            if (!/\S+@\S+\.\S+/.test(email)) {
                throw new InvalidEmailError();
            }

            const user = await User.create({ name, email, password });
            res.status(201).json({ message: "Usuário criado!", user });
        } catch(error) {
            next(error);
        }
    }
}