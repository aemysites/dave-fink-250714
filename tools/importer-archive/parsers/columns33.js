/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container for columns
  const grid = element.querySelector('.views-view-grid');
  if (!grid) return;

  // Find the first .views-row (the row holding all columns)
  const row = grid.querySelector('.views-row');
  if (!row) return;

  // Find all columns in the row
  const cols = row.querySelectorAll(':scope > .views-col');
  const colCells = [];

  cols.forEach(col => {
    // Gather all direct children (including text nodes) for the column
    const nodes = [];
    col.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        nodes.push(span);
      }
    });
    if (nodes.length === 0) {
      colCells.push('');
    } else if (nodes.length === 1) {
      colCells.push(nodes[0]);
    } else {
      colCells.push(nodes);
    }
  });

  // Pad to 3 columns if fewer than 3
  while (colCells.length < 3) {
    colCells.push('');
  }

  // The header row must have exactly ONE column, followed by the three-column content row
  const cells = [
    ['Columns (columns33)'], // single header cell
    colCells                 // content row: 3 columns
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
