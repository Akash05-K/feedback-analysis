const keywordDictionary = require('../data/keywordDictionary');

/**
 * Keyword Detection Service
 */

/**
 * Escapes special regex characters in a keyword so it can be safely
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Pre-build one regex per category that matches ANY of its keywords,
 * wrapped in word boundaries. Built once when the module loads.
 */
const compiledCategoryPatterns = Object.entries(keywordDictionary).map(
  ([category, keywords]) => {
    const pattern = keywords
      .map((keyword) => `\\b${escapeRegex(keyword.toLowerCase())}\\b`)
      .join('|');

    return {
      category,
      regex: new RegExp(pattern, 'i'),
      keywords, // kept for matchedKeyword lookup below
    };
  }
);

/**
 * Detects all categories present in a single sentence.
 *
 * @param {string} sentence - a single feedback sentence
 * @returns {Array<{ category: string, matchedKeyword: string }>}
 */
const detectCategories = (sentence) => {
  if (!sentence || typeof sentence !== 'string') return [];

  const lowerSentence = sentence.toLowerCase();
  const matches = [];

  for (const { category, regex, keywords } of compiledCategoryPatterns) {
    if (regex.test(lowerSentence)) {
      // Find which specific keyword triggered the match, for transparency/debugging
      const matchedKeyword = keywords.find((keyword) => {
        const singleRegex = new RegExp(`\\b${escapeRegex(keyword.toLowerCase())}\\b`, 'i');
        return singleRegex.test(lowerSentence);
      });

      matches.push({ category, matchedKeyword: matchedKeyword || null });
    }
  }

  return matches;
};

module.exports = { detectCategories };