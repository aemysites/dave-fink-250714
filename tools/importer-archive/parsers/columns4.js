/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching the spec
  const headerRow = ['Columns (columns4)'];

  // Get all direct .views-col children (columns)
  const cols = Array.from(element.querySelectorAll(':scope > .views-col'));
  if (cols.length === 0) return;

  // For each column, include ALL of its child nodes (preserving structure/content)
  const colContent = cols.map(col => {
    // gather all child nodes, filter out insignificant whitespace
    const nodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      // Only keep text nodes that are not just whitespace
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    });
    // If more than one node, put them as array, else single node or empty string
    if (nodes.length === 0) return '';
    if (nodes.length === 1) return nodes[0];
    return nodes;
  });

  const cells = [
    headerRow,
    colContent
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
