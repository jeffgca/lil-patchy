/* global browser localforage */

async function captureTabImage(tabId) {
  console.log('captureTabImage');
  return browser.tabs.captureVisibleTab(tabId);
}

async function handlePageData(data) {
  console.log('handlePageData', data);
  const imageData = await captureTabImage();
  const ts = Date.now();
  const pageInfo = {
    imageData,
    timestamp: ts,
    meta: data.data,
    url: data.url
  };

  const key = `patchy-queue::${pageInfo.timestamp}`;

  console.log('storing...', key, pageInfo);

  localforage.setItem(key, pageInfo).then(result => {
    console.log('okay?', result);
  }).catch(error => {
    throw error;
  });
}

async function runAction(message) {
  console.log('runAction fired');
  return browser.tabs.executeScript(message.tabId, {
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

// browser.browserAction.onClicked.addListener(runAction);

function openQueue() {
  browser.tabs.create({
    url: `${EXT_URL}/queue.html`,
    active: false
  });
}

async function getCurrentActiveTab() {
  let result = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  if (result.length >= 1) {
    return result[0];
  }
  else {
    throw "No current active tab?", result;
  }
}


// handles and routes messages
function messageHandler(message) {
  if (message.type === 'page-data') {
    handlePageData(message);
  }
  else if (message.type === 'tab-id') {
    runAction(message).then((result) => {
      console.log('after runAction', result);
    })
    .catch(error => { throw "Error from runAction", error });
    
  }
}
