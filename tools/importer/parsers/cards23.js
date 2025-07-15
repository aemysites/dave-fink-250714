/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card rows
  const rows = element.querySelectorAll('.views-row');
  const cells = [['Cards (cards23)']];

  rows.forEach((row) => {
    // Find the image - use the <img> inside the first .views-field-view-node
    let img = null;
    const imgField = row.querySelector('.views-field-view-node .field-content a img');
    if (imgField) img = imgField;

    // Find text content: use the whole content-wrap div (preserves heading and author)
    let textContent = null;
    const contentWrap = row.querySelector('.views-field-nothing .content-wrap');
    if (contentWrap) {
      textContent = contentWrap;
    } else {
      // fallback: get the closest h4 or text if needed
      const h4 = row.querySelector('h4');
      if (h4) {
        textContent = document.createDocumentFragment();
        textContent.appendChild(h4);
      }
    }

    cells.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
