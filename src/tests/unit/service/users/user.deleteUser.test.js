const userService = require("../../../../services/userService");
const User = require("../../../../models/User");
const UserNotFoundError = require("../../../../exceptions/domain/auth/UserNotFoundError");

describe('userService.deleteUser', () => {
    it('deve excluir usuário existente', async() => {
        const mockUser = {
            destroy: jest.fn().mockResolvedValue()
        };

        jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

        const result = await userService.deleteUser(1);

        expect(mockUser.destroy).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Usuário excluído com sucesso!' });
    });

    it('deve lançar erro quando usuário não existe', async() => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);

        await expect(userService.deleteUser(999))
        .rejects.toThrow(UserNotFoundError);
    })
})