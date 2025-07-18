/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block containing all the partner logos
  let block = element.querySelector('#block-ourpartnersinmetastaticbreastcancer-2');
  // Fallback: try within children if block is not found
  if (!block) {
    const divs = element.querySelectorAll('div');
    for (let d of divs) {
      if (d.id && d.id.includes('block-ourpartnersinmetastaticbreastcancer')) {
        block = d;
        break;
      }
    }
  }
  if (!block) return;

  // Grab the heading (should be h2, but keep general)
  let heading = block.querySelector('h2, h1, h3, h4, h5, h6');
  // Find the partners container: the direct div after the heading
  let partnersContainer = null;
  if (heading) {
    let next = heading.nextElementSibling;
    while (next && next.tagName !== 'DIV') {
      next = next.nextElementSibling;
    }
    partnersContainer = next;
  }
  // Fallback: try direct child div
  if (!partnersContainer) {
    partnersContainer = block.querySelector('div');
  }
  if (!partnersContainer) return;

  // Drill down to the div that contains all paragraphs
  let inner = partnersContainer;
  while (
    inner &&
    inner.childElementCount === 1 &&
    inner.firstElementChild.tagName === 'DIV'
  ) {
    inner = inner.firstElementChild;
  }

  // Now inner should have multiple divs for each partner
  // We'll collect the direct children that contain a link+image
  const partnerDivs = Array.from(inner.children).filter(div =>
    div.querySelector('a > img')
  );

  // We'll display the heading above the logos (as in the screenshot)
  // Each logo (with link) is one column in the row
  // Table: header row is Columns (columns26)

  const headerRow = ['Columns (columns26)'];
  // Content row: Compose either [heading, ...logos] or just logos
  // Per screenshot, heading is above, so let's create a row with the heading, then another row with all columns (logos)

  let contentRows = [];
  if (heading) {
    // Place heading as a single-cell row spanning all columns
    contentRows.push([heading]);
  }
  // Collect all logo links as columns
  const logosRow = partnerDivs.map(div => div.querySelector('a'));
  if (logosRow.length > 0) {
    contentRows.push(logosRow);
  }

  // Assemble
  const cells = [headerRow, ...contentRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}