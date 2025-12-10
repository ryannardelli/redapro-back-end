const request = require('supertest');
const app = require('../../../../app');
const userService = require('../../../../services/userService');
const jwt = require('jsonwebtoken');
const UserNotFoundError = require('../../../../exceptions/domain/auth/UserNotFoundError');

jest.mock('../../../../services/userService', () => ({
  updateUser: jest.fn(),
}));

describe('PATCH /users/:id', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
  });

  it('deve atualizar um usuário', async () => {
    userService.updateUser.mockResolvedValue();

    const res = await request(app)
      .patch('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Nome' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuário atualizado com sucesso!');
  });

  it('deve retornar erro se usuário não existir', async () => {
    userService.updateUser.mockRejectedValue(new UserNotFoundError());

    const res = await request(app)
      .patch('/users/999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Nome' });

    expect(res.status).toBe(404);
  });

  it('deve retornar erro se token não for fornecido', async () => {
    const res = await request(app)
      .patch('/users/1')
      .send({ name: 'Novo Nome' });

    expect(res.status).toBe(401);
  });

  it('deve retornar erro se token for inválido', async () => {
    const res = await request(app)
      .patch('/users/1')
      .set('Authorization', 'Bearer token_invalido')
      .send({ name: 'Novo Nome' });

    expect(res.status).toBe(400);
  });
});
