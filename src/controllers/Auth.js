const authService = require("../services/authService");

async function create(req, res, next) {
  try {
    const result = await authService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.status(200).json(result);
  } catch(e) {
    next(e);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    await authService.sendResetPasswordEmailFlow(email);

    res.status(200).json({
      message: "Se o e-mail existir, enviaremos instruções para redefinição de senha."
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      message: "Senha redefinida com sucesso"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, login, forgotPassword, resetPassword}
