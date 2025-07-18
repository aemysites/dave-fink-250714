/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper for the content
  const wrapper = element.querySelector('.community-stories-wrapper') || element;

  // Header row: must match exactly
  const headerRow = ['Hero (hero13)'];

  // Media row: Prefer the .media-wrapper if available
  let mediaCell = '';
  const mediaWrapper = wrapper.querySelector('.media-wrapper');
  if (mediaWrapper) {
    mediaCell = mediaWrapper;
  }

  // Text row: Collect all page-header and page-description direct children for flexibility
  const textBlocks = [];
  // page-header (contains heading and author)
  const pageHeader = wrapper.querySelector('.page-header');
  if (pageHeader) textBlocks.push(pageHeader);
  // page-description (contains description)
  const pageDescription = wrapper.querySelector('.page-description');
  if (pageDescription) textBlocks.push(pageDescription);

  // Compose table
  const cells = [
    headerRow,
    [mediaCell],
    [textBlocks.length > 0 ? textBlocks : '']
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
