/**
 * Aru
 * Find Between
 */

// Find the betweens of two characters in a string
// Example: ./events/error.js returns error

module.exports = (string, firstChar, lastChar) => {
  let firstCharPos = 0;
  let lastCharPos = 0;

  for (let i = 0; i < string.length; i++) { // Iterate through each letter
    if (string[i] === firstChar) {
      firstCharPos = i;
    }
    if (string[i] === lastChar) {
      lastCharPos = i;
    }
  }

  return string.substr(firstCharPos + 1, lastCharPos - firstCharPos - 1); // Return the betweens of two character
};
