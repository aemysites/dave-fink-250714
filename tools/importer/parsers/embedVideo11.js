/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract Brightcove video id and create embed link
  function getBrightcoveLink(col) {
    const idElem = col.querySelector('.brightcove-video-id');
    if (!idElem) return null;
    const videoId = idElem.textContent.trim();
    if (!videoId || !/^\d+$/.test(videoId)) return null;
    // Use Brightcove video ID as unique video link reference (pattern may vary per implementation)
    return `https://players.brightcove.net/${videoId}`;
  }

  // Helper to collect the poster image in .video
  function getPosterImg(col) {
    return col.querySelector('.video img');
  }

  // Helper to get all descriptive/text content related to the video
  function getAllTextContent(col) {
    // Collect all <p> tags inside col (to ensure nothing is missed)
    const ps = Array.from(col.querySelectorAll('p'));
    // If no <p>, look for span or direct text in wrappers
    if (ps.length > 0) return ps;
    const textWrappers = Array.from(col.querySelectorAll('.fm-media-text-wrapper, .field-content'));
    // Only include elements with visible text
    const validWrappers = textWrappers.filter(e => e.textContent && e.textContent.trim());
    if (validWrappers.length > 0) return validWrappers;
    return [];
  }

  // Find all columns (each is a separate embed)
  const cols = element.querySelectorAll(':scope > div');
  const cells = [['Embed']];

  cols.forEach(col => {
    const rowContent = [];
    // Poster image
    const img = getPosterImg(col);
    if (img) rowContent.push(img);
    // Text content (all paragraphs/wrappers)
    const textElems = getAllTextContent(col);
    textElems.forEach(te => rowContent.push(te));
    // Embed link
    const embedUrl = getBrightcoveLink(col);
    if (embedUrl) {
      if (rowContent.length > 0) rowContent.push(document.createElement('br'));
      const a = document.createElement('a');
      a.href = embedUrl;
      a.textContent = embedUrl;
      rowContent.push(a);
    }
    // Only add row if there's real content
    if (rowContent.length > 0) {
      cells.push([rowContent]);
    }
  });

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
