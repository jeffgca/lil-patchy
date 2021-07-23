# Lil Patchy

This web extension works with a compatible Fission Application to enable saving / archiving web pages directly to IPFS. 

Lil Patchy captures the following information when `saving` a page:

* a screenshot of the page
* some web page meta-data 
* the time of the capture
* [ eventually ] the full article text and additional text content from the page.

This extension is currently designed to work with the [Lil Patchy Saver](https://github.com/bgins/lil-patchy-saver) companion web app.

### TODO:

* [✓] re-factoring
* [✓] capture target page contents and parse for metadata
* [✓] test / fix up data transfer with the saver app
* [] get github action passing ( skip tests for now )
* [] identify articles and parse target page for article text?
* [] identify recipes and parse target page for recipe?
* [] investigate using [browser polyfill](https://github.com/mozilla/webextension-polyfill#installation)
* [] actually write and run tests?
* [] test on other browsers...
* [] auto-publishing releases?
* [] options page to set the web app url
* [] docs
* [] use yarn for deps or something?

