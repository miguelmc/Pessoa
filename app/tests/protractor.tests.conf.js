exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['protractor.tests.js'],
  onPrepare: function() {
    browser.manage().window().setSize(1280, 1024);
  },
  multiCapabilities: [{
    'browserName': 'firefox'
  }, {
    'browserName': 'chrome'
  }]
};

