
GoogleFormNotifier
==================

`GoogleFormNotifier` is a simple Google Apps Script that can be installed
on any Google Spreadsheets form to notify an arbitrary list of people upon
form submission. The email that is generated is an HTML summary of the form
data submitted.

Dependencies
------------

This script depends on [Handlebars.js](http://www.handlebarsjs.com/) and 
[Underscore.js](http://documentcloud.github.com/underscore/). Make sure 
they're available before including this script.

Usage
-----

To use this script, place it on a web server that you control and include it
into your Google Apps script like so:

    eval(UrlFetchApp.fetch('http://example.com/underscore-min.js').getContentText());
    eval(UrlFetchApp.fetch('http://example.com/handlebars.1.0.0.beta.3.js').getContentText());
    eval(UrlFetchApp.fetch('http://example.com/google_form_notifier.js').getContentText());

Then, you can use the `GoogleFormNotifier` object:

    function onSubmit(evt) {
      GoogleFormNotifier.notify(evt);
    }

Development
-----------

If you're going to hack on this script, you'll want to circumvent Google 
Apps' caching by adding a random number to the url string:

    eval(UrlFetchApp.fetch('http://example.com/google_form_notifier.js?' + Math.random().toString()).getContentText());

TODO
----

 - Include dependencies
 - Create soem simple unit tests
 - Write something about the 'Authorization' step in Google Apps Script
