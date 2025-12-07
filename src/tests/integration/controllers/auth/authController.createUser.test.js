const request = require("supertest");
const app = require("../../../../app");
const authService = require("../../../../services/authService");

const InvalidEmailError = require("../../../../exceptions/domain/auth/InvalidEmailError");
const EmailAlreadyExistsError = require("../../../../exceptions/domain/auth/EmailAlreadyExistsError");
const InvalidNameError = require("../../../../exceptions/domain/auth/InvalidNameError");
const InvalidPasswordError = require("../../../../exceptions/domain/auth/InvalidPasswordError ");

jest.mock("../../../../services/authService");

describe("POST /auth/register", () => {
  it("deve criar usuário com sucesso", async () => {
    authService.createUser.mockResolvedValue({ id: 1, name: "Ryan", email: "r@test.com" });

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Ryan", email: "r@test.com", password: "12345678" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuário criado com sucesso!");
  });

  it("deve retornar erro de nome inválido", async () => {
    authService.createUser.mockRejectedValue(new InvalidNameError());

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "R", email: "r@test.com", password: "12345678" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "O nome precisa ter pelo menos 2 letras e no máximo 100.");
  });

  it("deve retornar erro de email inválido", async () => {
    authService.createUser.mockRejectedValue(new InvalidEmailError());

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Ryan", email: "email-invalido", password: "12345678" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "O e-mail deve ser válido");
  });

  it("deve retornar erro de senha inválida", async () => {
    authService.createUser.mockRejectedValue(new InvalidPasswordError());

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Ryan", email: "r@test.com", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "A senha deve ter entre 8 e 20 caracters.");
  });

  it("deve retornar erro se email já existe", async () => {
    authService.createUser.mockRejectedValue(new EmailAlreadyExistsError());

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Ryan", email: "r@test.com", password: "12345678" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "O e-mail informado já existe no sistema.");
  });
});