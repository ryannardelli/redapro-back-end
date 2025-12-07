const authService = require("../../../services/authService");
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const InvalidEmailError = require("../../../exceptions/domain/auth/InvalidEmailError");
const UserNotFoundError = require("../../../exceptions/domain/auth/UserNotFoundError");
const InvalidCredentialsError = require("../../../exceptions/domain/auth/InvalidCredentialsError");

jest.mock("../../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService - login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("deve lançar InvalidEmailError para email inválido", async () => {
    await expect(authService.login({ email: "email-invalido", password: "12345678" }))
      .rejects.toThrow(InvalidEmailError);
  });

  it("deve lançar UserNotFoundError se usuário não existir", async () => {
    User.findOne.mockResolvedValue(null);
    await expect(authService.login({ email: "r@test.com", password: "12345678" }))
      .rejects.toThrow(UserNotFoundError);
  });

  it("deve lançar InvalidCredentialsError se senha estiver incorreta", async () => {
    User.findOne.mockResolvedValue({ id: 1, email: "r@test.com", password: "hashedpassword" });
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.login({ email: "r@test.com", password: "senhaerrada" }))
      .rejects.toThrow(InvalidCredentialsError);
  });

  it("deve retornar token JWT para login bem-sucedido", async () => {
    const userMock = { id: 1, email: "r@test.com", password: "hashedpassword" };
    User.findOne.mockResolvedValue(userMock);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mocked-token");

    const result = await authService.login({ email: "r@test.com", password: "12345678" });

    expect(result).toHaveProperty("token", "mocked-token");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: userMock.id, email: userMock.email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
  });
});
