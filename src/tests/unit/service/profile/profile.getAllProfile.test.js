jest.mock('../../../../models/Profile', () => ({
  findAll: jest.fn(),
}));

const profileService = require('../../../../services/profileService');
const Profile = require('../../../../models/Profile');

describe("ProfileService.getAllProfile", () => {
    it("deve retornar lista de perfis", async() => {
        jest.spyOn(Profile, 'findAll').mockResolvedValue([
            { id: 1, name: "Administrador", description: "Perfil com permissões completas para gerenciar usuários, configurar sistemas, atribuir funções e supervisionar todas as operações da plataforma." },
            { id: 2, name: "Estudante", description: "Perfil com acesso para submeter redações, visualizar correções e feedbacks, além de acessar recursos educativos." },
            { id: 3, name: "Corretor", description: "Perfil com permissões para corrigir redações, atribuir notas e fornecer feedback detalhado aos estudantes." },
        ]);

        const result = await profileService.getAllProfile();
        expect(result.length).toBe(3);
        expect(result[0].name).toBe('Administrador');
    })
})