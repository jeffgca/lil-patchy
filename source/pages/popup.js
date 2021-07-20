/* global browser */


(async () => {

  let tab = await getCurrentActiveTab();

  let imageData = await captureTabImage(tab.id);

  // console.log(tab);

  // browser.runtime.sendMessage({
  //   type: 'tab-id',
  //   tabId: tab.id
  // });





})();