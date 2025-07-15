/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per spec, single column
  const cells = [['Carousel (carousel18)']];

  // Find carousel track
  const slider = element.querySelector('.slick-slider');
  if (!slider) return;
  const slickTrack = slider.querySelector('.slick-list .slick-track');
  if (!slickTrack) return;

  // Only slides that are NOT 'slick-cloned' are originals (i.e., the main slides)
  const slides = Array.from(slickTrack.children).filter(
    (slide) => slide.classList.contains('slick-slide') && !slide.classList.contains('slick-cloned')
  );

  slides.forEach((slide) => {
    // IMAGE CELL: Find the actual <img> element (reference directly)
    const img = slide.querySelector('img');

    // TEXT CELL: Gather all text content per slide
    const textNodes = [];
    // Founding member name (as heading)
    const name = slide.querySelector('.fm-member-name-wrapper');
    if (name && name.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = name.textContent.trim();
      textNodes.push(h);
    }
    // Add any description text (if present in future or via other class)
    // (the current HTML only has name, but structure allows for more)
    const desc = slide.querySelector('.fm-member-desc');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textNodes.push(p);
    }
    // Add any other direct text nodes (robust fallback, in case label class changes)
    // (skip if already found above)
    if (textNodes.length === 0) {
      // Try to pick up any direct text from .field-content except images
      const fc = slide.querySelector('.field-content');
      if (fc) {
        Array.from(fc.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textNodes.push(p);
          }
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            !node.classList.contains('fm-item-outer-wrapper') &&
            node.textContent.trim()
          ) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textNodes.push(p);
          }
        });
      }
    }
    // If still nothing, fallback to all text in the slide
    if (textNodes.length === 0) {
      const fallback = slide.textContent.trim();
      if (fallback) {
        const p = document.createElement('p');
        p.textContent = fallback;
        textNodes.push(p);
      }
    }

    cells.push([
      img || '',
      textNodes.length > 0 ? textNodes : ''
    ]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
