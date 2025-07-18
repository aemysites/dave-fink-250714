/* global WebImporter */
export default function parse(element, { document }) {
  // The correct header row: one column with the exact header text
  const header = ['Columns (columns31)'];
  // Find all grid rows
  const rows = Array.from(element.querySelectorAll(':scope > .views-row'));
  // Build all data rows (each with 3 columns)
  const dataRows = rows.map((row) => {
    const cols = Array.from(row.querySelectorAll(':scope > .views-col'));
    return cols.map((col) => {
      const content = [];
      // Add the media block (.video or .image)
      const mediaBlock = col.querySelector('.video, .image');
      if (mediaBlock) content.push(mediaBlock);
      // Add all descriptive text inside .views-field-nothing
      const viewsField = col.querySelector('.views-field-nothing');
      if (viewsField) {
        // Add all non-empty paragraphs or spans
        Array.from(viewsField.querySelectorAll('p, span')).forEach((el) => {
          if (el.textContent && el.textContent.replace(/\u00a0|\s/g, '').length > 0) {
            content.push(el);
          }
        });
        // Add any non-empty direct text nodes
        Array.from(viewsField.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.replace(/\u00a0|\s/g, '').length > 0) {
            const span = document.createElement('span');
            span.textContent = node.textContent;
            content.push(span);
          }
        });
      }
      // As a fallback, include all child nodes
      if (content.length === 0) {
        content.push(...Array.from(col.childNodes).filter(n => n.nodeType !== Node.COMMENT_NODE));
      }
      return content.length === 1 ? content[0] : content;
    });
  });
  // Compose the cells array: First row is header (single cell), then all data rows
  const cells = [header, ...dataRows];
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
