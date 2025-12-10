const userService = require("../../../../services/userService");
const User = require("../../../../models/User");
const UserNotFoundError = require("../../../../exceptions/domain/auth/UserNotFoundError");

describe('userService - updateUser', () => {
    it('deve atualizar um usuário corretamente', async() => {
        const mockUser = {
            id: 1,
            name: 'João',
            update: jest.fn().mockResolvedValue(),
            get: () => ({ id: 1, name: 'Renato' })
        };

        jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

        const dto = { id: 1, name: 'Renato' };
        const result = await userService.updateUser(dto);

        expect(mockUser.update).toHaveBeenCalledWith({ name: 'Renato' });
        expect(result).toEqual({ id: 1, name: 'Renato' });
    });

    it('deve lançar erro se usuário não existe', async() => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);

        await expect(
            userService.updateUser({ id: 999, name: 'Marcos' })

        ).rejects.toThrow(UserNotFoundError);
    })
})