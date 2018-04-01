/**
 * Aru
 * Array Joiner
 */

// Joins array into single string with spaces in between
// Example: ['car', 'cheese'] returns 'car cheese'

module.exports = (array) => {
  let string = '';
  for (let element of array) {
    string += element;
    string += ' ';
  }
  return string.trim();
};
