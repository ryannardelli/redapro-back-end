const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");
const essayRepository = require('../../repositories/essayRepository');

async function getStudentStats(userId) {

    if (!userId) throw new UserNotFoundError();

    const totalEssays = await essayRepository.countByUser(userId);

    const avgResult = await essayRepository.averageScoreByUser(userId);

    const lastEssay = await essayRepository.lastEssayByUser(userId);

    return {
        totalEssays,
        averageScore: Math.round(avgResult?.avgScore || 0),
        lastEssay: lastEssay?.createdAt || null
    };
}

module.exports = { getStudentStats };