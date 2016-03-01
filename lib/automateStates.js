var tagFilterFunctions = [
	function(elem) {
		return elem.attribs
				&& elem.attribs.class === 'gmail_quote'
				&& elem.children
				&& elem.children.length
				&& !elem.children[0].raw.match(/Forwarded message/);
	}
];
var UNSTOPPABLE_PATTERNS = [
	'Begin forwarded message:',
	/^\W*Forwarded message\W*$/i
];
var STOPPED_PATTERNS = [
	/^\n*(>|&gt;)(\s|&nbsp;)/,										// > 
	/^\n*De(\s|&nbsp;)?:/,												// De :
	/^\n*From(\s|&nbsp;)?:/,											// From :
	/On.+&lt;/,																		// On Nov 18, 2015, at 11:46 AM, Eddie Hull <
	/^\W*Original message\W*$/i
];


function hasPattern(textNode, patternArray) {
	return patternArray.filter(function(pattern){ return textNode.match(pattern) }).length;
}
function getAutomateStateForTagNode(elem) {
	if (tagFilterFunctions.filter(function(fct) { return fct(elem); }).length ) {
		return exports.STOPPED;
	}
	return exports.NORMAL;
}
function getAutomateStateForTextNode(elem) {
	if (hasPattern(elem.raw, STOPPED_PATTERNS)) {
		return exports.STOPPED;
	} else if (hasPattern(elem.raw, UNSTOPPABLE_PATTERNS)) {
		return exports.UNSTOPPABLE;
	}
	return exports.NORMAL;
}

// Unstoppable (2) + Normal (0)  = 2
// Unstoppable (2) + Stopped (1) = 2
// Normal (0) + Unstoppable (2)  = 2
// Normal (0) + Stopped (1)      = 1
// Stopped (1) + Unstoppable (2) = 1
// Stopped (1) + Normal (0)      = 1

exports.NORMAL = 0;
exports.STOPPED = 1;
exports.UNSTOPPABLE = 2;
exports.getState = function(elem, automateState) {
	if (automateState === exports.STOPPED || automateState === exports.UNSTOPPABLE) {
		return automateState;
	} else {
		return elem.type === "tag" ? getAutomateStateForTagNode(elem) : getAutomateStateForTextNode(elem);
	}
}