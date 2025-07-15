/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate row containers
  const rows = Array.from(element.querySelectorAll(':scope > .views-row'));
  if (!rows.length) return;

  // For columns block, each .views-col is a column
  const firstRow = rows[0];
  const cols = Array.from(firstRow.querySelectorAll(':scope > .views-col'));
  const colCells = cols.map((col) => {
    // We'll collect all relevant content in a fragment for each col
    const frag = document.createDocumentFragment();
    // 1. Video/image thumbnail (the .video img inside optional link)
    const img = col.querySelector('.video img');
    if (img) frag.appendChild(img);
    // 2. Text or description
    const textWrap = col.querySelector('.fm-media-text-wrapper');
    if (textWrap) {
      frag.appendChild(textWrap);
    }
    // If both absent, add all children (fallback)
    if (!img && !textWrap) {
      Array.from(col.childNodes).forEach((n) => frag.appendChild(n));
    }
    if (frag.childNodes.length === 1) return frag.firstChild;
    if (frag.childNodes.length === 0) return '';
    return frag;
  });

  // Build the cells array: header is a single column, content row has N columns
  const cells = [];
  cells.push(['Columns (columns9)']); // header row: 1 cell only
  cells.push(colCells); // content row: one cell per column
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
