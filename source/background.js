/* global browser */

const APP_URL = 'https://stupid-enormous-square-hero.fission.app/';
const EXT_URL = browser.runtime.getURL('pages');

console.log(EXT_URL);


async function captureTabImage(tabId) {
  console.log('captureTabImage');
  return await browser.tabs.captureVisibleTab(tabId);
}

async function handlePageData(data) {
  console.log('handlePageData');
  let imageData = await captureTabImage();
  let ts = Date.now();
  let pageInfo = {
    imageData: imageData,
    timestamp: ts,
    meta: data
  };

  console.log(pageInfo);

  let key = `patchy-queue::${pageInfo.timestamp}`;
  localforage.setItem(key, pageInfo).then((result) => {
    console.log("okay?");
    setTimeout(() => {
      openQueue();
    }, 2000);
  })
  .catch((err) => { throw err; });
}

browser.runtime.onMessage.addListener(handlePageData);

async function captureMetaData(tabId) {
  let page = await browser.tabs.executeScript(tabId, {
    file: './meta-scraper.js'
  });

  return page;
}

async function ensureTabIsOpen(url, active=true) {

  let tabs = await browser.tabs.query({ url: url });

  console.log(tabs);

}

async function runAction(tab) {

  await browser.tabs.executeScript(tab.tabId, {
    file: 'meta-scraper.js'
  });
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

function openQueue() {
  browser.tabs.create({
    url: `${EXT_URL}/queue.html`,
    active: false
  });
}

// browser.runtime.onMessage.addListener((request, sender, sendResponse) => {

//   if (browser.runtime.id === sender.id) {
//     console.log(request, sender, sendResponse);
//   }
//   else {
//     console.log(`Caught message from another extension: ${sender.id}`);
//   }
  
// });
