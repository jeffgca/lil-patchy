/* global browser */

const APP_URL = 'https://stupid-enormous-square-hero.fission.app/';

async function capturePage() {
  const imageUri = await browser.tabs.captureTab();

  return {
    imageUri,
    timestamp: Date.now(),
    url: browser.tabs.ActiveTab.url
  };
}

async function runAction() {
  browser.tabs.query({ url: APP_URL })
    .then(async tabs => {
      const tab = tabs.find(tab => tab.url === APP_URL);

      if (tab) {
        console.log('App already open');

        const pageInfo = await capturePage();

        browser.tabs.sendMessage(tab.id, pageInfo, response => {
          console.log('Response from content script:', response.farewell);
        });
      } else {
        console.log('Opening app');

        browser.tabs.create({
          active: false,
          url: APP_URL
        });

        // Now what?
      }
    })
    .catch(error => console.log(`Error: ${error}`));
}

browser.browserAction.onClicked.addListener(runAction);
