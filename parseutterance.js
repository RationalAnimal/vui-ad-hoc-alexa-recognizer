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

var _parseUtteranceIntoJson = function(utterance, intentSchema){
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
  returnValue.parsedUtterance = _parseUtteranceString(utteranceArray, parsingRange, returnValue.intentName, intentSchema);
  return returnValue;
}

let allowedSlotFlags = ["INCLUDE_VALUES_MATCH", "EXCLUDE_VALUES_MATCH", "INCLUDE_WILDCARD_MATCH", "EXCLUDE_WILDCARD_MATCH", "SOUNDEX_MATCH", "EXCLUDE_YEAR_ONLY_DATES", "EXCLUDE_NON_STATES", "COUNTRY", "CONTINENT", "TYPE"];
var _cleanupParsedUtteranceJson = function(parsedJson, intentSchema){
//	console.log("_cleanupParsedUtteranceJson, entered, parsedJson.parsedUtterance: " + JSON.stringify(parsedJson.parsedUtterance, null, 2));
  // First get rid of invalid flags.
	for(let i = 0; i < parsedJson.parsedUtterance.length; i ++){
		if(parsedJson.parsedUtterance[i].type == "slot"){
			if(typeof parsedJson.parsedUtterance[i].flags != "undefined"){
				for(let j = parsedJson.parsedUtterance[i].flags.length - 1; j >= 0; j --){
					if(allowedSlotFlags.indexOf(parsedJson.parsedUtterance[i].flags[j].name) < 0){
						parsedJson.parsedUtterance[i].flags.splice(j, 1);
					}
				}
			}
		}
	}
	// Now, add default flags to any slot that doesn't have any at all.
	for(let i = 0; i < parsedJson.parsedUtterance.length; i ++){
		if(parsedJson.parsedUtterance[i].type == "slot"){
			if(typeof parsedJson.parsedUtterance[i].flags == "undefined" || parsedJson.parsedUtterance[i].flags.length == 0){
				parsedJson.parsedUtterance[i].flags = [];
				parsedJson.parsedUtterance[i].flags.push({"name":"INCLUDE_VALUES_MATCH"});
				parsedJson.parsedUtterance[i].flags.push({"name":"EXCLUDE_WILDCARD_MATCH"});
			}
		}
	}


}

/**
* Call to parse a portion of utteranceArray specified by parsingRange
start and end, inclusively of both.
*/
var _parseUtteranceString = function(utteranceArray, parsingRange, intentName, intentSchema){
	let scratch = '';
	let returnValue = [];
	for(let i = parsingRange.start; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i++){
		let currentLetter = utteranceArray[i];
		switch(currentLetter){
			case '{':
				if(scratch.length > 0){
//					console.log("_parseUtteranceString pushing: ", scratch);
					returnValue.push(scratch);
				}
				scratch = '';
				// Handle anything that starts with a curly bracket - slot, options list, etc
				let curlyRange = {"start": i, "end": -1}
				let curlyResult = _parseCurlyBrackets(utteranceArray, curlyRange, intentName, intentSchema);
//				console.log("curlyResult: ", curlyResult);
				returnValue.push(curlyResult);
				i = curlyRange.end;
				break;
			default:
				scratch += currentLetter;
				break;
		}
	}
	if(scratch.length > 0){
//		console.log("_parseUtteranceString pushing at the end: ", scratch);
		returnValue.push(scratch);
	}
//	console.log("_parseUtteranceString returning: ", JSON.stringify(returnValue, null, 2));
	return returnValue;
}

var _parseJsonArray = function(utteranceArray, parsingRange, intentSchema){
	// Really brute force method - user JSON.parse and attempt at each ]
	let error = {"error": "", "position": -1};
	if(utteranceArray[parsingRange.start] != '['){
		error.error = "parsing JSON array doesn't start with [", utteranceArray.slice(parsingRange.start).join("");
		error.position = parsingRange.start;
		throw error;
	}
	let accummulatedValue = '';
	let returnValue = [];
	for(let i = parsingRange.start; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
		accummulatedValue += utteranceArray[i];
		switch(utteranceArray[i]){
			case "]":
				try {
					let returnValue = JSON.parse(accummulatedValue);
					parsingRange.end = i;
//					console.log("parsing JSON array returnving value: ", returnValue)
					return returnValue;
				}
				catch(e){
					// Ignore all errors - we are simply trying blindly so errors don't mean anything
//					console.log("parsing JSON array: caught error parsing JSON array: ", JSON.stringify(e, null, 2))
				}
				break;
			default:
//				console.log("parsing JSON array: some character: " + utteranceArray[i]);
				break;
		}
	}
//	console.log("parsing JSON array: at end without returnving value")
}

