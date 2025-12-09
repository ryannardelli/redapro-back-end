const userService = require("../../../../services/userService");

const User = require("../../../../models/User");

describe("UserService.getAllUsers", () => {
    it("deve retornar lista de usuários", async() => {
        jest.spyOn(User, 'findAll').mockResolvedValue([
            { id: 1, name: "Ryan", role: "admin", pictureUrl: "string", createdAt: "string" },
            { id: 2, name: "João", role: "student", pictureUrl: "string", createdAt: "string" }
        ]);

        const result = await userService.getAllUsers();
        expect(result.length).toBe(2);
        expect(result[0].name).toBe("Ryan");
    });

    it("deve retornar um array vazio quando não houver usuários", async() => {
        jest.spyOn(User, 'findAll').mockResolvedValue([]);

        const result = await userService.getAllUsers();
        expect(result).toEqual([]);
    })
})