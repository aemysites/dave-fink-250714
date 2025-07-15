/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per specification
  const headerRow = ['Cards (cards20)'];

  // Cards are in each of the .layout__region children
  const regions = element.querySelectorAll(':scope > .page-wrapper > .layout__region');

  const rows = [headerRow];

  regions.forEach(region => {
    const card = region.querySelector('.resources-bottom-block');
    if (!card) return;
    const img = card.querySelector('img');
    const contentDiv = card.querySelector('.content');
    if (img && contentDiv) {
      // Reference existing elements directly in table structure
      rows.push([img, contentDiv]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
