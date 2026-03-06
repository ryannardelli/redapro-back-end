const { toStudentStatsDto } = require("../dtos/dashboard/toStudentStatsDto");
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

module.exports = { getStudentStats };