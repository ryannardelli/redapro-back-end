const PasswordResetToken = require("../models/PasswordResetToken");
const User = require("../models/User");

module.exports = {
  create: (data) => PasswordResetToken.create(data),

  findByToken: (token) =>
    PasswordResetToken.findOne({
      where: { token },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "name"]
        }
      ]
    }),

  deleteByToken: (token) =>
    PasswordResetToken.destroy({ where: { token } }),

  deleteByUserId: (userId) =>
    PasswordResetToken.destroy({ where: { userId } })
};