let pre = document.querySelector('pre#queue');

localforage.iterate(function(value, key, i) {
  // Resulting key/value pair -- this callback
  // will be executed for every item in the
  // database.
  console.log([key, value]);

  pre.textContent += `${i}: ${JSON.stringify([key, value.url])}\n`;

}).then(function() {
  console.log('Iteration has completed');
}).catch(function(err) {
  // This code runs if there were any errors
  console.log(err);
});


