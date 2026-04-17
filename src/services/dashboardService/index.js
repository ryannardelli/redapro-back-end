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

async function getRecentEssays(userId, limit = 5) {
  return await essayRepository.findRecentByUser(userId, limit);
}

async function getReviewerStats(reviewerId) {
  if (!reviewerId) throw new UserNotFoundError();

  const totalReviewed = await essayRepository.countByReviewer(reviewerId);

  const avgResult = await essayRepository.averageScoreByReviewer(reviewerId);

  const lastReviewed = await essayRepository.lastEssayByReviewer(reviewerId);

  const pending = await essayRepository.countByReviewerAndStatus(
    reviewerId,
    "PENDENTE"
  );

  const corrected = await essayRepository.countByReviewerAndStatus(
    reviewerId,
    "CORRIGIDA"
  );

  return {
    totalReviewed,
    pending,
    corrected,
    averageScore: Math.round(avgResult?.avgScore || 0),
    lastReviewed: lastReviewed?.updatedAt || null
  };
}

async function getRecentReviewedEssays(reviewerId, limit = 5) {
  return await essayRepository.findRecentByReviewer(reviewerId, limit);
}

module.exports = { getStudentStats, getRecentEssays, getReviewerStats, getRecentReviewedEssays };