var _parseFlagParameters = function(utteranceArray, parsingRange, intentSchema){
	let error = {"error": "", "position": -1};
	if(utteranceArray[parsingRange.start] != '('){
		error.error = "parsing slot doesn't start with (";
		error.position = parsingRange.start;
		throw error;
	}
	let returnValue = [];
	for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
		switch(utteranceArray[i]){
			case "[":
				let jsonArrayRange = {"start": i, "end": -1};
				let jsonArrayResult = _parseJsonArray(utteranceArray, jsonArrayRange, intentSchema);
//				console.log("jsonArrayResult: " + JSON.stringify(jsonArrayResult, null, 2));
				returnValue = jsonArrayResult;
				i = jsonArrayRange.end;
				break;
			case ")":
				parsingRange.end = i;
				return returnValue;
			case " ":
			case "\t":
					break;
			default:
				error.position = i;
				error.error = "unexpected character while parsing flag parameters at position: " + error.position + ": " + utteranceArray[i];
				throw error;
		}
	}
}

var _parseFlags = function(utteranceArray, parsingRange, intentSchema){
	let error = {"error": "", "position": -1};
	if(utteranceArray[parsingRange.start] != ':'){
		error.error = "parsing slot doesn't start with :";
		error.position = parsingRange.start;
	}
	let accummulatedValue = '';
	let returnValue = [];
	// {"type": "flag", "name": accummulatedValue, "parameters": []};
	for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
		switch(utteranceArray[i]){
			case "}":
				parsingRange.end = i;
				if(accummulatedValue.length > 0){
//					console.log("_parseFlags, pushing after } flag with name: " + accummulatedValue );
					returnValue.push({"name": accummulatedValue});
				}
				return returnValue;
			case ",":
				if(accummulatedValue.length > 0){
//					console.log("_parseFlags, pushing after , flag with name: " + accummulatedValue );
					returnValue.push({"name": accummulatedValue});
					accummulatedValue = '';
				}
				break;
			case "(":
//				console.log("_parseFlags, pushing after ( flag with name: " + accummulatedValue );
				returnValue.push({"name": accummulatedValue});
				accummulatedValue = '';
				let flagsRange = {"start": i, "end": -1};
				let flagsResult = _parseFlagParameters(utteranceArray, flagsRange, intentSchema);
				returnValue[returnValue.length - 1].parameters = flagsResult;
				i = flagsRange.end;
				break;
			case " ":
			case "\t":
				break;
			default:
				// simply accummulate the characters
				accummulatedValue += utteranceArray[i];
		}
	}

}
var _parseSlotWithFlags = function(utteranceArray, parsingRange, intentName, intentSchema){
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
				if(_isSlotName(accummulatedValue, intentName, intentSchema) == false){
					error.error = "slot name " + accummulatedValue + " does not exist within intent schema";
					error.position = i;
					throw error;
				}
				returnValue.name = accummulatedValue;
				accummulatedValue = '';
				let flagsRange = {"start": i, "end": -1};
				let flagsResult = _parseFlags(utteranceArray, flagsRange);
				parsingRange.end = flagsRange.end;
				returnValue.flags = flagsResult;
//				console.log("returning from _parseSlotWithFlags: ", JSON.stringify(returnValue, null, 2));
				return returnValue;
			case " ":
			case "\t":
				break;
			default:
				// simply accummulate the characters
				accummulatedValue += utteranceArray[i];
		}
	}
	error.error = "parsing slot ran out of characters to parse before completing slot parsing";
	error.position = -1;
	throw error;
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
var _parseCurlyBrackets = function(utteranceArray, parsingRange, intentName, intentSchema){
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
				parsingRange.end = i;
				if(_isSlotName(accummulatedValue, intentName, intentSchema)){
					return {"type": "slot", "name": accummulatedValue};
				}
				else {
					return {"type": "optionsList", "options": [accummulatedValue]};
				}
			case "|":
			  // this is an options list
				returnValue.type = "options";
				if(typeof returnValue.options == "undefined"){
					returnValue.options = [];
				}
				break;
			case ":":
				// this is a slot with options
				return _parseSlotWithFlags(utteranceArray, parsingRange, intentName, intentSchema);
				break;
			default:
				// simply accummulate the characters
				accummulatedValue += utteranceArray[i];
		}
	}
	error.error = "parsing curly brackets ran out of characters before encountering }";
	error.position = -1;;
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

var _isSlotName = function(slotName, intentName, intentSchema){
//	console.log("_isSlotName, slotName: " + slotName + ", intentName: " + intentName);
	let trimmedName = slotName.replace(/^\s*/,'').replace(/\s*$/,'');
//	console.log("_isSlotName, trimmedName: <" + trimmedName + '>');
//	console.log("_isSlotName, intentSchema: ", JSON.stringify(intentSchema, null, 2));
	for(let i = 0; i < intentSchema.intents.length; i++){
		if(intentSchema.intents[i].intent != intentName){
			continue;
		}
		let intentSlots = intentSchema.intents[i].slots;
//		console.log("_isSlotName, intentSlots: " + JSON.stringify(intentSlots, null, 2));

		for(let j = 0; j < intentSlots.length; j++){
//			console.log("_isSlotName, intentSlots[j].name: " + intentSlots[j].name);

			if(intentSlots[j].name == trimmedName){
//				console.log("_isSlotName returning true");
				return true;
			}
		}
	}
//	console.log("_isSlotName returning false");
	return false;
}

parser.parseUtteranceIntoJson = _parseUtteranceIntoJson;
parser.cleanupParsedUtteranceJson = _cleanupParsedUtteranceJson;
module.exports = parser;
