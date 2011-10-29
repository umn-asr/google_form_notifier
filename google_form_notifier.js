(function() {

  GoogleFormNotifier = {
    VERSION:"0.9.0",
    _htmlTemplate:undefined,
    _textTemplate:undefined
  };

  /**
   * notify()
   * --------
   *
   * This is the main function of this script. It excpects the event object for
   * a form submission ('On form submit' trigger). Call this method in your 
   * Google Apps script:
   *
   *     function onSubmit(evt) {
   *       GoogleFormNotifier.notify(evt);
   *     }
   *
   * Optionally, you can pass in and extra `mailOptions` parameter for more
   * control over how your message is sent. The `mailOptions` object is the
   * same as the `mailOptions` object for the `MailApp` Google class.
   *
   *     function onSubmit(evt) {
   *       var mailOptions = {"noReply":true};
   *       GoogleFormNotifier.notify(evt, mailOptions);
   *     }
   *
   * Check out Google's `MailApp` class [documentation](http://code.google.com/googleapps/appsscript/class_mailapp.html#sendEmail) for more examples.
   *
   */
  GoogleFormNotifier.notify = function(evt, mailOptions) {
    if (evt.namedValues === undefined) {
      throw "GoogleFormNotifier: You must check the 'Automatically collect respondent's username' on the form"
    }
    var username = evt.namedValues["Username"].toString();
    var recipients = this._getRecipients();
    var subject = this._getSubject();
    var htmlBody = this._render(this._transformNamedValues(evt.namedValues), this.htmlTemplate());
    var textBody = this._render(this._transformNamedValues(evt.namedValues), this.textTemplate());
    if (mailOptions === undefined) {
      mailOptions = {
        bcc: recipients.join(","),
        replyTo: username,
        htmlBody: htmlBody
      };
    }
    MailApp.sendEmail(username, subject, textBody, mailOptions);
  };

  /**
   * htmlTemplate()
   * --------------
   *
   * Gets and sets the [Handlebars](http://www.handlebarsjs.com/) template for 
   * the HTML email message body. A default template is supplied and can be 
   * optionally overridden:
   *
   *     function onSubmit(evt) {
   *       var customTemplate = "<h1>A custom template!</h1>" +
   *                            "{{#formData}}" + 
   *                            "  <h2>{{column}}</h2>" +
   *                            "  <p>{{value}}</p>" +
   *                            "{{/formData}}";
   *       GoogleFormNotifier.htmlTemplate(customTemplate);
   *       GoogleFormNotifier.notify(evt);
   *     }
   *
   */
  GoogleFormNotifier.htmlTemplate = function(template) {
    if (template === undefined) {
      if (this._htmlTemplate === undefined) {
        this._htmlTemplate = "<h1>" + this._getSubject() + "</h1><hr />{{#formData}}<h2 style=\"font-size:12px;margin:20px 0 5px 0;\">{{column}}</h2><p style=\"padding:4px;border:1px solid #ccc;background:#e9e9e9;color:#333;\">{{value}}</p>{{/formData}}";
      }
    }
    else {
      this._htmlTemplate = template;
    }
    return this._htmlTemplate;
  }

  /**
   * textTemplate()
   * --------------
   *
   * Gets and sets the [Handlebars](http://www.handlebarsjs.com/) template for 
   * the plaintext email message body (Google requires a fallback for HTML 
   * emails). Works just like the `htmlTemplate`:
   *
   *     function onSubmit(evt) {
   *       var customTemplate = "A plaintext template" +
   *                            "--------------------" +
   *                            "{{#formData}}" + 
   *                            "  {{column}}: {{value}}" +
   *                            "{{/formData}}";
   *       GoogleFormNotifier.textTemplate(customTemplate);
   *       GoogleFormNotifier.notify(evt);
   *     }
   *
   */
  GoogleFormNotifier.textTemplate = function(template) {
    if (template === undefined) {
      if (this._textTemplate === undefined) {
        this._textTemplate = this._getSubject() + "\n\n{{#formData}}{{column}}:{{value}}\n\n{{/formData}}";
      }
    }
    else {
      this._textTemplate = template;
    }
    return this._textTemplate;
  }

  /**
   * _transformNamedValues()
   * -----------------------
   *
   * A private helper method that adds keys to `evt.namedValues` object so it
   * can be used by a Handlebars template. This method also attempts to correct
   * the order of the columns by looking at the order of the columns in the
   * spreadsheet. The namedValues object is not an array and therefore has no
   * order.
   *
   * Turns
   *
   *     {namedValues:{"Some column name":"Some value a user entered}}
   *
   * into:
   *
   *     {formData:[{column:"Some column name",value:"Some value a user entered}]}
   *
   */
  GoogleFormNotifier._transformNamedValues = function(namedValues) {
    var ret = [];
    var columnCount = 0;
    // count the number of columns
    for (prop in namedValues) {
      if (namedValues.hasOwnProperty(prop)) {
        columnCount++;
      }
    }
    var header = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getRange(1, 1, 1, columnCount).getValues();
    for (i in header[0]) {
      ret.push({column:header[0][i], value:namedValues[header[0][i]]});
    }
    return {"formData":ret};
  };

  /**
   * _getRecipients()
   * ----------------
   *
   * A private helper method that grabs email addresses out of
   * `Notification list` sheet of the form's spreadsheet. Returns an array of
   * email addresses.
   *
   */
  GoogleFormNotifier._getRecipients = function(sheetName) {
    if (sheetName === undefined) {
      sheetName = "Notification list";
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var dataRange = sheet.getDataRange(); // Get Range with active data
    var data = dataRange.getValues(); // Fetch values for each row in the Range.
    var emailList = [];
    for (i=1;i<data.length;i++) { // This assumes you have a title row and starts at 1
      var row = data[i];
      var emailAddress = row[0];  // First column
      emailList.push(emailAddress);
    }
    return emailList;
  };

  /**
   * _getSubject()
   * -------------
   *
   * A private helper method that builds a subject line for the email message.
   * If the spreadsheet is named "Some cool spreadsheet", this method would
   * return "A 'Some cool spreadsheet' form has been submitted".
   *
   */
  GoogleFormNotifier._getSubject = function() {
    var spreadsheetName = SpreadsheetApp.getActiveSpreadsheet().getName();
    var article = "A";
    var pattern = new RegExp(/^[aeiouy]/i);
    if (pattern.test(spreadsheetName)) {
      article = "An";
    }
    return article + " '" + spreadsheetName + "' form has been submitted";
  }

  /**
   * _render()
   * ---------
   *
   * A private helper method that renders a Handlebars template. It returns
   * the rendered content.
   *
   */
  GoogleFormNotifier._render = function(data, template) {
    var compiledTemplate = Handlebars.compile(template);
    var rendered = compiledTemplate(data);
    return rendered;
  }

})();

