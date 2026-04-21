const EssayAlreadyExistsError = require('../../exceptions/domain/essay/EssayAlreadyExistsError');
const EssayCategoryNotFoundError = require('../../exceptions/domain/essay/EssayCategoryNotFoundError');
const UserNotFoundError = require('../../exceptions/domain/auth/UserNotFoundError');
const EssayForbiddenError = require('../../exceptions/domain/essay/EssayForbiddenError');
const EssayNoteNotAllowedError = require('../../exceptions/domain/essay/EssayNoteNotAllowedError');
const EssayNotFoundError = require('../../exceptions/domain/essay/EssayNotFoundError');
const EssayUpdateNotAllowedError = require('../../exceptions/domain/essay/EssayUpdateAllowedError');
const EssayValidationContentError = require('../../exceptions/domain/essay/EssayValidationContentError');
const EssayValidationTitleError = require('../../exceptions/domain/essay/EssayValidationTitleError');
const EssayAiCorrectionNotAllowedError = require('../../exceptions/domain/essay/EssayAiCorrectionNotAllowedError');
const EssayDeletionNotAllowedError = require('../../exceptions/domain/essay/EssayDeletionNotAllowedError');
const InvalidCompetenceError = require('../../exceptions/domain/essay/InvalidCompetenceError');
const AISubmissionLimitError = require('../../exceptions/domain/essay/AISubmissionLimitError');
const FileNotProvided = require('../../exceptions/common/FileNotProvided');

const essayRepository = require('../../repositories/essayRepository');
const categoryRepository = require('../../repositories/categoryRepository');
const userRepository = require('../../repositories/userRepository');

const { generateWithOpenAI } = require('../openAIService');
const { sendEssayCorrectedEmail } = require('../emailService');

const cloudinary = require("../../config/cloudinary");

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

    const user = await userRepository.findById(essay.userId);

    if (user?.email) {
        await sendEssayCorrectedEmail(user.email, essay);
    }

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
Você é um CORRETOR OFICIAL DO ENEM EXTREMAMENTE RIGOROSO, com padrão equivalente a banca real.

Sua função é avaliar tecnicamente a redação, atribuir notas JUSTAS e gerar um feedback profundo, específico e crítico.

Você NÃO deve ser generoso. Você deve ser preciso, técnico e exigente.

---

## 📊 ÂNCORA DE NOTA (OBRIGATÓRIA E ABSOLUTA)

Use esta escala como base rígida de calibração:

600 ou menos:
- texto incompleto ou muito curto
- sem estrutura clara
- sem desenvolvimento real
- proposta inexistente ou extremamente vaga

700–780:
- estrutura mínima
- 1 argumento simples
- repertório genérico ou superficial
- coesão fraca

800–860:
- estrutura completa (introdução, desenvolvimento e conclusão)
- 1 ou 2 argumentos básicos
- proposta de intervenção presente mas genérica ou pouco detalhada
- repertório superficial

880–920:
- bons argumentos com desenvolvimento
- repertório pertinente ao tema
- boa coesão textual
- proposta completa (agente, ação, meio, finalidade, detalhamento)

930–1000:
- argumentação profunda e consistente
- repertório produtivo e bem aplicado
- excelente progressão textual
- intervenção detalhada, específica e bem articulada

---

## ⚠️ REGRAS ABSOLUTAS

- O tema abordado NÃO aumenta nota sozinho
- Relevância do tema NÃO significa qualidade
- Nota depende de profundidade, estrutura e desenvolvimento

---

## 📏 ANÁLISE DE TAMANHO

Considere:
- 1 linha ≈ 10 palavras

Limites obrigatórios:
- até 14 linhas → nota máxima 600
- 15 a 19 linhas → nota máxima 760
- 20+ linhas → sem limite

---

## 🧠 METODOLOGIA OBRIGATÓRIA (SEQUÊNCIA FIXA)

Você DEVE seguir exatamente:

1. Ler a redação completa
2. Identificar tese, argumentos e conclusão
3. Avaliar cada competência separadamente
4. Identificar problemas com base em trechos
5. Aplicar notas base por competência
6. Aplicar penalizações obrigatórias
7. Validar limites (nota final)
8. Gerar feedback final crítico

---

## 🧾 REGRA MAIS IMPORTANTE (OBRIGATÓRIA)

Para cada problema encontrado, você DEVE obrigatoriamente fornecer:

- 📌 Trecho exato do texto
- ❌ Problema identificado
- 🧠 Explicação técnica (por que perde ponto no ENEM)
- ✅ Reescrita sugerida (obrigatória)

Proibido feedback genérico.

---

## 📉 PENALIZAÇÕES OBRIGATÓRIAS POR PROFUNDIDADE

Se o texto tiver:

- apenas introdução + desenvolvimento curto + conclusão superficial:
  - C2 máximo 180
  - C3 máximo 160
  - C4 máximo 160

- apenas 1 parágrafo:
  - C3 e C4 máximo 120

- ausência de repertório:
  - C2 máximo 160

---

## 🧮 COMPETÊNCIAS

### C1 – Norma padrão
200: sem erros
160: poucos erros
120: recorrentes
80 ou menos: graves

---

### C2 – Compreensão do tema
200: profunda
160: adequada
120 ou menos: superficial

---

### C3 – Argumentação
200: forte e desenvolvida
160: básica
120: genérica
80: fraca

---

### C4 – Coesão
200: excelente
160: boa
120: repetitiva
80: fraca

---

### C5 – Proposta de intervenção
Obrigatório conter:
- agente
- ação
- meio
- finalidade
- detalhamento

200: completa
160: falta 1 elemento
120: genérica
80: ausente

---

## ⚠️ PENALIZAÇÕES CRÍTICAS

- “governo deve agir” → máximo 120 em C5
- sem agente → máximo 120
- sem detalhamento → máximo 100

---

## ✍️ FORMATO OBRIGATÓRIO POR COMPETÊNCIA

Para cada competência:

- Nota
- Justificativa técnica
- Trecho do texto
- Problemas identificados
- Reescrita sugerida (obrigatória)

---

## 📊 CÁLCULO FINAL

1. Somar C1 a C5 (0 a 1000)
2. Aplicar limites obrigatórios
3. Se ultrapassar limites → reduzir obrigatoriamente

---

## 🧾 FEEDBACK FINAL OBRIGATÓRIO

Forneça:

- Diagnóstico geral do texto
- Principais erros críticos
- 3 melhorias prioritárias
- Sugestão de como chegar a 900+

Sem elogios vazios.

---

## 📥 DADOS

TÍTULO:
${essay.title}

TEXTO:
${essay.content}

---

## 📤 RESPOSTA OBRIGATÓRIA EM JSON

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

async function uploadEssayAttachment(essayId, file) {
  if (!file) {
    throw new FileNotProvided();
  }

  const essay = await essayRepository.findById(essayId);

  if (!essay) {
    throw new EssayNotFoundError();
  }

  if (essay.attachmentPublicId) {
    await cloudinary.uploader.destroy(essay.attachmentPublicId, {
      resource_type: "raw"
    });
  }

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder: "essays/attachments",
      resource_type: "raw"
    }
  );

  essay.attachmentUrl = result.secure_url;
  essay.attachmentPublicId = result.public_id;

  await essayRepository.save(essay);

  return {
    url: result.secure_url,
    publicId: result.public_id
  };
}

module.exports = { getAllEssay, getEssayById, updateEssay, createEssay, deleteEssay, getEssayByUser, startReview, finishReview, correctEssayWithAI, uploadEssayAttachment };
