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
const passwordResetRepository = require("../../repositories/passwordResetRepository");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

  const secret = process.env.JWT_SECRET;

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
    const secret = process.env.JWT_SECRET;
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

async function sendResetPasswordEmail(email) {;
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();

  const user = await userRepository.findByEmail(email);

  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");

  await passwordResetRepository.create({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30)
  });

  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS
  //   },
  //   tls: {
  //     rejectUnauthorized: false
  //   }
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "Redefinição de senha",
    html: `
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique no link abaixo:</p>
      <a href="${link}">${link}</a>
    `
  });
}

async function resetPassword(token, newPassword) {
  if (!token) throw new InvalidTokenError();

  if (newPassword.length < 8 || newPassword.length > 20) {
    throw new InvalidPasswordError();
  }

  const record = await passwordResetRepository.findByToken(token);

  if (!record) {
    throw new InvalidTokenError();
  }

  if (record.expiresAt < new Date()) {
    throw new ExpiredTokenError();
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(record.userId, hashedPassword);

  await passwordResetRepository.deleteByToken(token);
}


module.exports = { createUser, login, resetPassword, sendResetPasswordEmail };

