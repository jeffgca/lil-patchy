/* global localforage */
const list = document.querySelector('div#queue');

localforage.iterate((value, key, i) => {

  console.log(i, key, value);

  // Resulting key/value pair -- this callback
  // will be executed for every item in the
  // database.
  let item = document.createElement('div');
  let image = document.createElement('img');
  image.src = value.imageData;
  image.width = 160;
  image.height = 150;

  if (value.meta && value.meta.image) {
    image.src = value.meta.image;
  }

  let imgLink = document.createElement('a');
  imgLink.href = value.url;
  imgLink.target = '_blank';

  imgLink.appendChild(image);

  item.appendChild(imgLink);

  let title = document.createElement('h2');
  title.textContent = value.meta.title;

  item.appendChild(title);

  let desc = document.createElement('span');
  desc.textContent = value.meta.description + "\n\n";

  item.appendChild(desc);

  let link = document.createElement('a');
  link.href = value.url;
  link.textContent = 'Link';
  link.target = '_blank';

  item.appendChild(link);

  list.appendChild(item);
}).then(() => {
  console.log('Iteration has completed');
}).catch(error => {
  // This code runs if there were any errors
  console.log(error);
});
