/* global localforage */

(async () => {

  const list = document.querySelector('div#queue');

  // list.insertAdjacentHTML('beforeend', `<p id="loading-para">Loading...</p>`);
  
  const emoji = {
    local: '🐛',
    uploaded: '🦋'
  }
  
  let content = [];
  
  let numRecords = await localforage.length();
  
  console.log('numRecords', numRecords);
  
  if (numRecords > 0) {
    localforage.iterate((value, key, i) => {
      // console.log(i, key, value);
    
      let imageSrc = value.meta.image || value.imageUri;
    
      let uploadedEmoji = emoji.local;
      let uploadedStatusTxt = `Stored locally.`;
    
      if (value.uploaded === true) {
        uploadedEmoji = emoji.uploaded;
        uploadedStatusTxt = `Successfully synchronized.`;
      }
    
      let block = `<div>
        <a href="${value.url}" target="_blank">
          <img src="${imageSrc}" width="160">
        </a>
        <h2>${value.meta.title}</h2>
        <p>${value.meta.description}</p>
        <p>
          [ <a href="${value.url}" target="_blank">Link</a> ] || 
          <span>Status: ${uploadedEmoji} ${uploadedStatusTxt}</span>
        </p>
      </div>`;
    
      content.push(block);
      
    }).then(() => {
      list.insertAdjacentHTML('beforeend', content.join("\n"));
      console.log('Iteration has completed');
    }).catch(error => {
      // This code runs if there were any errors
      throw error;
    });
  }
})();

