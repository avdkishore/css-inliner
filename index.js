var fs = require('fs');
var path = require('path');
var inlineCss = require('inline-css');

var args = process.argv;
var htmlFilePath = path.join(__dirname, args[3]);
var cssFilePath = path.join(path.dirname(htmlFilePath), 'styles.css');
var directory = path.dirname(htmlFilePath);

/* options for inline-css */
var options = {
  removeStyleTags: false,
  preserveMediaQueries: true,
  applyStyleTags: false,
  url: ' ' /* required for resolving any href attributes */
}

var css = fs.readFileSync(cssFilePath, 'utf8'); /* utf8 encoding is required to read the file as string */

options.extraCss = css;

fs.readFile(htmlFilePath, 'utf8', function(err, data){
  if (err) {
    console.log(err);
    return;
  }

  var html = data;

  inlineCss(html, options)
    .then(inlinedHtml => {
      return new Promise((resolve, reject) => {
        fs.writeFile(path.join(directory, 'inlinedHtml.html'), inlinedHtml, 'utf8', (e) => {
          if (e) return reject(e);
          return resolve();
        })
      })
    })
    .then(() => {})
    .catch(e => console.err(e));
});
