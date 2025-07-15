/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children that represent columns (works for 1 or many columns)
  let columns = Array.from(element.querySelectorAll(':scope > .views-col'));
  if (!columns.length) {
    columns = Array.from(element.children);
  }

  // For each column, include the full .views-col content in the cell for resilience
  const contentRow = columns.map(col => col);

  // Compose the table as in the example: one header row (one cell), one content row (N cells)
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns29)'],
    contentRow
  ], document);

  element.replaceWith(table);
}
