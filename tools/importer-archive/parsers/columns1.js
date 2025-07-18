/* global WebImporter */
export default function parse(element, { document }) {
  // Find column regions in the layout
  let col1 = element.querySelector('.layout__region--first');
  let col2 = element.querySelector('.layout__region--second');

  // Fallback if classes change (should be robust)
  if (!col1 || !col2) {
    const cols = element.querySelectorAll(':scope > .page-wrapper > div');
    col1 = cols[0];
    col2 = cols[1];
  }

  // Defensive: if any column is missing, create empty placeholder
  if (!col1) {
    col1 = document.createElement('div');
  }
  if (!col2) {
    col2 = document.createElement('div');
  }

  // Unwrap superfluous wrappers (usually <div><div>content</div></div>)
  function extractColumnContent(col) {
    let node = col;
    while (node && node.children && node.children.length === 1 && node.firstElementChild.tagName.toLowerCase() === 'div') {
      node = node.firstElementChild;
    }
    return node;
  }
  const col1Content = extractColumnContent(col1);
  const col2Content = extractColumnContent(col2);

  // Create the table manually, to allow header colspan
  const table = document.createElement('table');

  // Header row with single cell spanning all columns (colspan=2)
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns1)';
  th.colSpan = 2;
  trHeader.appendChild(th);
  table.appendChild(trHeader);

  // Content row (2 columns)
  const trContent = document.createElement('tr');
  const td1 = document.createElement('td');
  td1.append(col1Content);
  const td2 = document.createElement('td');
  td2.append(col2Content);
  trContent.appendChild(td1);
  trContent.appendChild(td2);
  table.appendChild(trContent);

  // Replace original element with new table
  element.replaceWith(table);
}
