// Dados de teste
const validUser = { name: "Ryan", email: "r@test.com", password: "12345678" };
const invalidEmail = { name: "Ryan", email: "invalid", password: "12345678" };
const shortPassword = { name: "Ryan", email: "r@test.com", password: "123" };

// Funções mock do model
const UserMock = {
  findOne: jest.fn(),   // simula busca no banco
  create: jest.fn()     // simula criação no banco
};

module.exports = {
  validUser,
  invalidEmail,
  shortPassword,
  UserMock
};
