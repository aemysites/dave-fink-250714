/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards30)'];
  const cells = [headerRow];

  // Find the grid with cards
  const grid = element.querySelector('.views-view-grid.horizontal');
  if (!grid) return;

  // Only process visible rows
  const rows = Array.from(grid.querySelectorAll('.views-row')).filter(row => {
    return !(row.style && row.style.display === 'none');
  });

  rows.forEach(row => {
    const cols = Array.from(row.querySelectorAll('.views-col'));
    cols.forEach(col => {
      // Get the card root
      const card = col.querySelector('.resources-video-outer-wrapper');
      if (!card) return;

      // --- Image/thumbnail cell ---
      let imageCell = '';
      const img = card.querySelector('img');
      if (img) imageCell = img;

      // --- Text cell ---
      const textCellContent = [];
      const bottom = card.querySelector('.video-bottom-text');
      let hasPrev = false;
      if (bottom) {
        // Title (add as <strong>)
        const titleDiv = bottom.querySelector('.video-title');
        if (titleDiv && titleDiv.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = titleDiv.textContent.trim();
          textCellContent.push(strong);
          hasPrev = true;
        }
        // Source or description (plain text)
        const sourceDiv = bottom.querySelector('.video-source');
        if (sourceDiv && sourceDiv.textContent.trim()) {
          if (hasPrev) textCellContent.push(document.createElement('br'));
          textCellContent.push(sourceDiv.textContent.trim());
          hasPrev = true;
        }
      }
      // Sometimes the title or description can only be found as spans directly
      // Add all non-empty, direct span children of video-bottom-text
      if (bottom) {
        Array.from(bottom.querySelectorAll(':scope > span')).forEach(span => {
          if (span.textContent.trim()) {
            if (hasPrev) textCellContent.push(document.createElement('br'));
            textCellContent.push(span.textContent.trim());
            hasPrev = true;
          }
        });
      }
      // Add CTA link (Watch Video) with proper href
      const hover = card.querySelector('.hover-wrap');
      if (hover) {
        let videoHref = '';
        // Look for brightcove video
        const brightcove = hover.querySelector('.brightcove-video-id');
        if (brightcove && brightcove.textContent.trim()) {
          videoHref = `bc://${brightcove.textContent.trim()}`;
        }
        // Or youtube
        const yt = hover.querySelector('.youtube-video-link');
        if (yt && yt.textContent.trim()) {
          videoHref = yt.textContent.trim();
        }
        const ctaAnchor = hover.querySelector('a.watch-video');
        if (ctaAnchor && videoHref) {
          const cta = document.createElement('a');
          cta.href = videoHref;
          cta.target = '_blank';
          cta.textContent = ctaAnchor.textContent.trim();
          if (hasPrev) textCellContent.push(document.createElement('br'));
          textCellContent.push(cta);
          hasPrev = true;
        }
      }
      // Fallback: if for any reason textCellContent is empty, grab all text from bottom
      if ((!textCellContent.length) && bottom && bottom.textContent.trim()) {
        textCellContent.push(bottom.textContent.trim());
      }

      // Last fallback: all card text if text cell is empty
      if (!textCellContent.length && card.textContent.trim()) {
        textCellContent.push(card.textContent.trim());
      }

      cells.push([imageCell, textCellContent]);
    });
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
