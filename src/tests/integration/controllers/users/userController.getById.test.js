const request = require('supertest');
const app = require('../../../../app');
const userService = require('../../../../services/userService');
const jwt = require('jsonwebtoken');
const UserNotFoundError = require('../../../../exceptions/domain/auth/UserNotFoundError');

jest.mock('../../../../services/userService', () => ({
  getUserById: jest.fn(),
}));

describe('GET /users/:id', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign(
      { id: 1, role: 'admin' },
      process.env.SECRET,
      { expiresIn: '1h' }
    );
  });

  it('deve retornar um usuário existente', async () => {
    userService.getUserById.mockResolvedValue({
      id: 1,
      name: 'Ryan',
      email: 'ryan@email.com',
      role: 'admin',
    });

    const res = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('name', 'Ryan');
  });

  it('deve retornar erro se usuário não existir', async () => {
    userService.getUserById.mockRejectedValue(new UserNotFoundError());

    const res = await request(app)
      .get('/users/999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('deve retornar erro se o token não for fornecido', async () => {
    const res = await request(app).get('/users/1');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Acesso negado! Usuário não está autorizado para acessar esse recurso.'
    );
  });

  it('deve retornar erro se o token for inválido', async () => {
    const res = await request(app)
      .get('/users/1')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Token inválido ou expirado.');
  });
});
