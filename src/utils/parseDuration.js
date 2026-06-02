const ms = require('ms');

/**
 * Parse a human-readable duration string into milliseconds.
 * Supports: 30s, 5m, 2h, 7d, 1w, etc.
 *
 * @param {string|null} input - Duration string (e.g., "1h", "7d", "30m")
 * @returns {{ ms: number, human: string } | null} - Parsed result or null if permanent/invalid
 */
function parseDuration(input) {
  if (!input || input.toLowerCase() === 'permanent' || input.toLowerCase() === 'perm') {
    return null; // Permanent
  }

  const milliseconds = ms(input);

  if (!milliseconds || milliseconds <= 0) {
    return null;
  }

  return {
    ms: milliseconds,
    human: formatDuration(milliseconds)
  };
}

/**
 * Format milliseconds into a human-readable string.
 * @param {number} milliseconds
 * @returns {string}
 */
function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0 && days === 0 && hours === 0) parts.push(`${seconds % 60}s`);

  return parts.join(' ') || '0s';
}

module.exports = { parseDuration, formatDuration };
