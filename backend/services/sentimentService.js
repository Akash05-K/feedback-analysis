const Sentiment = require('sentiment');
const sentimentAnalyzer = new Sentiment();
/**
 * Converts a raw numeric AFINN score into a Positive/Neutral/Negative label.
 */
const scoreToLabel = (score) => {
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
};

const analyzeSentiment = (sentence) => {
  if (!sentence || typeof sentence !== 'string') {
    return { sentiment: 'Neutral', score: 0 };
  }

  const result = sentimentAnalyzer.analyze(sentence);

  return {
    sentiment: scoreToLabel(result.score),
    score: result.score,
  };
};

module.exports = { analyzeSentiment };