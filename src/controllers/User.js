const User = require("../models/user");

module.exports = {
    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.create({ name, email, password });

            res.status(201).json({ message: "Usuário criado!", user });
        } catch(error) {
            console.log(error);
            res.status(500).json({ error: "Erro ao criar o usuário" });
        }
    }
}