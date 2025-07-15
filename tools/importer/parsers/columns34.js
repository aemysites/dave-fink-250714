/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row per example
  const headerRow = ['Columns (columns34)'];

  // Extract all rows (horizontal)
  const rows = Array.from(element.querySelectorAll(':scope > .views-row'));
  const cells = [headerRow];

  // For each 'views-row', collect that row's columns (each as an immediate child)
  rows.forEach((row) => {
    const cols = Array.from(row.querySelectorAll(':scope > .views-col'));
    // For each col, build cell content
    const rowCells = cols.map((col) => {
      // Prefer the visual block: .video or .image
      let content = [];
      const video = col.querySelector('.video');
      const image = col.querySelector('.image');
      const viewsField = col.querySelector('.views-field-nothing .fm-media-text-wrapper');
      // Video or image visual (always an <img>)
      let img = null;
      if (video && video.querySelector('img')) {
        img = video.querySelector('img');
      } else if (image && image.querySelector('img')) {
        img = image.querySelector('img');
      }
      if (img) content.push(img);
      // Description (as <p>) if present
      if (viewsField) {
        // Use the wrapper to preserve formatting (usually a <p> inside)
        content.push(viewsField);
      }
      // If nothing found, empty string to preserve structure
      if (content.length === 0) return '';
      // Single or multiple content
      return content.length === 1 ? content[0] : content;
    });
    cells.push(rowCells);
  });

  // Build and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
