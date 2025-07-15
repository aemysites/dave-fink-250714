/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in block requirements
  const headerRow = ['Hero (hero3)'];

  // Find first <img> anywhere inside the element (background image)
  let imageEl = element.querySelector('img');

  // For the content row: gather all text/heading/cta that is not part of the background image
  // We want to grab reasonable 'content' from the block, excluding media

  // Collect content nodes after the media container (which is usually the first child)
  let contentNodes = [];

  // Approach: Find the first child that contains the <img>, treat as image container
  // All other siblings (including their subtree) are included in the content cell.
  const children = Array.from(element.children);
  let imageContainerIdx = -1;
  for (let i = 0; i < children.length; i++) {
    if (children[i].querySelector && children[i].querySelector('img')) {
      imageContainerIdx = i;
      break;
    }
  }

  // Add all siblings after the image container as content
  if (imageContainerIdx >= 0) {
    for (let i = 0; i < children.length; i++) {
      if (i !== imageContainerIdx) {
        if (
          (children[i].textContent && children[i].textContent.trim() !== '') ||
          (children[i].children && children[i].children.length > 0)
        ) {
          contentNodes.push(children[i]);
        }
      }
    }
  } else {
    // If no image container found, use all children
    for (let i = 0; i < children.length; i++) {
      if (
        (children[i].textContent && children[i].textContent.trim() !== '') ||
        (children[i].children && children[i].children.length > 0)
      ) {
        contentNodes.push(children[i]);
      }
    }
  }

  // Fallback: If still empty, scan for text nodes not inside image container
  if (contentNodes.length === 0 && imageContainerIdx >= 0) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (
        children[imageContainerIdx] && children[imageContainerIdx].contains(node)
      ) {
        continue;
      }
      // Add text nodes with content
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        contentNodes.push(document.createTextNode(node.textContent));
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.textContent &&
        node.textContent.trim() !== '' &&
        node !== element
      ) {
        contentNodes.push(node);
      }
    }
  }

  // If still nothing, leave cell empty
  const contentRow = [contentNodes.length ? contentNodes : ''];

  // Build table rows in correct order: header, image, content
  const rows = [
    headerRow,
    [imageEl || ''],
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
