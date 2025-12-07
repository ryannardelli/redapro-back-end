const User = require("../models/user");

const InvalidEmailError = require("../exceptions/domain/user/InvalidEmailError");
const InvalidPasswordError = require("../exceptions/domain/user/InvalidPasswordError ");
const EmailAlreadyExistsError = require("../exceptions/domain/user/EmailAlreadyExistsError");
const InvalidNameError = require("../exceptions/domain/user/InvalidNameError");

module.exports = {
    async create(req, res, next) {
        try {
            const { name, email, password } = req.body;

            if(password.length < 8 || password.length > 20) throw new InvalidPasswordError();

            if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();
            
            const existingEmail = await User.findOne({ where: { email } });
            if(existingEmail) throw new EmailAlreadyExistsError();

            if(name.length < 2 || name.length > 100) throw new InvalidNameError;

            await User.create({ name, email, password });
            res.status(201).json({ message: "Usuário criado com sucesso!" });
        } catch(error) {
            next(error);
        }
    }
}