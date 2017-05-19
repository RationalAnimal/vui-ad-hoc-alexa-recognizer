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

	let utteranceArray = utteranceString.split('');
	let parsingRange = {"start": 0, "end": -1};
  returnValue.parsedUtterance = _parseUtteranceString(utteranceArray, parsingRange);
  return returnValue;
}

/**
* Call to parse a portion of utteranceArray specified by parsingRange
start and end, inclusively of both.
*/
var _parseUtteranceString = function(utteranceArray, parsingRange){
	let scratch = '';
	let returnValue = [];
	for(let i = parsingRange.start; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i++){
		let currentLetter = utteranceArray[i];
		switch(currentLetter){
			case '{':
				if(scratch.length > 0){
					returnValue.push(scratch);
				}
				scratch = '';
				// Handle anything that starts with a curly bracket - slot, options list, etc
				let curlyRange = {"start": i, "end": -1}
				let curlyResult = _parseCurlyBrackets(utteranceArray, curlyRange);
				returnValue.push(curlyResult);
				i = curlyRange.end;
				break;
			default:
				scratch += currentLetter;
				break;
		}
	}
	if(scratch.length > 0){
		returnValue.push(scratch);
	}
	return returnValue;
}

var _parseSlotWithFlags = function(utteranceArray, parsingRange, intentSchema){
	let error = {"error": "", "position": -1};
	if(utteranceArray[parsingRange.start] != '{'){
		error.error = "parsing slot doesn't start with {";
		error.position = parsingRange.start;
	}
	let accummulatedValue = '';
	let returnValue = {"type": "slot"};
	for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
		switch(utteranceArray[i]){
			case "}":
				parsingRange.end = i;
				if(typeof returnValue.flags == "undefined"){
					returnValue.flags = [];
				}
				returnValue.flags.push(accummulatedValue);
				return returnValue;
			case ":":
				returnValue.name = accummulatedValue;
				accummulatedValue = '';
				break;
			case ",":
				if(typeof returnValue.flags == "undefined"){
					returnValue.flags = [];
				}
				returnValue.flags.push(accummulatedValue);
				accummulatedValue = '';
				break;
			case " ":
			case "\t":
				if(accummulatedValue.length == 0){
					// Do nothing
				}
				if(accummulatedValue.length > 0){
					// TODO revisit based on what we are parsing
					accummulatedValue += utteranceArray[i];
				}
				break;
			default:
				// simply accummulate the characters
				accummulatedValue += utteranceArray[i];
		}
	}
	// This is an error
	// TODO handle the error
}

/**
* Call to parse a portion of utteranceArray specified by parsingRange
start and end, inclusively of both that starts with a curly bracket.  Stop
when the closing bracket is found, returned parsed value(s) and update parsingRange
so that the calling function knows where to resume.
This will parse and return either a slot with or without flags or an option list.
The decision is made on whether : or | is encountered first. If neither is
encountered before } and there is only one word then it's a slot without flags.
Else it's an option list with just one option.
*/
var _parseCurlyBrackets = function(utteranceArray, parsingRange, intentSchema){
	let error = {"error": "", "position": -1};
	if(utteranceArray[parsingRange.start] != '{'){
		error.error = "parsing curly brackets doesn't start with {";
		error.position = parsingRange.start;
	}
	let accummulatedValue = '';
	let returnValue = {};
	for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
		switch(utteranceArray[i]){
			case "}":
				// TODO fix slot assumption
				parsingRange.end = i;
				return {"type": "slot", "name": accummulatedValue};
			case "|":
			  // this is an options list
				returnValue.type = "options";
				if(typeof returnValue.options == "undefined"){
					returnValue.options = [];
				}
				break;
			case ":":
				// this is a slot with options
				return _parseSlotWithFlags(utteranceArray, parsingRange, intentSchema);
				break;
			default:
				// simply accummulate the characters
				accummulatedValue += utteranceArray[i];
		}
	}
	// This is an error
	// TODO handle the error

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
