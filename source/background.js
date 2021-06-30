async function runAction() {
  browser.tabs.query({ url: 'https://stupid-enormous-square-hero.fission.app/' })
    .then(async tabs => {
      const tab = tabs.find(tab => tab.url === 'https://stupid-enormous-square-hero.fission.app/');
      if (tab) {
        console.log('App already open')

        let imageUri = await browser.tabs.captureTab();
        let timestamp = Date.now();
        let url = '';

        await browser.tabs.query({ currentWindow: true, active: true })
          .then(tabs => {
            url = tabs[0]?.url ?? 'Could not capture URL';
          })
          .catch(error => {
            console.log(`Error: ${error}`)
          })

        browser.tabs.sendMessage(tab.id, { url, imageUri, timestamp }, function (response) {
          console.log('Response from content script: ', response.farewell);
        });

      } else {
        console.log('Opening app')
        browser.tabs.create({
          active: false,
          url: 'https://stupid-enormous-square-hero.fission.app/'
        });
      }
    })
    .catch(error => console.log(`Error: ${error}`))
}

browser.browserAction.onClicked.addListener(runAction);
