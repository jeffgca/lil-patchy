/* global browser localforage */

const APP_URL = 'https://stupid-enormous-square-hero.fission.app/';
const EXT_URL = browser.runtime.getURL('/');

let Ports = {};

(async () => {

/**
 *   "content_scripts": [
    {
      "matches": ["https://stupid-enormous-square-hero.fission.app/"],
      "js": ["proxy.js"]
    }
  ],
 * 
*/

  await browser.contentScripts.register({
    matches: [`${APP_URL}`],
    js: [{
      code: `window.patchy = { 
        ext: '${EXT_URL}',
        app: '${APP_URL}' };`
    }, {
      file: "/proxy.js"
    }]
  });

  // register the content scripts
  // function that fetches data from localforage
  // XXX todo: spec out new interaction between 
  // extension and web app based on this new model.

  async function getPatchyQueue(isUploaded=false) {
    console.log('in getPatchyQueue', isUploaded);
    let data = [], keys = [];
    let completed = await localforage.iterate((value, key, i) => {
      // console.log(i, key, value);
      if (value.uploaded === isUploaded) {
        data.push(value);
        // keys.push(key);
      }
    });
    // console.log(completed, data);
    return data;
  }

  function connected(port) {
    port.onMessage.addListener( async (event) => {
      console.log('from port', event);
      let data = await getPatchyQueue();
      port.postMessage({id: EXT_URL, data: data});
    });

    Ports[port.sender.tab.id] = port;
  }

  browser.runtime.onConnect.addListener(connected);

})();
