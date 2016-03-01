# node-mime-email-formatter

An advanced converter that parses HTML and returns simply formatted HTML. It was mainly designed to transform HTML E-Mail templates to valid HTML cured of divitis and, most importantly, where the inline replies are removed.

This was original a fork from https://github.com/werk85/node-html-to-text, but since the output is not text anymore, the repo was renamed to make things clearer

## Installation

```
npm install mime-email-formatter
```

Or when you want to use it as command line interface it is recommended to install it globally via

```
npm install mime-email-formatter -g
```

## Usage
You can read from a file via:

```
var htmlFormatter = require('mime-email-formatter');

htmlFormatter.fromFile(path.join(__dirname, 'test.html'), {
	tables: ['#invoice', '.address']
}, function(err, text) {
	if (err) return console.error(err);
	console.log(text);
});
```

or directly from a string:

```
var htmlFormatter = require('mime-email-formatter');

var text = htmlFormatter.fromString('<h1>Hello World</h1>', {
	wordwrap: 130
});
console.log(text);
```

### Options:

You can configure the behaviour of html-to-text with the following options:

 * `tables` allows to select certain tables by the `class` or `id` attribute from the HTML document. This is necessary because the majority of HTML E-Mails uses a table based layout. Prefix your table selectors with an `.` for the `class` and with a `#` for the `id` attribute. All other tables are ignored. You can assign `true` to this attribute to select all tables. Default: `[]`
 * `wordwrap` defines after how many chars a line break should follow in `p` elements. Set to `null` or `false` to disable word-wrapping. Default: `80`
 * `ignoreHref` ignore all document links if `true`.
 * `ignoreImage` ignore all document images if `true`.
 * `preserveNewlines` by default, any newlines `\n` in a block of text will be removed. If `true`, these newlines will not be removed.
 * `decodeOptions` defines the text decoding options given to `he.decode`. For more informations see the [he](https://github.com/mathiasbynens/he) module.

## License 

(The MIT License)

Copyright (c) 2015 werk85 &lt;legenhausen@werk85.de&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/cc03826a7e68e1bb680cf2226276e031 "githalytics.com")](http://githalytics.com/werk85/node-html-to-text)
