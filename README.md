
GoogleFormNotifier
==================

`GoogleFormNotifier` is a simple Google Apps Script that can be installed
on any Google Spreadsheets form to notify an arbitrary list of people upon
form submission. The email that is generated is an HTML summary of the form
data submitted.

Dependencies
------------

This script depends on [Handlebars.js](http://www.handlebarsjs.com/) and 
[Underscore.js](http://documentcloud.github.com/underscore/). The
`google_form_notifier-bundled.js` file has these dependencies
pre-packaged and minified. If you're going to be doing development on
this script, you may need to make sure these are loaded and available.

Usage
-----

Before you add this script, create a new sheet and name it 'Notification
list' (case-sensitive). Add the email addresses you want to notify in
the first column of this sheet.

### 1. Include the script

To use this script, place it on a web server that you control or trust (notice
the `eval`) and include it into your Google Apps script like so:

    eval(UrlFetchApp.fetch('http://example.com/google_form_notifier-0.9.0-bundled.js').getContentText());

### 2. Authorize the script

The first time you try to use this script, you'll have to fake-out Google by
adding these lines and authorizing the functionality:

    // Temporarily uncomment these lines to "authorize" the funcationality.
    //
    // SpreadsheetApp.getActiveSpreadsheet().getSheetByName("blah");
    // MailApp.sendEmail("someone@example.com, "blah", "blah");
    // Utilities.jsonStringify({"blah":"blahblah"});
    // SpreadsheetApp.getActiveSpreadsheet().getOwner().getEmail();

Click the 'Run' button in the script editor and Google will pop up a
message to authorize the actions. Click 'authorize' and then comment
these lines back out or delete them.

### 3. Use the script

After these functions have been authorized, you can use the `GoogleFormNotifier`
object. Just add a function to handle the `onSubmit` trigger:

    function onSubmit(evt) {
      GoogleFormNotifier.notify(evt);
    }

Development
-----------

If you're going to hack on this script, you'll want to circumvent Google 
Apps' caching by adding a random number to the url string:

    eval(UrlFetchApp.fetch('http://example.com/google_form_notifier.js?' + Math.random().toString()).getContentText());

If you want to contribute, consider these possible TODOs:

 - Write about what Handlebars is and how to use custom templates.
 - Create some simple unit tests?
 - Find a graceful way to set the 'to' address or change the bcc
   notification scheme if not respondent username is collected.
