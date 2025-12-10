const userService = require("../../../../services/userService");
const User = require("../../../../models/User");
const UserNotFoundError = require("../../../../exceptions/domain/auth/UserNotFoundError");

describe("userService.getUserById", () => {
    it('deve retornar um usuário existente', async() => {
        jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 1, name: 'Ryan', email: 'ryan@email.com', role: "admin", pictureUrl: "string", createdAt: "string" });

        const user = await userService.getUserById(1);
        expect(user.id).toBe(1);
    });

    it('deve lançar erro se usuário não existe', async() => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);

        await expect(userService.getUserById(999))
        .rejects.toThrow(UserNotFoundError);
    })
})