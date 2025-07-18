/* global WebImporter */
export default function parse(element, { document }) {
  // The structure to match is 1 column, 3 rows: header, image, text (quote+attribution)

  // Helper to find the first descendant matching selector
  function findFirstDescendant(elem, selector) {
    const found = elem.querySelector(selector);
    return found || null;
  }

  // Find the image or picture
  let imageEl = null;
  // Try to find a picture, else img
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    // fallback: look for an img not inside a picture
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the quote and attribution (text block)
  // Look for .banner-mobile-text or .banner-primary-text on any descendant
  let textBlock = null;
  // Prefer the whole block containing both the primary and secondary text
  const bannerTextWrapper = element.querySelector('.banner-mobile-text');
  if (bannerTextWrapper) {
    // Use the .page-wrapper inside if present for a clean block
    const pageWrapper = bannerTextWrapper.querySelector('.page-wrapper');
    if (pageWrapper) {
      textBlock = pageWrapper;
    } else {
      textBlock = bannerTextWrapper;
    }
  } else {
    // fallback: just the primary text
    const primaryText = element.querySelector('.banner-primary-text');
    const secondaryText = element.querySelector('.banner-secondary-text');
    if (primaryText || secondaryText) {
      // Combine both in a div
      const wrapper = document.createElement('div');
      if (primaryText) wrapper.appendChild(primaryText);
      if (secondaryText) wrapper.appendChild(secondaryText);
      textBlock = wrapper;
    }
  }

  // Build the table data
  const cells = [
    ['Hero (hero2)'],
    [imageEl],
    [textBlock],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
