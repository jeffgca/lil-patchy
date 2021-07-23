/* global browser */

// invaluable:
// https://devhints.io/html-meta

// console.log(`Help I'm alive`, browser.runtime, window.tabId);


// poor man's lodash defaults, right-most set value wins
function combine(defaults, ...args) {
  console.log(args)
  for (const key in defaults) {
    console.log(key, defaults[key])

		args.forEach((val, i) => { 
      if (val.hasOwnProperty(key)) {
        defaults[key] = val[key];
      }
    })
  }
  return defaults;
}

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

  let descFromPage = document.querySelectorAll('meta[name="description"]')[0].content || 'No description set.';

  let fromPage = {
    title: document.title,
    description: descFromPage,
    image: false
}

  console.log('DEBUG', fromPage, twFromName, twFromProp, opengraph);

  return combine(fromPage, twFromProp, twFromName, opengraph);
}

captureMeta();
