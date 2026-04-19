const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendEssayCorrectedEmail(userEmail, essay) {
  await transporter.sendMail({
    to: userEmail,
    subject: "Sua redação foi corrigida!",
    html: `
      <p>Sua redação "${essay.title}" foi corrigida.</p>
    `
  });
}

async function sendResetPasswordEmail(to, link) {
  await transporter.sendMail({
    to,
    subject: "Redefinição de senha",
    html: `
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique no link abaixo:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

module.exports = { sendEssayCorrectedEmail, sendResetPasswordEmail, sendEssayInReviewEmail };