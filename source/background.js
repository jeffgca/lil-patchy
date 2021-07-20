/* global browser localforage */

const APP_URL = 'https://stupid-enormous-square-hero.fission.app/';
const EXT_URL = browser.runtime.getURL('pages');

browser.runtime.onMessage.addListener(messageHandler);

