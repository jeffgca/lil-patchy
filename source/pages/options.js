/* global localforage DEFAULT_APP_URL */

function saveOptions(event) {
  event.preventDefault();
  localforage.setItem('APP_URL', document.querySelector('#app-url').value);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector('#app-url').value = result || DEFAULT_APP_URL || 'No APP_URL Configured';
  }

  function onError(error) {
    console.log(`Options page error: ${error}`);
  }

  localforage.getItem('APP_URL')
    .then(setCurrentChoice, onError);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
