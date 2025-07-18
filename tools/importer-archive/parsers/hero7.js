/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Hero (hero7)'];

  // Row 2: Background Image (optional)
  let imgEl = null;
  // Find the first <img> in a <picture> inside .page-banner
  const bannerImgContainer = element.querySelector('.page-banner');
  if (bannerImgContainer) {
    const picture = bannerImgContainer.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
  }
  if (!imgEl) {
    // fallback - first <img> in element
    imgEl = element.querySelector('img');
  }

  // Row 3: Title, Subheading, Footnote as block content
  // All text is inside .banner-mobile-text .page-wrapper
  let textBlock = null;
  const mobileText = element.querySelector('.banner-mobile-text');
  if (mobileText) {
    textBlock = mobileText.querySelector('.page-wrapper') || mobileText;
  }
  // If no .banner-mobile-text, fallback to direct children with known classes
  let textContent = [];
  if (textBlock) {
    // Use all direct children of textBlock (divs with text)
    textContent = Array.from(textBlock.childNodes).filter((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
  } else {
    // fallback: gather known classes
    const primary = element.querySelector('.banner-primary-text');
    const secondary = element.querySelector('.banner-secondary-text');
    const footnote = element.querySelector('.memoir-footnote');
    if (primary) textContent.push(primary);
    if (secondary) textContent.push(secondary);
    if (footnote) textContent.push(footnote);
  }

  // Defensive check for empty content
  const imgCell = imgEl ? imgEl : '';
  const textCell = textContent.length ? textContent : '';

  const rows = [
    headerRow,
    [imgCell],
    [textCell]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
