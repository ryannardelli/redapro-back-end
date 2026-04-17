function toReviewerStatsDto(stats) {
  return {
    totalReviewed: stats.totalReviewed,
    pending: stats.pending,
    corrected: stats.corrected,
    averageScore: stats.averageScore,
    lastReviewed: stats.lastReviewed
  };
}

module.exports = { toReviewerStatsDto };