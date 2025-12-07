const request = require("supertest");
const app = require("../../../../src/app");
const userService = require("../../../../src/services/userService");

const InvalidEmailError = require("../../../exceptions/domain/user/InvalidEmailError");
const EmailAlreadyExistsError = require("../../../exceptions/domain/user/EmailAlreadyExistsError");
const InvalidNameError = require("../../../exceptions/domain/user/InvalidNameError");
const InvalidPasswordError = require("../../../exceptions/domain/user/InvalidPasswordError ");

jest.mock("../../../services/userService");

describe("POST /users", () => {
  it("deve criar usuário com sucesso", async () => {
    userService.createUser.mockResolvedValue({ id: 1, name: "Ryan", email: "r@test.com" });

    const res = await request(app)
      .post("/users")
      .send({ name: "Ryan", email: "r@test.com", password: "12345678" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuário criado com sucesso!");
  });

  it("deve retornar erro de nome inválido", async () => {
    userService.createUser.mockRejectedValue(new InvalidNameError());

    const res = await request(app)
      .post("/users")
      .send({ name: "R", email: "r@test.com", password: "12345678" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "O nome precisa ter pelo menos 2 letras e no máximo 100.");
  });

  it("deve retornar erro de email inválido", async () => {
    userService.createUser.mockRejectedValue(new InvalidEmailError());

    const res = await request(app)
      .post("/users")
      .send({ name: "Ryan", email: "email-invalido", password: "12345678" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "O e-mail deve ser válido");
  });

  it("deve retornar erro de senha inválida", async () => {
    userService.createUser.mockRejectedValue(new InvalidPasswordError());

    const res = await request(app)
      .post("/users")
      .send({ name: "Ryan", email: "r@test.com", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "A senha deve ter entre 8 e 20 caracters.");
  });

  it("deve retornar erro se email já existe", async () => {
    userService.createUser.mockRejectedValue(new EmailAlreadyExistsError());

    const res = await request(app)
      .post("/users")
      .send({ name: "Ryan", email: "r@test.com", password: "12345678" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "O e-mail informado já existe no sistema.");
  });
});