// utils/generateSKU.js

function generateSKU({ title = '', category = '' }) {
  const base = (title + category).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Get first 3 chars from base if available
  const prefix = base.slice(0, 3).padEnd(3, 'X');

  // Generate 5 random alphanumeric chars
  const random = Array.from({ length: 5 }, () =>
    Math.random().toString(36).toUpperCase().charAt(2)
  ).join('');

  return `${prefix}${random}`; // 3 (from title/category) + 5 random = 8
}

module.exports = generateSKU;
