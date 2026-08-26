export const reciprocalRankFusion = (rankedLists, k = 60) => {
  const scores = {};

  for (const list of rankedLists) {
    list.forEach((item, index) => {
      const rank = index + 1;
      const rrfScore = 1 / (k + rank);
      scores[item.productId] = (scores[item.productId] || 0) + rrfScore;
    });
  }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([productId, score]) => ({ productId, score }));
};