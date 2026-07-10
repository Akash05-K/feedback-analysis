const XLSX = require('xlsx');

/**
 * The uploded feedback parse and the feedback split in to sentence by /(?<=[.!?])\s+|[.!?]$/
 */
const splitIntoSentences = (text) => {
  if (!text || typeof text !== 'string') return [];

  return text
    .split(/(?<=[.!?])\s+|[.!?]$/) // split after sentence-ending punctuation
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
};

/**
 * Reads an uploaded Excel file buffer and returns normalized row data
 * with feedback already split into sentences.
 */
const parseExcelBuffer = (fileBuffer) => {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('The uploaded Excel file has no sheets');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (rawRows.length === 0) {
    throw new Error('The uploaded Excel file has no data rows');
  }

  const parsedRows = rawRows.map((row, index) => {
    // Support minor header variations (eg. "Student Name" vs "StudentName")
    const studentName = String(
      row['Student Name'] ?? row['StudentName'] ?? row['Student'] ?? ''
    ).trim();
    const teacher = String(row['Teacher'] ?? row['Teacher Name'] ?? '').trim();
    const feedbackText = String(row['Feedback'] ?? row['Feedback Text'] ?? '').trim();

    if (!studentName || !teacher || !feedbackText) {
      throw new Error(
        `Row ${index + 2}: missing required column(s). Expected "Student Name", "Teacher", "Feedback".`
      );
    }

    return {
      studentName,
      teacher,
      feedbackText,
      sentences: splitIntoSentences(feedbackText),
    };
  });

  return parsedRows;
};

module.exports = { parseExcelBuffer, splitIntoSentences };