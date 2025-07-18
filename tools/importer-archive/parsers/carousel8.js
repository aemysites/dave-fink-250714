/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel slider element
  const slider = element.querySelector('.slider-wrapper');
  if (!slider) return;
  // Get the .slick-track (contains all slides)
  const track = slider.querySelector('.slick-track');
  if (!track) return;
  // Get all slides that are NOT clones
  const slides = Array.from(track.children).filter(sel => !sel.classList.contains('slick-cloned'));
  const cells = [['Carousel (carousel8)']];
  slides.forEach(slide => {
    // First column: image (if exists)
    let img = slide.querySelector('img');
    let imgCell = img || '';
    // Second column: all text content from the slide (title, description, cta links, etc)
    let textCell = '';
    // Try to get .slide-content (contains all text and cta links)
    const slideContent = slide.querySelector('.slide-content');
    if (slideContent) {
      // Collect all child nodes (preserving order)
      let textParts = [];
      slideContent.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textParts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const textEl = document.createElement('span');
          textEl.textContent = node.textContent;
          textParts.push(textEl);
        }
      });
      textCell = textParts.length > 0 ? textParts : '';
    }
    cells.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
