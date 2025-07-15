/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row
  const cells = [['Cards (cards24)']];

  // Find the grid wrapper
  const grid = element.querySelector('.views-view-grid');
  if (!grid) return;

  // Get all rows in the grid
  const rows = grid.querySelectorAll(':scope > .views-row');

  rows.forEach((row) => {
    // Each row has multiple cols (cards)
    const cols = row.querySelectorAll(':scope > .views-col');
    cols.forEach((col) => {
      // Reference the main card wrapper
      const card = col.querySelector('.resources-item-outer-wrapper');
      if (!card) return;

      // Extract image (img element, not wrapping link)
      let imgEl = null;
      const img = card.querySelector('.resource-image img');
      if (img) imgEl = img;

      // Compose the right-hand cell from what's in .resource-name and CTA overlay
      const textCellContent = [];

      // Extract title (from .resource-name span > a)
      const titleA = card.querySelector('.resource-name span a');
      if (titleA && titleA.textContent.trim()) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = titleA.textContent.trim();
        p.appendChild(strong);
        textCellContent.push(p);
      }

      // No description is available in the source HTML, so we skip that.
      // Extract CTA (VIEW RESOURCES) if present (from overlay)
      const cta = card.querySelector('.resources-item-overlay-outer-wrapper .view-more a');
      if (cta && cta.textContent.trim()) {
        // Use the CTA link as-is
        const p = document.createElement('p');
        p.appendChild(cta);
        textCellContent.push(p);
      }

      // If no content at all, fallback to empty string
      cells.push([
        imgEl || '',
        textCellContent.length ? textCellContent : ''
      ]);
    });
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
