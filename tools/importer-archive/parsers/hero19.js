/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matches the example: 'Hero (hero19)'
  const headerRow = ['Hero (hero19)'];

  // Background image row (none in this HTML)
  const backgroundImageRow = [''];

  // For content row: include title and all story text, referencing original elements
  const contentElements = [];

  // Title (h1)
  const titleBlock = element.querySelector('#block-storyhalftold-page-title h1');
  if (titleBlock) contentElements.push(titleBlock);

  // Story/paragraph (could be inside #block-storyhalftold-content)
  const contentBlock = element.querySelector('#block-storyhalftold-content');
  if (contentBlock) {
    // Try to find all paragraphs inside article
    const article = contentBlock.querySelector('article');
    if (article) {
      // Find all <p> inside article (could be nested)
      const paragraphs = article.querySelectorAll('p');
      paragraphs.forEach(p => {
        // Only add paragraph if it contains text
        if (p.textContent && p.textContent.trim().length > 0) {
          contentElements.push(p);
        }
      });
    }
  }

  // Fallback: if nothing found, leave blank
  if (contentElements.length === 0) contentElements.push('');

  const cells = [
    headerRow,
    backgroundImageRow,
    [contentElements],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}