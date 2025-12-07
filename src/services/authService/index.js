const User = require("../../models/User");
const EmailAlreadyExistsError = require("../../exceptions/domain/auth/EmailAlreadyExistsError");
const InvalidEmailError = require("../../exceptions/domain/auth/InvalidEmailError");
const InvalidPasswordError = require("../../exceptions/domain/auth/InvalidPasswordError ");
const InvalidNameError = require("../../exceptions/domain/auth/InvalidNameError");

const bcrypt = require("bcryptjs");
const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");
const InvalidCredentialsError = require("../../exceptions/domain/auth/InvalidCredentialsError");

async function createUser({ name, email, password }) {
  if (name.length < 2 || name.length > 100) throw new InvalidNameError();
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();
  if (password.length < 8 || password.length > 20) throw new InvalidPasswordError();

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) throw new EmailAlreadyExistsError();

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return await User.create({ name, email, password: hashedPassword });
}

async function login({ email, password }) {
   if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();
   
   const user = await User.findOne({ where: { email } });
   if(!user) throw new UserNotFoundError();

   const passwordMatch = await bcrypt.compare(password, user.password);
   if(!passwordMatch) throw new InvalidCredentialsError();
}

module.exports = { createUser };
