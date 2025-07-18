/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one column), matching the example
  const headerRow = ['Cards (cards28)'];

  // The content row must have two columns: (image/icon cell, text/cta cell)
  // For a CTA-only card, first cell is '' (empty), second is the CTA link
  const link = element.querySelector('a.story-link');
  const cardRow = [ '', link || '' ];

  const rows = [headerRow, cardRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
