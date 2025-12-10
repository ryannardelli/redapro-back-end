const userService = require('../../../../services/userService');
const User = require('../../../../models/User');
const UserNotFoundError = require('../../../../exceptions/domain/auth/UserNotFoundError');
const InvalidRoleUserError  = require('../../../../exceptions/domain/users/InvalidRoleUserError');

describe('userService - updateRole', () => {
    it('deve atualizar a role corretamente', async() => {
        const mockUser = {
            idUser: 1,
            role: 'student',
            save: jest.fn().mockResolvedValue()
        };

        jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

        const result = await userService.updateRole({ idUser: 1, role: 'admin' });

        expect(mockUser.role).toBe('admin');
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Permissão atualizada com sucesso!' });
    });

    it('deve lançar erro se o usuário não existe', async() => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);

        await expect(
            userService.updateRole({ idUser: 999, role: 'admin' })
        ).rejects.toThrow(UserNotFoundError);
    });

    it('deve lançar erro para role inválida', async() => {
        const mockUser = { save: jest.fn() };
        jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

        await expect(
            userService.updateRole({ idUser: 1, role: 'hacker' })
        ).rejects.toThrow(InvalidRoleUserError);
    })
})
