/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block Name
  const headerRow = ['Hero (hero25)'];

  // 2. Background Image row
  let imgEl = null;
  const pageBanner = element.querySelector('.page-banner');
  if (pageBanner) {
    const picture = pageBanner.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row (headline, subhead, CTA, etc)
  let contentCell = '';
  if (pageBanner) {
    const bannerContent = pageBanner.querySelector('.banner-content');
    if (bannerContent && bannerContent.childNodes.length > 0) {
      // Use as is (should contain all text including line breaks, spans, etc)
      contentCell = bannerContent;
    }
  }
  const contentRow = [contentCell];

  // 4. Compose table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element
  element.replaceWith(block);
}
