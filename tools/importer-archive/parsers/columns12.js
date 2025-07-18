/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block that represents the columns block
  const mainBlock = element.querySelector('.resources-bottom-block');
  if (!mainBlock) return;

  // First column: image
  const img = mainBlock.querySelector('img');

  // Second column: content div
  const contentDiv = mainBlock.querySelector('.content');

  // Calculate number of columns for correct header row colspan
  const columnsCount = [img, contentDiv].filter(Boolean).length;

  // Custom table creation to allow header cell colspan
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns12)';
  if (columnsCount > 1) {
    th.setAttribute('colspan', columnsCount);
  }
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  // Content row
  const contentTr = document.createElement('tr');
  if (img) {
    const td1 = document.createElement('td');
    td1.appendChild(img);
    contentTr.appendChild(td1);
  }
  if (contentDiv) {
    const td2 = document.createElement('td');
    td2.appendChild(contentDiv);
    contentTr.appendChild(td2);
  }
  table.appendChild(contentTr);

  element.replaceWith(table);
}
