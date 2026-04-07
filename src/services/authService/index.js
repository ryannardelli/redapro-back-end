const EmailAlreadyExistsError = require("../../exceptions/domain/auth/EmailAlreadyExistsError");
const InvalidEmailError = require("../../exceptions/domain/auth/InvalidEmailError");
const InvalidPasswordError = require("../../exceptions/domain/auth/InvalidPasswordError ");
const InvalidNameError = require("../../exceptions/domain/auth/InvalidNameError");
const InvalidCredentialsError = require("../../exceptions/domain/auth/InvalidCredentialsError");

const bcrypt = require("bcryptjs");
const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");

const jwt = require('jsonwebtoken');

const userRepository = require("../../repositories/userRepository");
const profileRepository = require("../../repositories/profileRepository");

async function createUser({ name, email, password }) {
  if (name.length < 2 || name.length > 100) throw new InvalidNameError();
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();
  if (password.length < 8 || password.length > 20) throw new InvalidPasswordError();

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) throw new EmailAlreadyExistsError();

  const userCount = await userRepository.countUsers();

   const profileName = userCount === 0
    ? "Administrador"
    : "Estudante";

  const profile = await profileRepository.findByName(profileName);

  const role = userCount === 0 ? "admin" : "student";

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user =  await userRepository.create({ name, email, password: hashedPassword, role, profileId: profile.id });

  const secret = process.env.SECRET;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "1h" }
  );

   return {
    message: "Cadastro feito com sucesso!",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

}

async function login({ email, password }) {
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();

  const user = await userRepository.findByEmail(email);
  if (!user) throw new UserNotFoundError();

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new InvalidCredentialsError();

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      secret, 
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    };
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao gerar token");
  }
}


module.exports = { createUser, login };

