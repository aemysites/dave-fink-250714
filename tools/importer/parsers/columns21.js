/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main statement container
  const statementContainer = element.querySelector('.statement-container');
  if (!statementContainer) return;

  // Get left and right column blocks
  const left = statementContainer.querySelector('.statement-left-block');
  const right = statementContainer.querySelector('.statement-right-block');

  // The header row should be a single cell, as per the example
  const headerRow = ['Columns (columns21)'];
  // The data row should have two cells (columns)
  const contentRow = [left || '', right || ''];

  // Build the table data: header is a single-cell row, then the content row
  const tableData = [
    headerRow,   // single-cell row for header
    contentRow   // two cells for columns
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
