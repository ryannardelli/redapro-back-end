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
const EssayAiCorrectionNotAllowedError = require('../../exceptions/domain/essay/EssayAiCorrectionNotAllowedError');
const EssayDeletionNotAllowedError = require('../../exceptions/domain/essay/EssayDeletionNotAllowedError');

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

    if (!data.title || data.title.trim().length < 5 || data.title.trim().length > 100) {
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

    if(essay.status === "EM_CORRECAO") {
        throw new EssayDeletionNotAllowedError();
    }

    await essay.destroy();
     return { message: "Redação excluída com sucesso!" };
};

async function startReview(essayId, reviewerId) {
    const essay = await essayRepository.findById(essayId);

    if(!essay) throw new EssayNotFoundError();

    if (essay.status === "EM_CORRECAO") {
        return essay;
    }

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

  if (essay.reviewerId) {
    throw new EssayAiCorrectionNotAllowedError();
  }

  if (essay.status !== "PENDENTE") {
    throw new EssayUpdateNotAllowedError();
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const aiCorrectionsLastWeek = await essayRepository.count({
    reviewerId: null,
    userId,
    status: "CORRIGIDA",
    updatedAt: oneWeekAgo
  });

  if (aiCorrectionsLastWeek >= 5) {
    throw new AISubmissionLimitError();
  }

  essay.status = "EM_CORRECAO";
  await essay.save();

  try {

    const prompt = `
        Você é um corretor EXTREMAMENTE RIGOROSO do ENEM.

        Sua correção deve ser CRITERIOSA, PUNITIVA e REALISTA, semelhante à de corretores oficiais.

        NÃO seja generoso. Penalize qualquer falha.

        ---

        ANTES de avaliar:

        - Considere que cada linha tem aproximadamente 10 palavras
        - Estime a quantidade de linhas do texto

        REGRAS OBRIGATÓRIAS DE LIMITE POR TAMANHO:
        - Menos de 15 linhas → nota total MÁXIMA = 600
        - Entre 15 e 19 linhas → nota total MÁXIMA = 760
        - 20 ou mais linhas → sem limite

        ---

        Avalie cada competência de 0 a 200:

        C1 – Norma padrão:
        - 200: nenhum erro
        - 160: poucos erros leves
        - 120: erros recorrentes
        - 80 ou menos: muitos erros

        ---

        C2 – Compreensão do tema:
        - 200: abordagem completa e aprofundada
        - 160: adequada, mas superficial
        - 120 ou menos: tangencia ou incompleta

        PENALIZAÇÃO OBRIGATÓRIA:
        - Ausência de repertório sociocultural → C2 máximo 160
        - Repertório genérico → C2 máximo 180

        ---

        C3 – Argumentação:
        - 200: argumentos consistentes e aprofundados
        - 160: bons, mas pouco desenvolvidos
        - 120: genéricos ou previsíveis
        - 80 ou menos: fracos ou ausentes

        PENALIZAÇÕES:
        - Texto com apenas 1 parágrafo → C3 máximo 120
        - Falta de progressão argumentativa → reduzir fortemente

        ---

        C4 – Coesão:
        - 200: excelente uso de conectivos
        - 160: bom, com pequenas falhas
        - 120: repetição ou pouca variedade
        - 80 ou menos: falhas graves

        PENALIZAÇÕES:
        - Texto com apenas 1 parágrafo → C4 máximo 120
        - Pouca variedade de conectivos → reduzir nota

        ---

        C5 – Proposta de intervenção:

        DEVE conter obrigatoriamente:
        - agente
        - ação
        - meio
        - finalidade
        - detalhamento

        Notas:
        - 200: completa com todos os elementos
        - 160: falta 1 elemento
        - 120: genérica
        - 80 ou menos: incompleta ou ausente

        PENALIZAÇÕES OBRIGATÓRIAS:
        - Proposta genérica (“políticas públicas”) → máximo 120
        - Sem agente claro → máximo 120
        - Sem detalhamento → máximo 100

        ---

        REGRAS ESTRUTURAIS IMPORTANTES:

        - Redação deve ter introdução, desenvolvimento e conclusão
        - Pouco desenvolvimento → reduzir C2 e C3
        - Texto curto → prejudica TODAS as competências

        ---

        Para cada competência:
        - dê a nota
        - explique de forma objetiva
        - cite trechos do texto

        ---

        Após avaliar:

        1. Some todas as competências (0 a 1000)

        2. APLIQUE AS TRAVAS OBRIGATÓRIAS:
        - limite de linhas
        - limite por ausência de repertório
        - limite por estrutura

        3. Se a nota ultrapassar o limite permitido, REDUZA obrigatoriamente

        ---

        Depois:
        - informe a nota final
        - faça um feedback geral CRÍTICO e detalhado
        - NÃO elogie sem justificativa

        ---

        TÍTULO:
        ${essay.title}

        TEXTO:
        ${essay.content}

        ---

        Responda APENAS em JSON:

        {
        "c1": number,
        "c1_feedback": string,
        "c2": number,
        "c2_feedback": string,
        "c3": number,
        "c3_feedback": string,
        "c4": number,
        "c4_feedback": string,
        "c5": number,
        "c5_feedback": string,
        "total": number,
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

    essay.note = essay.c1 + essay.c2 + essay.c3 + essay.c4 + essay.c5;
    essay.generalFeedback = aiResult.generalFeedback;

    essay.status = "CORRIGIDA";

    await essay.save();

    return essay;

  } catch (error) {

    essay.status = "PENDENTE";
    await essay.save();

    throw error;
  }
}

module.exports = { getAllEssay, getEssayById, updateEssay, createEssay, deleteEssay, getEssayByUser, startReview, finishReview, correctEssayWithAI };
