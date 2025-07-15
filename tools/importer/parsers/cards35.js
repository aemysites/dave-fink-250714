/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards35)'];
  const rows = [];
  // Select all visible .views-row elements only
  element.querySelectorAll('.views-row').forEach((row) => {
    if (row.style && row.style.display === 'none') return;
    // Image: first image found in the row
    const image = row.querySelector('img');
    // Text cell: aggregate all child nodes of .views-field-nothing > .field-content
    const info = row.querySelector('.views-field-nothing .field-content');
    if (!image || !info) return;
    // Create a div and move all children from info into it (preserving formatting and semantics)
    const textDiv = document.createElement('div');
    while (info.childNodes.length > 0) {
      const node = info.childNodes[0];
      // Skip empty <p> tags with no content or links
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && !node.textContent.trim() && !node.querySelector('a')) {
        info.removeChild(node);
        continue;
      }
      textDiv.appendChild(node);
    }
    rows.push([image, textDiv]);
  });
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
