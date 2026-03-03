const EssayAlreadyExistsError = require('../../exceptions/domain/essay/EssayAlreadyExistsError');
const EssayCategoryNotFoundError = require('../../exceptions/domain/essay/EssayCategoryNotFoundError');
const UserNotFoundError = require('../../exceptions/domain/auth/UserNotFoundError');
const EssayForbiddenError = require('../../exceptions/domain/essay/EssayForbiddenError');
const EssayNoteNotAllowedError = require('../../exceptions/domain/essay/EssayNoteNotAllowedError');
const EssayNotFoundError = require('../../exceptions/domain/essay/EssayNotFoundError');
const EssayUpdateNotAllowedError = require('../../exceptions/domain/essay/EssayUpdateAllowedError');
const EssayValidationContentError = require('../../exceptions/domain/essay/EssayValidationContentError');
const EssayValidationTitleError = require('../../exceptions/domain/essay/EssayValidationTitleError');
const essayRepository = require('../../repositories/essayRepository');
const categoryRepository = require('../../repositories/categoryRepository');
const userRepository = require('../../repositories/userRepository');
const InvalidCompetenceError = require('../../exceptions/domain/essay/InvalidCompetenceError');
const AISubmissionLimitError = require('../../exceptions/domain/essay/AISubmissionLimitError');
const { generateWithOpenAI } = require('../openAIService');

async function getAllEssay(filters = {}) {
    return essayRepository.findAll(filters);
}

async function getEssayById(id) {
    const essay = await essayRepository.findById(id);
    if(!essay) throw new EssayNotFoundError();
    return essay;
}

async function getEssayByUser(userId) {
    const user = await essayRepository.findByWithUsers(userId);

    if (!user) throw new UserNotFoundError();

    return user.essay;
}

async function createEssay(data, userId) {
    // Validar categoria
    const category = await categoryRepository.findById(data.category_id);
    const user = await userRepository.findById(userId);
    if (!category) {
        throw new EssayCategoryNotFoundError();
    }

    if(!user) {
        throw new UserNotFoundError();
    }

    // Evitar duplicidade (title + user + category)
    const existing = await essayRepository.findByTitle(
        data.title,
        userId,
        data.category_id
    );

    if (existing) {
        throw new EssayAlreadyExistsError(data.title);
    }

    if (!data.title || data.title.trim().length < 5 || data.title.trim().length > 50) {
        throw new EssayValidationTitleError();
    }

    if (!data.content || data.content.trim().length < 1000 || data.content.trim().length > 5000) {
        throw new EssayValidationContentError();
    }
    if (data.note !== undefined && data.note !== null) {
        throw new EssayNoteNotAllowedError();
    }

    return essayRepository.create({
        title: data.title.trim(),
        content: data.content.trim(),
        categoryId: data.category_id,
        userId: userId,
        status: "PENDENTE",
        note: null
    });
}

async function updateEssay(essayId, updateDto, userId) {

    // Buscar redação
    const essay = await essayRepository.findById(essayId);
    if (!essay) {
        throw new EssayNotFoundError();
    }

    // Garantir que o usuário é o dono
    if (essay.userId !== userId) {
        throw new EssayForbiddenError();
    }

    // Bloquear edição se não estiver pendente
    if (essay.status !== "PENDENTE") {
        throw new EssayUpdateNotAllowedError();
    }

    const updateData = {};

    if (updateDto.title !== undefined) {
        if (updateDto.title.trim().length < 5 || updateDto.title.trim().length > 50) {
            throw new EssayValidationTitleError();
        }
        updateData.title = updateDto.title.trim();
    }

    if (updateDto.content !== undefined) {
        if (updateDto.content.trim().length < 1000 || updateDto.content.trim().length > 5000) {
            throw new EssayValidationContentError();
        }
        updateData.content = updateDto.content.trim();
    }

    if (updateDto.category_id !== undefined) {
        const category = await categoryRepository.findById(updateDto.category_id);
        if (!category) {
            throw new EssayCategoryNotFoundError();
        }
        updateData.category_id = updateDto.category_id;
    }

    await essayRepository.update(essay, updateData);
}

