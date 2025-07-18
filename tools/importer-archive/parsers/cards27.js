/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header row
  const rows = [['Cards (cards27)']];

  // Get all card wrapper divs
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  cardDivs.forEach(cardDiv => {
    const media = cardDiv.querySelector('.infographics-media');
    if (!media) return;

    // Get main image and alt/title
    const a = media.querySelector('a');
    const img = a ? a.querySelector('img') : null;
    const titleText = img && img.getAttribute('alt') ? img.getAttribute('alt') : '';

    // Compose title element
    let titleEl = null;
    if (titleText) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
    }

    // Compose download PDF link
    let pdfLinkEl = null;
    if (a && a.href) {
      pdfLinkEl = document.createElement('a');
      pdfLinkEl.href = a.href;
      pdfLinkEl.textContent = 'Download PDF';
      pdfLinkEl.target = '_blank';
      pdfLinkEl.rel = 'noopener noreferrer';
    }

    // Extract description/explanatory text:
    // 1. Gather all non-hidden, non-link, non-image text from .infographics-media
    let description = '';
    Array.from(media.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        description += child.textContent.trim() + ' ';
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        !child.classList.contains('mfp-hide') &&
        child.tagName !== 'A' &&
        child.tagName !== 'IMG' &&
        child.textContent.trim()
      ) {
        description += child.textContent.trim() + ' ';
      }
    });
    // 2. Also check for visible text directly under cardDiv but outside .infographics-media
    Array.from(cardDiv.childNodes).forEach(child => {
      if (child === media) return;
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        description += child.textContent.trim() + ' ';
      } else if (
        child.nodeType === Node.ELEMENT_NODE && child.textContent.trim()
      ) {
        description += child.textContent.trim() + ' ';
      }
    });
    description = description.trim();

    let descEl = null;
    if (description) {
      descEl = document.createElement('p');
      descEl.textContent = description;
    }

    // Compose right cell with all content: title, description, download link
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) {
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }
    if (pdfLinkEl) {
      if (titleEl || descEl) textCell.push(document.createElement('br'));
      textCell.push(pdfLinkEl);
    }
    rows.push([
      img || '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
