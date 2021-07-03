/* global browser */
const APP_URL = 'https://stupid-enormous-square-hero.fission.app/';
const EXT_URL = browser.runtime.getURL('pages');

class TabChannel {
  constructor(options) {
    if (options.tabId) {
      this.tabId = options.tabId;
    } else {
      throw "No options.tabId found.";
    } 
  }
  async inject() {
    this.tab = await browser.tabs.executeScript({file: './injected.js'});
  }
}

// browser.tabs.create({
//   url: `${EXT_URL}/queue.html`
// });

// console.log('EXT_URL', EXT_URL);

async function capturePage(tabId) {
  // TODO this is just the visible area, need to investigate techniques for capturing the full page
  try {
    let imageUri = await browser.tabs.captureVisibleTab(tabId);
  } catch (e) {
    throw e;
  }

  // const meta = await extractMetaData(tabId);
  console.log(imageUri);

  return {
    imageUri,
    timestamp: Date.now()
  };
}

async function ensureTabIsOpen(url, active=true) {

  let tabs = await browser.tabs.query({ url: url });

  console.log(tabs);

  // tabs[0].executeScript({code: 'console.log("hello from the background")'});

  console.log(tabs[0].id);
  // browser.tabs.executeScript(
  //   tabs[0].id, {code: `console.log('location:', window.location.href);`}
  // );

  let channel = new TabChannel({tabId: tabs[0].id});


}

// ensureTabIsOpen(`${EXT_URL}/queue.html`);

ensureTabIsOpen(APP_URL);

async function runAction(tab) {
  /** Defensive - get the screenshot first before we go monkeying around with opening tabs */
  console.log('got here', tab);
  // const pageInfo = await capturePage(tab.tabId);
  let imageUri = await browser.tabs.captureVisibleTab(tab.tabId);

  // console.log('next', imageUri);

  let pageInfo = {
    url: tab.url,
    imageUri, 
    timestamp: Date.now()
  }

  let key = `patchy-queue::${pageInfo.timestamp}`;
  await localforage.setItem(key, pageInfo);

  // await openApp();
  let created = await browser.tabs.create({
    url: `${EXT_URL}/queue.html`
  });

  // console.log(created);
}

function openApp() {
  browser.tabs.query({ url: APP_URL })
    .then(async tabs => {
      let app = tabs.find(tab => tab.url === APP_URL);

      if (app) {
        console.log('App already open');
      } else {
        console.log('Opening app');
        app = await browser.tabs.create({
          active: false,
          url: APP_URL
        });
      }
    })
    .catch(error => console.log(`Error: ${error}`));
}

browser.browserAction.onClicked.addListener(runAction);
