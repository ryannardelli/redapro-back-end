const request = require('supertest');
const app = require('../../../../app');
const userService = require('../../../../services/userService');
const jwt = require('jsonwebtoken');
const UserNotFoundError = require('../../../../exceptions/domain/auth/UserNotFoundError');

jest.mock('../../../../services/userService', () => ({
  deleteUser: jest.fn(),
}));

describe('DELETE /users/:id', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
  });

  it('deve deletar um usuário', async () => {
    userService.deleteUser.mockResolvedValue({ message: 'Usuário excluído com sucesso!' });

    const res = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Usuário excluído com sucesso!');
  });

  it('deve retornar erro se usuário não existir', async () => {
    userService.deleteUser.mockRejectedValue(new UserNotFoundError());

    const res = await request(app)
      .delete('/users/999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('deve retornar erro se token não for fornecido', async () => {
    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(401);
  });

  it('deve retornar erro se token for inválido', async () => {
    const res = await request(app)
      .delete('/users/1')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.status).toBe(400);
  });
});
