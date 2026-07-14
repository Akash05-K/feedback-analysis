const keywordDictionary = require('../data/keywordDictionary');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

const detectCategories = (sentence) => {
  if (!sentence || typeof sentence !== 'string') return [];

  const lowerSentence = sentence.toLowerCase();
  const matches = [];

  for (const { category, regex, keywords } of compiledCategoryPatterns) {
    if (regex.test(lowerSentence)) {
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