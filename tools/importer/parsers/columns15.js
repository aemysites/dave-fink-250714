/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content wrapper (for best source resilience)
  const wrapper = element.querySelector('.page-wrapper');
  let columns = [];
  if (wrapper) {
    // Find the content blocks in correct visual/footer order:
    // 1. Social links and disclaimer (first column)
    // 2. Footer navigation (second column)
    // 3. Pfizer link (third column)
    
    // First column: Social links + disclaimer
    const col1 = [];
    const follow = wrapper.querySelector('#block-followuslink > div, #block-followuslink');
    if (follow) col1.push(follow);
    const info = wrapper.querySelector('#block-footersiteinfo > div, #block-footersiteinfo');
    if (info) col1.push(info);
    if (col1.length) {
      // If both present, append both in one cell
      columns.push(col1.length > 1 ? col1 : col1[0]);
    }

    // Second column: nav menu
    const nav = wrapper.querySelector('#block-storyhalftold-footer');
    if (nav) columns.push(nav);

    // Third column: Pfizer link
    const pfizer = wrapper.querySelector('#block-footerpfizerlink > div, #block-footerpfizerlink');
    if (pfizer) columns.push(pfizer);
  }
  // Fallback: if not found, place all direct wrapper children as columns
  if (columns.length === 0 && wrapper) {
    columns = Array.from(wrapper.children).filter(el => {
      // Remove hidden popups
      return !el.classList.contains('exit-fymv') && !el.classList.contains('exit-global') && !el.classList.contains('mfp-hide');
    });
  }
  // Last-resort fallback: all footer > div as columns
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }
  // Remove any empty columns
  columns = columns.filter(col => {
    if (Array.isArray(col)) {
      // arrays: at least one element has text
      return col.some(e => e.textContent && e.textContent.trim().length > 0);
    }
    return col && col.textContent && col.textContent.trim().length > 0;
  });
  // Compose table cells
  const cells = [
    ['Columns (columns15)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
