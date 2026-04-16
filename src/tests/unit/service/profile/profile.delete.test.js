const profileService = require('../../../../services/profileService');
const Profile = require('../../../../models/Profile');
const ProfileNotFoundError = require('../../../../exceptions/domain/profile/ProfileNotFoundError');

describe('profileService.deleteProfile', () => {
    it('deve excluir um perfil existente', async() => {
        const mockProfile = {
            destroy: jest.fn().mockResolvedValue(),
        };

        jest.spyOn(Profile, 'findByPk').mockResolvedValue(mockProfile);

        const result = await profileService.deleteProfile(1);

        expect(mockProfile.destroy).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Perfil excluído com sucesso!' });
    });

    it('deve lançar erro quando perfil não existe', async() => {
        jest.spyOn(Profile, 'findByPk').mockResolvedValue(null);

        await expect(profileService.deleteProfile(999))
        .rejects.toThrow(ProfileNotFoundError);
    })
})