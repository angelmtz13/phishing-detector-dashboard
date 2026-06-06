/**
 * historyService.js
 * Manages analysis history persistence via localStorage.
 */

const STORAGE_KEY = 'phishing_analysis_history';
const MAX_ENTRIES = 50;

/**
 * Get all analysis history from localStorage.
 * @returns {Array} Array of analysis results
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new analysis result to history.
 * @param {object} result - The analysis result
 * @param {string} inputText - The original input text
 * @param {'email'|'url'} inputType - The input type
 * @returns {object} The saved entry with metadata
 */
export function saveAnalysis(result, inputText, inputType) {
  const history = getHistory();

  const entry = {
    id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    inputType,
    inputPreview: inputText.length > 120 ? inputText.substring(0, 120) + '...' : inputText,
    riskLevel: result.riskLevel,
    riskScore: result.riskScore,
    result,
  };

  // Add to beginning (newest first), cap at MAX_ENTRIES
  history.unshift(entry);
  if (history.length > MAX_ENTRIES) {
    history.length = MAX_ENTRIES;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage might be full; remove oldest entries and retry
    history.length = Math.floor(MAX_ENTRIES / 2);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  return entry;
}

/**
 * Delete a specific entry by ID.
 * @param {string} entryId - The entry ID to remove
 */
export function deleteEntry(entryId) {
  const history = getHistory().filter(entry => entry.id !== entryId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Clear all analysis history.
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
