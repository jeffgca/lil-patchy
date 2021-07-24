/* global browser localforage DEFAULT_APP_URL */

const Ports = {};

(async () => {
  const EXT_URL = browser.runtime.getURL('/');
  let APP_URL = await localforage.getItem('APP_URL');

  if (!APP_URL) {
    APP_URL = DEFAULT_APP_URL;
  }

  console.log(APP_URL);

  const result = await browser.contentScripts.register({
    matches: [`${APP_URL}/`],
    js: [{
      code: `window.patchy = { 
        ext: '${EXT_URL}',
        app: '${APP_URL}' };`
    }, {
      file: '/roxy.js'
    }]
  });

  // Register the content scripts
  // function that fetches data from localforage
  async function getPatchyQueue(isUploaded = false) {
    console.log('in getPatchyQueue', isUploaded);
    const data = [];
    const result = await localforage.iterate(value => {
      if (value.uploaded === isUploaded) {
        data.push(value);
      }
    });

    return data;
  }

  function connected(port) {
    port.onMessage.addListener(async event => {
      console.log('from port', event);
      const data = await getPatchyQueue();
      port.postMessage({ id: EXT_URL, data });
    });

    Ports[port.sender.tab.id] = port;
  }

  browser.runtime.onConnect.addListener(connected);
})();