async function deleteEssay(id) {
    const essay = await getEssayById(id);
    if(!essay) throw new EssayNotFoundError();

    await essay.destroy();
     return { message: "Redação excluída com sucesso!" };
};

async function startReview(essayId, reviewerId) {
    const essay = await essayRepository.findById(essayId);

    if(!essay) throw new EssayNotFoundError();

    if(essay.status !== "PENDENTE") {
        throw new EssayUpdateNotAllowedError();
    }

    essay.status = "EM_CORRECAO";
    essay.reviewerId = reviewerId;
    
    await essay.save();

    return essay;
}

async function finishReview(essayId, reviewerId, data) {
    const essay = await essayRepository.findById(essayId);

    if(!essay) throw new EssayNotFoundError();
    if(essay.reviewerId !== reviewerId) throw new EssayForbiddenError();
    if(essay.status !== "EM_CORRECAO") throw new EssayUpdateNotAllowedError();

    const competencies = ["c1", "c2", "c3", "c4", "c5"];
    for (let c of competencies) {
        if (data[c] !== undefined && (data[c] < 0 || data[c] > 200)) {
            throw new InvalidCompetenceError(`Nota da competência ${c} inválida.`);
        }
    }

    essay.c1 = data.c1;
    essay.c2 = data.c2;
    essay.c3 = data.c3;
    essay.c4 = data.c4;
    essay.c5 = data.c5;

     essay.note = [essay.c1, essay.c2, essay.c3, essay.c4, essay.c5]
        .reduce((acc, val) => acc + (val || 0), 0);

    essay.generalFeedback = data.generalFeedback; 

    essay.status = "CORRIGIDA"

    await essay.save();

    return essay;
}

async function correctEssayWithAI(userId, essayId) {
  const essay = await essayRepository.findById(essayId);
  if (!essay) throw new EssayNotFoundError();

  if (essay.status !== "PENDENTE") {
    throw new EssayUpdateNotAllowedError();
  }

  // Limite semanal
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const aiCorrectionsLastWeek = await essayRepository.count({
    reviewerId: null,
    userId,
    status: "CORRIGIDA",
    updatedAt: oneWeekAgo
  });

  if (aiCorrectionsLastWeek >= 30) {
    throw new AISubmissionLimitError();
  }

  essay.status = "EM_CORRECAO";
  await essay.save();

  const prompt = `
Avalie a seguinte redação do usuário:

Título: ${essay.title}

Conteúdo:
${essay.content}

Avalie em 5 competências (C1 a C5), cada uma de 0 a 200 pontos.
Forneça também um feedback geral resumido (2-3 frases).

Retorne um JSON exatamente neste formato:
{
  "c1": number,
  "c2": number,
  "c3": number,
  "c4": number,
  "c5": number,
  "generalFeedback": string
}
`;

  const responseText = await generateWithOpenAI(prompt);

  let aiResult;
  try {
    aiResult = JSON.parse(responseText);
  } catch {
    throw new Error("Resposta da IA inválida ou não está em JSON.");
  }

  const competencies = ["c1", "c2", "c3", "c4", "c5"];
  for (const c of competencies) {
    if (
      typeof aiResult[c] !== "number" ||
      aiResult[c] < 0 ||
      aiResult[c] > 200
    ) {
      throw new InvalidCompetenceError(`Nota da competência ${c} inválida.`);
    }
  }

  essay.c1 = aiResult.c1;
  essay.c2 = aiResult.c2;
  essay.c3 = aiResult.c3;
  essay.c4 = aiResult.c4;
  essay.c5 = aiResult.c5;

  essay.note =
    essay.c1 + essay.c2 + essay.c3 + essay.c4 + essay.c5;

  essay.generalFeedback = aiResult.generalFeedback;
  essay.status = "CORRIGIDA";

  await essay.save();

  return essay;
}

module.exports = { getAllEssay, getEssayById, updateEssay, createEssay, deleteEssay, getEssayByUser, startReview, finishReview, correctEssayWithAI };
