/* global WebImporter */
export default function parse(element, { document }) {
  // Find share wrap
  const shareWrap = element.querySelector('.social-share-wrap');
  if (!shareWrap) return;
  // Grab all share links
  const links = Array.from(shareWrap.querySelectorAll(':scope > a'));
  if (links.length === 0) return;
  // Header row: exactly one cell, the block name
  const headerRow = ['Columns (columns16)'];
  // Content row: each share link in its own column
  const contentRow = links;
  // Build cells: header row must have only one cell, contentRow has N columns
  const cells = [headerRow, contentRow];
  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
