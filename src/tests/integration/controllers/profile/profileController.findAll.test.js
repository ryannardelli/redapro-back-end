const request = require('supertest');
const app = require('../../../../app');
const profileService = require('../../../../services/profileService');
const jwt = require('jsonwebtoken');

jest.mock('../../../../services/profileService', () => ({
    getAllProfile: jest.fn()
}));

describe('GET /profile/findAll', () => {
    let token;

    beforeEach(() => {
        token = jwt.sign(
          { id: 1, role: 'admin' },
          process.env.SECRET,
          { expiresIn: '1h' }
        );
    });

    it('deve retornar lista de perfis', async () => {
        profileService.getAllProfile.mockResolvedValue([
            { id: 1, name: "Administrador" },
            { id: 2, name: "Estudante" },
            { id: 3, name: "Corretor" },
    ]);
        const res = await request(app).get('/profile/findAll').set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
        expect(res.body[0]).toHaveProperty('name', 'Administrador');
    });

    it('deve retornar um array vazio', async() => {
        profileService.getAllProfile.mockResolvedValue([]);

        const res = await request(app).get('/profile/findAll').set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    })
});
