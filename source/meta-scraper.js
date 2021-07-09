/* global browser */

// invaluable:
// https://devhints.io/html-meta

// console.log(`Help I'm alive`, browser.runtime, window.tabId);

function captureMeta() {

  // opengraph
  let ogMeta = document.querySelectorAll('meta[property^="og:"]');
  let opengraph = {};
  for (const tag of ogMeta) {
    let attr = tag.attributes;
    opengraph[attr.property.textContent.split('og:').pop()] = attr.content.textContent;
  }

  let twFromName = document.querySelectorAll('meta[name^="twitter:"]');
  let twitter = {};
  for (const tag of twFromName) {
    let attr = tag.attributes;
    twitter[attr.name.textContent.split('twitter:').pop()] = attr.content.textContent;
  }

  // some sites have a mix: property: twitter:
  let twFromProp = document.querySelectorAll('meta[property^="twitter:"]');
  for (const tag of twFromProp) {
    let attr = tag.attributes;
    twitter[attr.property.textContent.split('twitter:').pop()] = attr.content.textContent;
  }

  let url = document.url;

  browser.runtime.sendMessage({ opengraph, twitter, url })
}

captureMeta();


