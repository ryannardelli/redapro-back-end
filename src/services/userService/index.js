const User = require("../../models/User");
const EmailAlreadyExistsError = require("../../exceptions/domain/user/EmailAlreadyExistsError");
const InvalidEmailError = require("../../exceptions/domain/user/InvalidEmailError");
const InvalidPasswordError = require("../../exceptions/domain/user/InvalidPasswordError ");
const InvalidNameError = require("../../exceptions/domain/user/InvalidNameError");

async function createUser({ name, email, password }) {
  if (name.length < 2 || name.length > 100) throw new InvalidNameError();
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();
  if (password.length < 8 || password.length > 20) throw new InvalidPasswordError();

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) throw new EmailAlreadyExistsError();

  return await User.create({ name, email, password });
}

module.exports = { createUser };
