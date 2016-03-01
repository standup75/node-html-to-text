var _ = require('underscore');
var _s = require('underscore.string');
var he = require('he');

var helper = require('./helper');

function formatText(elem, options) {
	var text = (options.isInPre ? elem.raw : _s.strip(elem.raw));
	text = he.decode(text, options.decodeOptions);

	if (options.isInPre) {
		return text;
	} else {
		return helper.wordwrap(elem.needsSpace ? ' ' + text : text, options.wordwrap, options.preserveNewlines);
	}
}

function formatSpan(elem, fn, options) {
	return fn(elem.children, options);
}

function formatImage(elem, options) {
	if (options.ignoreImage) {
		return '';
	}
	var attribs = elem.attribs || {};
	if (attribs.src) {
		return '<img src="' + attribs.src + '" alt="' + attribs.alt +'">';
	} else {
		return '';
	}
}

function formatLineBreak(elem, fn, options) {
	return '<br>' + fn(elem.children, options);
}

function formatParagraph(elem, fn, options) {
	return fn(elem.children, options) + '<br><br>';
}

function formatHeading(elem, fn, options) {
	return fn(elem.children, options).toUpperCase() + '<br>';
}

// If we have both href and anchor text, format it in a useful manner:
// - "anchor text [href]"
// Otherwise if we have only anchor text or an href, we return the part we have:
// - "anchor text" or
// - "href"
function formatAnchor(elem, fn, options) {
	var attribs = elem.attribs || {};
	var href = attribs.href;
	// Always get the anchor text
	var result = _s.strip(fn(elem.children || [], options));
	if (!result) {
		result = '';
	}
	if (!options.ignoreHref && href && href.match(/^http/)) {
		result = ' <a target="_blank" href="' + href + '">' + result + '</a> ';
	}
	return result;
}

function formatHorizontalLine(elem, fn, options) {
	return '<br>' + _s.repeat('-', options.wordwrap) + '<br><br>';
}

function formatListItem(prefix, elem, fn, options) {
	options = _.clone(options);
	// Reduce the wordwrap for sub elements.
  if (options.wordwrap) {
  	options.wordwrap -= prefix.length;
  }
	// Process sub elements.
	var text = fn(elem.children, options);
	// Replace all line breaks with line break + prefix spacing.
	text = text.replace(/<br>/g, '<br>' + _s.repeat(' ', prefix.length));
	// Add first prefix and line break at the end.
	return prefix + text + '<br>';
}

function formatUnorderedList(elem, fn, options) {
	var result = '';
	_.each(elem.children, function(elem) {
		result += formatListItem(' * ', elem, fn, options);
	});
	return result + '<br>';
}

function formatOrderedList(elem, fn, options) {
	var result = '';
	// Make sure there are list items present
	if (elem.children && elem.children.length) {
		// Calculate the maximum length to i.
		var maxLength = elem.children.length.toString().length;
		_.each(elem.children, function(elem, i) {
			var index = i + 1;
			// Calculate the needed spacing for nice indentation.
			var spacing = maxLength - index.toString().length;
			var prefix = ' ' + index + '. ' + _s.repeat(' ', spacing);
			result += formatListItem(prefix, elem, fn, options);
		});
	}
	return result + '<br>';
}

function tableToString(table) {
	// Determine space width per column
	// Convert all rows to lengths
	var widths = _.map(table, function(row) {
		return _.map(row, function(col) {
			return col.length;
		});
	});
	// Invert rows with colums
	widths = helper.arrayZip(widths);
	// Determine the max values for each column
	widths = _.map(widths, function(col) {
		return _.max(col);
	});

	// Build the table
	var text = '';
	_.each(table, function(row) {
		var i = 0;
		_.each(row, function(col) {
			text += _s.rpad(_s.strip(col), widths[i++], ' ') + '   ';
		});
		text += '<br>';
	});
	return text + '<br>';
}

function formatTable(elem, fn, options) {
	var table = [];
	_.each(elem.children, tryParseRows);
	return tableToString(table);

	function tryParseRows(elem) {
		if (elem.type !== 'tag') {
			return;
		}
		switch (elem.name.toLowerCase()) {
			case "thead":
			case "tbody":
			case "tfoot":
			case "center":
				_.each(elem.children, tryParseRows);
				return;

			case 'tr':
				var rows = [];
				_.each(elem.children, function(elem) {
					var tokens, times;
					if (elem.type === 'tag') {
						switch (elem.name.toLowerCase()) {
							case 'th':
								tokens = formatHeading(elem, fn, options).split('<br>');
								rows.push(_.compact(tokens));
								break;

							case 'td':
								tokens = fn(elem.children, options).split('<br>');
								rows.push(_.compact(tokens));
								// Fill colspans with empty values
								if (elem.attribs && elem.attribs.colspan) {
									times = elem.attribs.colspan - 1;
									_.times(times, function() {
										rows.push(['']);
									});
								}
								break;
						}
					}
				});
				rows = helper.arrayZip(rows);
				_.each(rows, function(row) {
					row = _.map(row, function(col) {
						return col || '';
					});
					table.push(row);
				});
				break;
		}
	}
}

exports.text = formatText;
exports.span = formatSpan;
exports.image = formatImage;
exports.lineBreak = formatLineBreak;
exports.paragraph = formatParagraph;
exports.anchor = formatAnchor;
exports.heading = formatHeading;
exports.table = formatTable;
exports.orderedList = formatOrderedList;
exports.unorderedList = formatUnorderedList;
exports.listItem = formatListItem;
exports.horizontalLine = formatHorizontalLine;
