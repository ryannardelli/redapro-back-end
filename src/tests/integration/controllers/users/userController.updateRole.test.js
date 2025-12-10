const request = require('supertest');
const app = require('../../../../app');
const userService = require('../../../../services/userService');
const jwt = require('jsonwebtoken');
const UserNotFoundError = require('../../../../exceptions/domain/auth/UserNotFoundError');
const IvalidRoleUserError = require('../../../../exceptions/domain/users/InvalidRoleUserError');

jest.mock('../../../../services/userService', () => ({
  updateRole: jest.fn(),
}));

describe('PATCH /users/updateRole', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
  });

  it('deve atualizar a role corretamente', async () => {
    userService.updateRole.mockResolvedValue({ message: 'Permissão atualizada com sucesso!' });

    const res = await request(app)
      .patch('/users/updateRole')
      .set('Authorization', `Bearer ${token}`)
      .send({ idUser: 1, role: 'admin' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Permissão atualizada com sucesso!');
  });

  it('deve retornar erro se usuário não existir', async () => {
    userService.updateRole.mockRejectedValue(new UserNotFoundError());

    const res = await request(app)
      .patch('/users/updateRole')
      .set('Authorization', `Bearer ${token}`)
      .send({ idUser: 999, role: 'admin' });

    expect(res.status).toBe(404);
  });

  it('deve retornar erro se role for inválida', async () => {
    userService.updateRole.mockRejectedValue(new IvalidRoleUserError());

    const res = await request(app)
      .patch('/users/updateRole')
      .set('Authorization', `Bearer ${token}`)
      .send({ idUser: 1, role: 'hacker' });

    expect(res.status).toBe(422);
  });

  it('deve retornar 403 se o usuário não for admin ao atualizar role', async () => {
  const token = jwt.sign(
    { id: 2, role: 'student' },
    process.env.SECRET,
    { expiresIn: '1h' }
  );

  const res = await request(app)
    .patch('/users/updateRole')
    .send({ idUser: 1, role: 'admin' })
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toBe(403);
  expect(res.body).toHaveProperty(
    'message',
    'Acesso negado. Você não tem permissão suficiente para acessar esse recurso.'
  );
});


  it('deve retornar erro se token não for fornecido', async () => {
    const res = await request(app)
      .patch('/users/updateRole')
      .send({ idUser: 1, role: 'admin' });

    expect(res.status).toBe(401);
  });

  it('deve retornar erro se token for inválido', async () => {
    const res = await request(app)
      .patch('/users/updateRole')
      .set('Authorization', 'Bearer token_invalido')
      .send({ idUser: 1, role: 'admin' });

    expect(res.status).toBe(400);
  });
});
