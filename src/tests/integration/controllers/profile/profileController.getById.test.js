jest.mock('../../../../services/profileService', () => ({
  getProfileById: jest.fn()
}));

const request = require('supertest');
const app = require('../../../../app');
const profileService = require('../../../../services/profileService');
const jwt = require('jsonwebtoken');
const ProfileNotFoundError = require('../../../../exceptions/domain/profile/ProfileNotFoundError');

describe('GET /profile/:id', () => {
    let token;
    
      beforeEach(() => {
        token = jwt.sign(
          { id: 1, role: 'admin' },
          process.env.SECRET,
          { expiresIn: '1h' }
        );
      });

      it('deve retornar um perfil existente', async() => {
        profileService.getProfileById.mockResolvedValue({
            id: 1, name: "Estudante", description: "Perfil com acesso para submeter redações, visualizar correções e feedbacks, além de acessar recursos educativos.",
        });

        const res = await request(app).get('/profile/1').set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Estudante');
      });

      it('deve retornar erro se perfil não existir', async() => {
        profileService.getProfileById.mockRejectedValue(new ProfileNotFoundError());

        const res = await request(app)
        .get('/profile/999')
        .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
      });

      it('deve retornar erro se o token não for fornecido', async () => {
        const res = await request(app).get('/profile/1');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty(
        'message',
        'Acesso negado! Usuário não está autorizado para acessar esse recurso.'
        );
  });

  it('deve retornar erro se o token for inválido', async () => {
    const res = await request(app)
      .get('/profile/1')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Token inválido ou expirado.');
  });
})