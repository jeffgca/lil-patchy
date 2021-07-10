/* global browser */

// invaluable:
// https://devhints.io/html-meta

// console.log(`Help I'm alive`, browser.runtime, window.tabId);

function captureMeta() {
  // Opengraph
  const ogMeta = document.querySelectorAll('meta[property^="og:"]');
  const opengraph = {};
  for (const tag of ogMeta) {
    const attr = tag.attributes;
    opengraph[attr.property.textContent.split('og:').pop()] = attr.content.textContent;
  }

  // Twitter / name attribute
  const twFromName = document.querySelectorAll('meta[name^="twitter:"]');
  const twitter = {};
  for (const tag of twFromName) {
    const attr = tag.attributes;
    twitter[attr.name.textContent.split('twitter:').pop()] = attr.content.textContent;
  }

  // Some sites have a mix: property: twitter:
  const twFromProp = document.querySelectorAll('meta[property^="twitter:"]');
  for (const tag of twFromProp) {
    const attr = tag.attributes;
    twitter[attr.property.textContent.split('twitter:').pop()] = attr.content.textContent;
  }

  browser.runtime.sendMessage({ opengraph, twitter, url: document.url });
}

captureMeta();
