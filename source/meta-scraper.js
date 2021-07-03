
window.onMessage.addListener(event => {
  console.log('Got message', event);
});

window.addListener('DOMContentLoaded', ev => {
  console.log('DOMContentLoaded triggered in the add-on', ev);
});

