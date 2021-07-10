/* global browser localforage */

const APP_URL = 'https://stupid-enormous-square-hero.fission.app/';
const EXT_URL = browser.runtime.getURL('pages');

async function captureTabImage(tabId) {
  console.log('captureTabImage');
  return browser.tabs.captureVisibleTab(tabId);
}

async function handlePageData(data) {
  console.log('handlePageData');
  const imageData = await captureTabImage();
  const ts = Date.now();
  const pageInfo = {
    imageData,
    timestamp: ts,
    meta: data
  };

  const key = `patchy-queue::${pageInfo.timestamp}`;
  localforage.setItem(key, pageInfo).then(result => {
    console.log('okay?', result);
    setTimeout(() => {
      openQueue();
    }, 1000);
  }).catch(error => {
    throw error;
  });
}

browser.runtime.onMessage.addListener(handlePageData);

async function captureMetaData(tabId) {
  const page = await browser.tabs.executeScript(tabId, {
    file: './meta-scraper.js'
  });

  return page;
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
