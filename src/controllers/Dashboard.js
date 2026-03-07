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

module.exports = { getStudentStats, getRecentEssays };