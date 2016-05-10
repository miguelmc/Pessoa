/*
 Run with `protractor app/tests/protractor.tests.conf.js`.
 Start Selenium server with `webdriver-manager start`.
 `node server.js` should be running in background as well.
*/

var path = require('path');
var BASE_URL = 'http://localhost:8080/';
var TEST_ADMIN_USERNAME = 'micah';
var TEST_ADMIN_PASSWORD = 'brown123';
var PATH_TO_TEST_PDF = 'test.pdf'

function backspace(elt, times) {
  for (i = 0; i < times; i++) {
    elt.sendKeys(protractor.Key.BACK_SPACE);
  }
}

describe('admin login/logout test', function() {
  it('logs in as admin, then logs out', function() {
    var EC = protractor.ExpectedConditions;
    browser.get(BASE_URL);
    element(by.linkText('Sign in')).click();
    element(by.name('username')).sendKeys(TEST_ADMIN_USERNAME);
    element(by.name('password')).sendKeys(TEST_ADMIN_PASSWORD);
    element(by.buttonText('Sign in')).click();

    // We should be on the home page again now
    expect(EC.textToBePresentInElement(
      element(by.cssContainingText('p', 'Signed in as')),
      TEST_ADMIN_USERNAME));

    // Clean up (sign out)
    element(by.linkText('Sign out')).click();
  });
});

describe('issue creation test', function() {
  it('uses admin acct to create an issue', function() {
    // Sign in as admin
    browser.get(BASE_URL);
    element(by.linkText('Sign in')).click();
    element(by.name('username')).sendKeys(TEST_ADMIN_USERNAME);
    element(by.name('password')).sendKeys(TEST_ADMIN_PASSWORD);
    element(by.buttonText('Sign in')).click();
    element(by.cssContainingText('.nav', 'Issues')).click();
    element(by.linkText('CREATE NEW ISSUE')).click();

    // Populate the issue form
    backspace(element(by.model('issueNumber')), 1);
    element(by.model('issueNumber')).sendKeys('123');
    element(by.model('notesEn')).sendKeys('Test Issue, Please Ignore');
    element(by.model('season')).click();
    browser.waitForAngular();  // Wait for seasons dropdown to appear
    element(by.cssContainingText('md-option', 'Spring')).click();
    backspace(element(by.model('year')), 4);
    element(by.model('year')).sendKeys('2020');
    // TODO: implement PDF upload test
    // element(by.buttonText('Upload issue\'s main pdf (optional)')).sendKeys(
    //   path.resolve(__dirname, PATH_TO_TEST_PDF));

    element(by.model('article.author')).sendKeys('John Doe');
    element(by.model('article.type')).click();
    browser.waitForAngular();  // Wait for data type to appear
    element(by.cssContainingText('md-option', 'Article')).click();
    backspace(element(by.model('article.titleEn')), 7);
    element(by.model('article.titleEn')).sendKeys('Test English Article Title');
    element(by.model('article.titlePt')).sendKeys('Test Portuguese Article Title');
    element(by.model('article.keywordsEn')).click();
    browser.actions()
      .sendKeys('Hello')
      .sendKeys(protractor.Key.ENTER)
      .sendKeys('World')
      .sendKeys(protractor.Key.ENTER)
      .perform();
    element(by.model('article.abstractDescEn')).sendKeys('This is an English abstract.');
    element(by.model('article.keywordsPt')).click();
    browser.actions()
      .sendKeys('Goodbye')
      .sendKeys(protractor.Key.ENTER)
      .sendKeys('Earth')
      .sendKeys(protractor.Key.ENTER)
      .perform();
    element(by.model('article.abstractDescPt')).sendKeys('This is a Portuguese abstract.');

    // Gets hacky here - elements are found via hardcoded IDs
    // (IDs generated in issues.client.controller.js)
    element(by.buttonText('+ Add entry')).click();
    element(by.id('input_23')).sendKeys('Jane Deere');
    element(by.id('select_29')).click();
    browser.waitForAngular();  // Wait for data type to appear
    element(by.id('select_option_26')).click();
    backspace(element(by.id('input_31')), 7);
    element(by.id('input_31')).sendKeys('#2 Test English Article Title');
    element(by.id('input_32')).sendKeys('#2 Test Portuguese Article Title');
    // Not sure how to access next mg-chips section (keywords)
    element(by.id('input_33')).sendKeys('#2 This is an English abstract.');
    element(by.id('input_34')).sendKeys('#2 This is a Portuguese abstract.');

    element(by.buttonText('Submit')).click();

    // Now we are at the page for the newly-created issue
    // Check all elements of the issue view
    var title = element(by.cssContainingText('h1', 'Issue'));
    expect(title.getText()).toEqual('Issue 123, Spring 2020 (Test Issue, Please Ignore)');
    var titlePt = element(by.binding('seasons[issue.season]'));
    expect(titlePt.getText()).toEqual('Numero 123, primavera de 2020');
    var editLink = element(by.linkText('edit'));
    expect(editLink.isPresent()).toBe(true);
    var deleteLink = element(by.linkText('delete'));
    expect(deleteLink.isPresent()).toBe(true);
    var downloadLink = element(by.linkText("Download issue's main pdf"));
    expect(downloadLink.isPresent()).toBe(true);
    var dateText = element(by.binding('issue.created'));
    expect(dateText.isPresent()).toBe(true);
    var entryList = element(by.id('entry-list'));
    expect(entryList.isPresent()).toBe(true);
  });
});


