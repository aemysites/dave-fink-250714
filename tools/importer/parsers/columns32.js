/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct columns
  const cols = element.querySelectorAll(':scope > .views-col');
  const columns = Array.from(cols).map((col) => {
    const cellParts = [];
    const img = col.querySelector('img');
    if (img) cellParts.push(img);
    const fmText = col.querySelector('.fm-media-text-wrapper');
    if (fmText) cellParts.push(fmText);
    if (cellParts.length === 0) return '';
    if (cellParts.length === 1) return cellParts[0];
    return cellParts;
  });

  // The header must be a single cell spanning the number of columns, so one string in the array
  const headerRow = ['Columns (columns32)'];
  const rows = [headerRow, columns];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
