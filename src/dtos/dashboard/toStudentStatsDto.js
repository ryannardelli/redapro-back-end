function toStudentStatsDto(stats) {
  return {
    totalEssays: stats.totalEssays,
    averageScore: stats.averageScore,
    lastEssay: stats.lastEssay
  };
}

module.exports = { toStudentStatsDto };