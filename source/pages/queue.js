/* global localforage */
const pre = document.querySelector('pre#queue');

localforage.iterate((value, key, i) => {
  // Resulting key/value pair -- this callback
  // will be executed for every item in the
  // database.
  console.log([key, value]);
  pre.textContent += `${i}: ${JSON.stringify([key, value.meta], null, '  ')}\n`;
}).then(() => {
  console.log('Iteration has completed');
}).catch(error => {
  // This code runs if there were any errors
  console.log(error);
});
