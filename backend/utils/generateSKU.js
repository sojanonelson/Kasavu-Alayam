
function generateSKU({ title = '', category = '' }) {
  const base = (title + category).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const prefix = base.slice(0, 3).padEnd(3, 'X');

  const random = Array.from({ length: 5 }, () =>
    Math.random().toString(36).toUpperCase().charAt(2)
  ).join('');

  return `${prefix}${random}`; 
}

module.exports = generateSKU;
