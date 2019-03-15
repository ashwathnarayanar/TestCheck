t lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
//const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator');
const log = require('lighthouse-logger');
const opts = {
  logLevel: 'info',
  output: 'html',
  chromeFlags: ['--show-paint-rects']
};

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results =>
      chrome.kill().then(() => { return new ReportGenerator().generateReportHtml(results); }));
  });
}

launchChromeAndRunLighthouse('https://m.kohls.com', opts).then(results => {
  fs.writeFile('lighthouse/report_child.html', results, function(err) {
    if (err) { console.log(err); }
  });
});
