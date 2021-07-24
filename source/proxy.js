/* global browser */

console.log('help I\'m alive in the content script');

console.log('window.patchy', window.patchy);
const extPort = browser.runtime.connect({ name: 'ext-proxy' });

window.addEventListener('message', event => {
  console.log('cs message listener', event);

  if (event.data.type === 'FROM_PAGE' && event.data.text === 'User is authenticated.') {
    // Signal the extension we're ready
    extPort.postMessage({ id: window.patchy.app, message: 'CS_ATTACHED' });
  }
});

extPort.onMessage.addListener(event => {
  console.log('event', event);
  if (event.id === window.patchy.ext) {
    window.postMessage(event);
  }
});
