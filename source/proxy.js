browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      sendResponse({ farewell: "goodbye" });

      console.log("In content script: ", request)
      window.postMessage({ detail: request}, 'https://stupid-enormous-square-hero.fission.app/');
  }
);