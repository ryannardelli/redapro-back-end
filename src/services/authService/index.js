const User = require("../../models/User");
const EmailAlreadyExistsError = require("../../exceptions/domain/auth/EmailAlreadyExistsError");
const InvalidEmailError = require("../../exceptions/domain/auth/InvalidEmailError");
const InvalidPasswordError = require("../../exceptions/domain/auth/InvalidPasswordError ");
const InvalidNameError = require("../../exceptions/domain/auth/InvalidNameError");
const InvalidCredentialsError = require("../../exceptions/domain/auth/InvalidCredentialsError");

const bcrypt = require("bcryptjs");
const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");

const jwt = require('jsonwebtoken');

const userRepository = require("../../repositories/userRepository");

async function createUser({ name, email, password }) {
  if (name.length < 2 || name.length > 100) throw new InvalidNameError();
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();
  if (password.length < 8 || password.length > 20) throw new InvalidPasswordError();

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) throw new EmailAlreadyExistsError();

  const userCount = await userRepository.countUsers();

  const role = userCount === 0 ? "admin" : "student";

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return await userRepository.create({ name, email, password: hashedPassword, role });
}

async function login({ email, password }) {
   if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();
   
   const user = await userRepository.findByEmail({ where: { email } });
   if(!user) throw new UserNotFoundError();

   const passwordMatch = await bcrypt.compare(password, user.password);
   if(!passwordMatch) throw new InvalidCredentialsError();
   
   try {
      const secret = process.env.SECRET;
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '1h' });

      return { token };
   } catch(err) {

   }
}

module.exports = { createUser, login };
