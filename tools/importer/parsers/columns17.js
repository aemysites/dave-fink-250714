/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: resolve relative image URLs
  function resolveSrc(src) {
    const a = document.createElement('a');
    a.href = src;
    return a.href;
  }
  // Find the first views-row (only 1 in this HTML)
  const row = element.querySelector('.views-row');
  let cols;
  if (row) {
    cols = Array.from(row.querySelectorAll(':scope > .views-col'));
  } else {
    cols = Array.from(element.querySelectorAll(':scope > .views-col'));
  }
  // For each column, extract content as in original code
  const colCells = cols.map((col) => {
    const cellContent = [];
    const img = col.querySelector('img');
    if (img) cellContent.push(img);
    const desc = col.querySelector('.fm-media-text-wrapper p');
    if (desc) cellContent.push(desc);
    const yt = col.querySelector('.youtube-video-link');
    if (yt) {
      const link = document.createElement('a');
      link.href = yt.textContent.trim();
      link.textContent = yt.textContent.trim();
      cellContent.push(link);
    } else {
      const bc = col.querySelector('.brightcove-video-id');
      if (bc) {
        const span = document.createElement('span');
        span.textContent = 'Brightcove Video ID: ' + bc.textContent.trim();
        cellContent.push(span);
      }
    }
    if (cellContent.length === 0) cellContent.push('');
    return cellContent;
  });
  // Header row: one column only, as per example
  const cells = [
    ['Columns (columns17)'],
    colCells // second row: as many columns as needed
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
