jest.mock('../../../../models/Profile', () => ({
  findByPk: jest.fn(),
  findOne: jest.fn()
}));

const profileService = require('../../../../services/profileService');
const Profile = require('../../../../models/Profile');
const ProfileNotFoundError = require('../../../../exceptions/domain/profile/ProfileNotFoundError');

describe('profileService - updateProfile', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar um perfil corretamente', async () => {
    const mockProfile = {
      id: 1,
      name: 'Estudante',
      description: 'Perfil com acesso para submeter redações...',
      update: jest.fn().mockResolvedValue(),
      get: jest.fn().mockReturnValue({
        id: 1,
        name: 'Estudante teste',
        description: 'Descrição teste'
      })
    };

    Profile.findByPk.mockResolvedValue(mockProfile);

    const dto = {
      id: 1,
      name: 'Estudante teste',
      description: 'Descrição teste'
    };

    const result = await profileService.updateProfile(dto);

    expect(Profile.findByPk).toHaveBeenCalledWith(1);

    expect(mockProfile.update).toHaveBeenCalledWith({
      name: 'Estudante teste',
      description: 'Descrição teste'
    });

    expect(result).toEqual({
      id: 1,
      name: 'Estudante teste',
      description: 'Descrição teste'
    });
  });

  it('deve lançar erro se perfil não existe', async () => {
    Profile.findByPk.mockResolvedValue(null);

    await expect(
      profileService.updateProfile({ id: 999, name: 'Moderador' })
    ).rejects.toThrow(ProfileNotFoundError);

    expect(Profile.findByPk).toHaveBeenCalledWith(999);
  });
});
