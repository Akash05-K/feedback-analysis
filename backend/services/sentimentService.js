const Sentiment = require('sentiment');

/**
 * Sentiment Analysis Service
 * using the `sentiment` npm package (AFINN-based lexicon scoring).
 */

const sentimentAnalyzer = new Sentiment();

/**
 * Converts a raw numeric AFINN score into a Positive/Neutral/Negative label.
 * @param {number} score
 * @returns {'Positive'|'Neutral'|'Negative'}
 */
const scoreToLabel = (score) => {
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
};

/**
 * Analyzes the sentiment of a single sentence.
 *
 * @param {string} sentence
 * @returns {{ sentiment: 'Positive'|'Neutral'|'Negative', score: number }}
 */
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