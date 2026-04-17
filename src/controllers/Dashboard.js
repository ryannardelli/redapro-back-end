const { toReviewerStatsDto } = require("../dtos/dashboard/toReviewerStatsDto");
const { toStudentStatsDto } = require("../dtos/dashboard/toStudentStatsDto");
const { toEssayDto } = require('../dtos/essay/toEssayDto');
const dashboardService = require("../services/dashboardService");

async function getStudentStats(req, res, next) {
    try {
        const userId = req.user.id;

        const stats = await dashboardService.getStudentStats(userId);

        return res.status(200).json(toStudentStatsDto(stats));

    } catch (err) {
        next(err);
    }
}

async function getRecentEssays(req, res, next) {
  try {
    const userId = req.user.id;

    const essays = await dashboardService.getRecentEssays(userId, 5);

    return res.status(200).json(essays.map(toEssayDto));
  } catch (err) {
    next(err);
  }
}

async function getReviewerStats(req, res, next) {
  try {
    const reviewerId = req.user.id;

    const stats = await dashboardService.getReviewerStats(reviewerId);

    return res.status(200).json(toReviewerStatsDto(stats));
  } catch (err) {
    next(err);
  }
}

async function getRecentReviewedEssays(req, res, next) {
  try {
    const reviewerId = req.user.id;

    const essays = await dashboardService.getRecentReviewedEssays(
      reviewerId,
      5
    );

    return res.status(200).json(essays.map(toEssayDto));
  } catch (err) {
    next(err);
  }
}

module.exports = { getStudentStats, getRecentEssays, getReviewerStats, getRecentReviewedEssays };