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
var parser = {};

var _parseUtteranceIntoJson = function(utterance){
	let returnValue = {};
	// First get the intent name
	let parsedIntent = _splitIntentName(utterance);
	let utteranceString;
	if(typeof parsedIntent != "undefined"){
	  if(typeof parsedIntent.intentName == "undefined"){
			return returnValue;
		}
		returnValue.intentName = parsedIntent.intentName;
		if(typeof parsedIntent.utteranceString == "undefined"){
			returnValue.parsedUtterance = [];
			return returnValue;
		}
		utteranceString = parsedIntent.utteranceString;
	}
	else {
		return returnValue;
	}

  returnValue.parsedUtterance = _parseUtteranceString(utteranceString);
  return returnValue;
}

var _parseUtteranceString = function(utteranceString){
	return [utteranceString];
}

var _splitIntentName = function(utterance){
	let returnValue = {};
	let intentRegExp = /^\s*((?:\w|[-])+)\s*(.+)\s*/ig;

  let matchResult = intentRegExp.exec(utterance);
  if(matchResult){
//		console.log("_splitIntentName, matchResult: ", JSON.stringify(matchResult, null, 2));
    let returnValue = {
      "intentName": matchResult[1],
			"utteranceString": matchResult[2]
    };
//		console.log("_splitIntentName, returnValue: ", JSON.stringify(returnValue, null, 2));
		return returnValue;
  }
	return;
}

parser.parseUtteranceIntoJson = _parseUtteranceIntoJson;
module.exports = parser;
