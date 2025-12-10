const request = require('supertest');
const app = require('../../../../app');
const userService = require('../../../../services/userService');
const jwt = require('jsonwebtoken');

jest.mock('../../../../services/userService', () => ({
  getAllUsers: jest.fn(),
}));

describe('GET /users/findAll', () => {
  let token;

  beforeEach(() => {
    // cria token
    token = jwt.sign(
      { id: 1, role: 'admin' },
      process.env.SECRET,
      { expiresIn: '1h' }
    );
  });

  it('deve retornar lista de usuários', async () => {
    userService.getAllUsers.mockResolvedValue([
      { id: 1, name: 'Ryan', email: 'ryan@email.com' },
      { id: 2, name: 'João', email: 'joao@email.com' },
    ]);

    const res = await request(app)
      .get('/users/findAll')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('name', 'Ryan');
  });

  it('deve retornar um array vazio', async () => {
    userService.getAllUsers.mockResolvedValue([]);

    const res = await request(app)
      .get('/users/findAll')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body).toEqual([]);
  });

  it('deve retornar erro se o token não for fornecido', async() => {
    const res = await request(app).get('/users/findAll');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Acesso negado! Usuário não está autorizado para acessar esse recurso.');
  });

  it('deve retornar erro se o token for inválido', async() => {
     const res = await request(app)
    .get('/users/findAll')
    .set('Authorization', 'Bearer token_invalido');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Token inválido ou expirado.');
  })
});
