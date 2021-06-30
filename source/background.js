/* global browser */

const APP_URL = 'https://stupid-enormous-square-hero.fission.app/';

async function capturePage(tabId) {
  const imageUri = await browser.tabs.captureTab(tabId);

  return {
    imageUri,
    timestamp: Date.now()
  };
}

async function runAction(tab) {

  /** defensive - get the screenshot first before we go monkeying around with opening tabs */
  const pageInfo = await capturePage(tab.tabId);

  pageInfo.url = tab.url;

  browser.tabs.query({ url: APP_URL })
    .then(async tabs => {
      let app = tabs.find(tab => tab.url === APP_URL);

      if (!app) {
        console.log('Opening app');
        app = await browser.tabs.create({
          active: false,
          url: APP_URL
        });
      } else {
        console.log('App already open');
      }

      console.log('pageInfo>', pageInfo);

      browser.tabs.sendMessage(app.id, pageInfo, response => {
        console.log('Response from content script:', response.farewell);
      });
    })
    .catch(error => console.log(`Error: ${error}`));
}

browser.browserAction.onClicked.addListener(runAction);
