const profileService = require('../../../../services/profileService');
const Profile = require('../../../../models/Profile');
const ProfileNotFoundError = require('../../../../exceptions/domain/profile/ProfileNotFoundError');

describe("profileService.getProfileById", () => {
    it('deve retornar um perfil existente', async() => {
        jest.spyOn(Profile, 'findByPk').mockResolvedValue({id: 1, name: 'Administrador', description: 'Perfil com permissões completas para gerenciar usuários, configurar sistemas, atribuir funções e supervisionar todas as operações da plataforma.'});

        const profile = await profileService.getProfileById(1);
        expect(profile.id).toBe(1);
    });

    it('deve lançar um erro se o perfil não existe', async() => {
        jest.spyOn(Profile, 'findByPk').mockResolvedValue(null);

        await expect(profileService.getProfileById(999))
        .rejects.toThrow(ProfileNotFoundError);
    })
})