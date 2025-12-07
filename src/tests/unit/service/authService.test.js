const authService = require("../../../services/authService");

const User = require("../../../models/User");

const InvalidEmailError = require("../../../exceptions/domain/auth/InvalidEmailError");
const EmailAlreadyExistsError = require("../../../exceptions/domain/auth/EmailAlreadyExistsError");
const InvalidNameError = require("../../../exceptions/domain/auth/InvalidNameError");
const InvalidPasswordError = require("../../../exceptions/domain/auth/InvalidPasswordError ");

jest.mock("../../../models/User");

describe("AuthService - createUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("deve criar usuário com sucesso", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, name: "Ryan", email: "r@test.com", password: "12345678" });

    const user = await authService.createUser({ name: "Ryan", email: "r@test.com", password: "12345678" });
    expect(user).toHaveProperty("id");
    expect(user.name).toBe("Ryan");
  });

  it("deve lançar InvalidNameError para nome inválido", async () => {
    await expect(authService.createUser({ name: "R", email: "r@test.com", password: "12345678" }))
      .rejects.toThrow(InvalidNameError);
  });

  it("deve lançar InvalidEmailError para email inválido", async () => {
    await expect(authService.createUser({ name: "Ryan", email: "email-invalido", password: "12345678" }))
      .rejects.toThrow(InvalidEmailError);
  });

  it("deve lançar EmailAlreadyExistsError se email já existe", async () => {
    User.findOne.mockResolvedValue({ id: 1, email: "r@test.com" });
    await expect(authService.createUser({ name: "Ryan", email: "r@test.com", password: "12345678" }))
      .rejects.toThrow(EmailAlreadyExistsError);
  });

  it("deve lançar InvalidPasswordError se senha inválida", async () => {
    await expect(authService.createUser({ name: "Ryan", email: "r@test.com", password: "123" }))
      .rejects.toThrow(InvalidPasswordError);
  });
});