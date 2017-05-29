/*
@author Ilya Shubentsov

MIT License

Copyright (c) 2017 Ilya Shubentsov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict'
var regexputilities = {};

regexputilities.reconstructRegExpWithWhiteSpaces = function(regExpString, includeOptionalPunctuationAtEnd){
//	console.log("regExpString: ", regExpString);
	// Now split regExString into non-white space parts and reconstruct the
	// whole thing with any sequence of white spaces replaced with a white space
	// reg exp.
	let splitRegExp = regExpString.split(/\s+/);
	let reconstructedRegExp = "^\\s*";
	let allowZeroWhitespaces = false;
	for(let j = 0; j < splitRegExp.length; j++){
		if(splitRegExp[j].length > 0){
			if(j > 0 && splitRegExp[j].endsWith("{0,1}")){
//				console.log("do allow zero whitespace for " + splitRegExp[j]);
				reconstructedRegExp += "\\s*";
				allowZeroWhitespaces = true;
			}
			else if (allowZeroWhitespaces){
				allowZeroWhitespaces = false;
				reconstructedRegExp += "\\s*";
			}
			else if(j > 0){
//				console.log("don't allow zero whitespace for " + splitRegExp[j]);
				reconstructedRegExp += "\\s+";
			}
			reconstructedRegExp += splitRegExp[j];
		}
	}
	if(includeOptionalPunctuationAtEnd){
		reconstructedRegExp += "\\s*[.?!]?\\s*$";
	}
	else {
		reconstructedRegExp += "\\s*$";
	}
//	console.log("reconstructedRegExp: ", reconstructedRegExp);

  return reconstructedRegExp;
}

module.exports = regexputilities;
