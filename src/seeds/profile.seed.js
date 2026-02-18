const Profile = require('../models/Profile');

async function seedProfiles() {
  const profiles = [
    {
        name: "Administrador",
        description: "Possui acesso total ao sistema, incluindo gerenciamento de usuários, permissões, configurações e conteúdo.",
        system: true
    },
    {
        name: "Corretor",
        description: "Responsável pela correção, avaliação e feedback de conteúdos enviados pelos estudantes.",
        system: true
    },
    {
        name: "Estudante",
        description: "Usuário final do sistema, com acesso a conteúdos, atividades e acompanhamento do próprio desempenho.",
        system: true
    }
  ];

  for (const profile of profiles) {
    await Profile.findOrCreate({
      where: { name: profile.name },
      defaults: profile
    });
  }
}

module.exports = seedProfiles;