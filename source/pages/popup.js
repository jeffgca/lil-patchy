/* global browser */

(async () => {

  let APP_URL = await localforage.getItem('APP_URL');

  let badgeString = await browser.browserAction.getBadgeText({}), currentCount;

  let badgeInt = parseInt(badgeString);

  console.log('badgeString', badgeString, badgeInt);

  if (!APP_URL) {
    APP_URL = DEFAULT_APP_URL || "No APP_URL Configured?";
  }
  
  function tplSavedDate(ts) {
    let d = new Date(ts);
    let dateString = d.getUTCDate();
    return `<span>Saved on ${dateString}</span>`;
  }
  
  function setDisplay(parentSelector, data) {
    let wrapper = document.querySelector(parentSelector);
    let content = `<img width="350" src="${data.imageUri}">
    <h3>${data.meta.title}</h3>
    <p>${data.meta.description}</p>
    `;
    wrapper.insertAdjacentHTML('beforeend', content);
  }
  
  function setError(parentSelector, error) {
    let wrapper = document.querySelector(parentSelector);
    let content = `<h1>Error:</h1>
    <pre>${error}</pre>`;
    wrapper.insertAdjacentHTML('beforeend', content);
    wrapper.className = 'error';
  }
  
  const ts = Date.now();
  const key = `patchy-queue::${ts}`;
  
  document.querySelector('#app-link').href = APP_URL;
  
  // get current activeTab
  
  let result = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  
  let currentTab = result.pop();
  
  // get the screenshot
  let imageUri = await browser.tabs.captureVisibleTab(currentTab.windowId);
  
  let metaResult = await browser.tabs.executeScript(currentTab.id, {
    file: '/meta-scraper.js'
  });
  
  let pageInfo = {
    timestamp: ts,
    url: currentTab.url,
    meta: metaResult[0],
    uploaded: false,
    imageUri
  }
  
  localforage.setItem(key, pageInfo).then(result => {
    // console.log('okay?', result);
    // represent the saved page
    setDisplay('div#saved-content', pageInfo);
    badgeInt++;
    console.log('in setItem', badgeInt);

    let details = {
      text: `${badgeInt}`
    };

    browser.browserAction.setBadgeText(details)
      .then(() => {
        console.log('done?');
      });
  }).catch(error => {
    throw error;
  });
})();

