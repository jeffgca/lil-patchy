/* global browser */

// invaluable:
// https://devhints.io/html-meta

// poor man's lodash defaults, right-most set value wins
function combine(defaults, ...args) {
  console.log(args)
  for (const key in defaults) {
    // console.log(key, defaults[key])

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
    opengraph[attr.property.value.split('og:').pop()] = attr.content.value;
  }

  // Twitter / name attribute
  const twFromName = document.querySelectorAll('meta[name^="twitter:"]');
  const twitter = {};
  try {
    for (const tag of twFromName) {
      twitter[tag.name.split('twitter:').pop()] = tag.content;
    }    
  } catch (err) {
    console.error('Error parsing twitter named metadata', err);
  }


  // Some sites have a mix: property: twitter:
  const twFromProp = document.querySelectorAll('meta[property^="twitter:"]');
  for (const tag of twFromProp) {
    
    try {
      const attr = tag.attributes;
      twitter[attr.property.value.split('twitter:').pop()] = attr.content.value;
    } catch(err) {
      console.error('Error parsing twitter property metadata', err);
    }
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

