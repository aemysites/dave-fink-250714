/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the cards container (list of cards)
  
  // manuall updated cards selector as the original .js-view-dom-id-xxx selector is dynamic
  const cardsContainer = element.querySelector('#block-views-block-homepage-community-stories-block-1 > div > div');
  if (!cardsContainer) return;

  // 2. Table header matches example
  const table = [
    ['Cards (cards6)'],
  ];

  // 3. Each .views-row represents a card
  const rows = Array.from(cardsContainer.querySelectorAll(':scope > .views-row'));
  rows.forEach(row => {
    // Image in first cell
    let img = null;
    const imgAnchor = row.querySelector('.views-field-view-node .field-content a');
    if (imgAnchor) {
      img = imgAnchor.querySelector('img');
    }
    // Content in second cell: h4, author, description
    const contentWrap = row.querySelector('.views-field-nothing .field-content .content-wrap');
    const cellContent = [];
    if (contentWrap) {
      // Title (h4)
      const h4 = contentWrap.querySelector('h4');
      if (h4) cellContent.push(h4);
      // Author (p.author-name)
      const author = contentWrap.querySelector('p.author-name');
      if (author && author.textContent.trim()) cellContent.push(author);
      // Any further description (other <p>)
      const ps = Array.from(contentWrap.querySelectorAll('p'));
      ps.forEach(p => {
        if (!p.classList.contains('author-name') && p.textContent.trim()) {
          cellContent.push(p);
        }
      });
    }
    table.push([
      img || '',
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
