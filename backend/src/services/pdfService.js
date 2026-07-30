const pdfParse = require('pdf-parse');
const ApiError = require('../utils/ApiError');

// Fixed function name typo: extractText (with a 'c')
async function extractText(buffer) {
  try {
    // pdf-parse is a function that takes the buffer directly
    const result = await pdfParse(buffer);

    const text = (result.text || '').trim();
    if (!text || text.length < 50) {
      throw ApiError.badRequest(
        'Could not extract readable text - is this a scanned/image-only PDF?'
      );
    }

    return {
      text,
      meta: {
        numPages: result.numpages ?? null,
      },
    };
  } catch (err) {
    if (err.isOperational) throw err;
    throw ApiError.badRequest('Failed to parse PDF: ' + err.message);
  }
}

module.exports = { extractText };