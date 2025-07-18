/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one element array)
  const headerRow = ['Columns (columns22)'];

  // Get all immediate .views-row children
  const rows = Array.from(element.querySelectorAll(':scope > .views-row'));

  // For every .views-row, get its immediate .views-col children (columns for that row)
  const tableRows = rows.map(row => {
    const cells = Array.from(row.querySelectorAll(':scope > .views-col'));
    return cells;
  });

  // Combine header and table rows
  const data = [headerRow, ...tableRows];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(data, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
