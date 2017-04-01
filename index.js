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
var recognizer = {};

var _makeReplacementRegExpString = function(arrayToConvert){
  var returnValue = "((?:";
  for(var i = 0; i < arrayToConvert.length; i++){
    if(i > 0){
      returnValue += "|";
    }
    returnValue += "" + arrayToConvert[i] + "\\s*";
  }
  returnValue += ")+)";
  return returnValue;
}

recognizer.Recognizer = class {
};

// The sections below are for the built in slots support
recognizer.builtInValues = {};
// Ommiting AMAZON. prefix
recognizer.builtInValues.NUMBER = {
  "values": [
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "zero", "oh", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty", "forty",
    "fifty", "sixty", "seventy", "eighty", "ninety", "hundred", "thousand",
    "million", "billion", "trillion",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
  ]
};
recognizer.builtInValues.NUMBER.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.NUMBER.values);
recognizer.builtInValues.NUMBER.replacementRegExp = new RegExp(recognizer.builtInValues.NUMBER.replacementRegExpString, "ig");

var _getReplacementRegExpStringForSlotType = function(slotType, config){
  if(slotType == "AMAZON.NUMBER"){
    return recognizer.builtInValues.NUMBER.replacementRegExpString;
  }
  else if(slotType.startsWith("AMAZON.")){
    // TODO add handling of other built in Amazon slot types, for now just return the value
    return "((?:\\w|\\s|[0-9])+)";
  }
  // Here we are dealing with custom slots.
  if(typeof config != "undefined" && Array.isArray(config.customSlotTypes)){
    for(var i = 0; i < config.customSlotTypes.length; i++){
      var customSlotType = config.customSlotTypes[i];
      if(customSlotType.name == slotType){
        if(typeof customSlotType.replacementRegExp == "undefined"){
          customSlotType.replacementRegExp = _makeReplacementRegExpString(customSlotType.values);
        }
        return customSlotType.replacementRegExp;
      }
    }
  }
  // Default fallback
  return "((?:\\w|\\s|[0-9])+)";
}

var _processMatchedSlotValueByType = function(value, slotType){
  if(slotType == "AMAZON.NUMBER"){
    // Here we may have a mixture of words, numbers, and white spaces.
    // Also we are not sure what the capitalization will be.
    // Convert all words to their numeric equivalents
    // Then split the string into individual parts and convert each to an
    // actual integer.
    // Then multiply any number by the following IFF the following is a hundred,
    // thousand, million, billion, trillion.  That's because people say
    // "two hundred", which would become "200", not "2 100".
    // Then convert the numbers to strings (NOT spelled out) and concatenate
    // these strings together.
    // Then convert the result to an integer and return.
    value = value.replace(/zero/ig, 0);
    value = value.replace(/oh/ig, 0);
    value = value.replace(/one/ig, 1);
    value = value.replace(/two/ig, 2);
    value = value.replace(/three/ig, 3);
    value = value.replace(/four/ig, 4);
    value = value.replace(/five/ig, 5);
    value = value.replace(/six/ig, 6);
    value = value.replace(/seven/ig, 7);
    value = value.replace(/eight/ig, 8);
    value = value.replace(/nine/ig, 9);
    value = value.replace(/ten/ig, 10);
    value = value.replace(/eleven/ig, 11);
    value = value.replace(/twelve/ig, 12);
    value = value.replace(/thirteen/ig, 13);
    value = value.replace(/fourteen/ig, 14);
    value = value.replace(/fifteen/ig, 15);
    value = value.replace(/sixteen/ig, 16);
    value = value.replace(/seventeen/ig, 17);
    value = value.replace(/eighteen/ig, 18);
    value = value.replace(/nineteen/ig, 19);
    value = value.replace(/twenty/ig, 20);
    value = value.replace(/thirty/ig, 30);
    value = value.replace(/forty/ig, 40);
    value = value.replace(/fifty/ig, 50);
    value = value.replace(/sixty/ig, 60);
    value = value.replace(/seventy/ig, 70);
    value = value.replace(/eighty/ig, 80);
    value = value.replace(/ninety/ig, 90);
    value = value.replace(/hundred/ig, 100);
    value = value.replace(/thousand/ig, 1000);
    value = value.replace(/million/ig, 1000000);
    value = value.replace(/billion/ig, 1000000000);
    value = value.replace(/trillion/ig, 1000000000000);
    value = value.split(/\s+/);
    var convertedValue = [];
    for(var i = 0; i < value.length; i ++){
      convertedValue.push(parseInt(value[i]));
    }
    value = convertedValue;
    var scratchValue = [];
    var skipIncrement = 0;
    for(var i = 0; i < value.length; i ++){
      if(value.length - i == 1){
        // One value left - just copy it
        scratchValue[i - skipIncrement] = value[i];
      }
      // TODO add handling of 0 - we don't multiply it, simply concatenate later
      else if(value.length - i == 2){
        // Two values left - either copy then or multiply them
        if((value[i] < 100 && value[i + 1] >= 100) ||
                ((value[i] >= 100 && value[i + 1] >= 100) && (value[i] <  value[i + 1]))){
          scratchValue[i - skipIncrement] = value[i] * value[i + 1];
        }
        else {
          scratchValue[i - skipIncrement] = value[i];
          scratchValue[i + 1 - skipIncrement] = value[i + 1];
        }
        i++;
        skipIncrement++;
      }
      else if(value.length - i >= 3){
        // At least 3 values left.  Process the minimum and leave it for the next
        // iteration of the loop.
        if(value[i + 1] < 100 || value[i] >= value[i + 1]){
          // Process just a single number
          scratchValue[i - skipIncrement] = value[i];
        }
        else if(value[i + 2] < 100 || value[i + 1] >= value[i + 2]){
          // Process just two numbers by multiplying them
          scratchValue[i - skipIncrement] = value[i] * value[i + 1];
          i++;
          skipIncrement++;
        }
        else {
          // Process three numbers by multiplying them
          scratchValue[i - skipIncrement] = value[i] * value[i + 1] * value[i + 2];
          i += 2;
          skipIncrement += 2;
        }
      }
    }
    value = "";
    for(var i = 0; i < scratchValue.length; i++){
      value += ("" + scratchValue[i]);
    }
    return value;
  }
  return value;
}

var _matchText = function(stringToMatch){
//  console.log("_matchText, 1");
  var recognizerSet = require("./recognizer.json");
//  console.log("_matchText, 2, recognizerSet: " + JSON.stringify(recognizerSet));
  for(var i = 0; i < recognizerSet.matchConfig.length; i++){
//    console.log("_matchText, 3, i: " + i);
    var scratch = recognizerSet.matchConfig[i];
//    console.log("_matchText, 4, scratch: " + JSON.stringify(scratch));
//    console.log("_matchText, 4.1, scratch.regExString: " + JSON.stringify(scratch.regExString));
    var scratchRegExp = new RegExp(scratch.regExString, "ig");
//    console.log("_matchText, 4.2, scratchRegExp: " + scratchRegExp);
    var matchResult;
    var slotValues = [];
    while(matchResult = scratchRegExp.exec(stringToMatch)){
//      console.log("_matchText, 5, matchResult: " + JSON.stringify(matchResult));
      if(matchResult != null){
//        console.log("FOUND A MATCH: " + JSON.stringify(matchResult));
        var returnValue = {};
        returnValue.name = scratch.intent;
        returnValue.slots = {};
        for(var j = 1; j < matchResult.length; j++){
          var processedMatchResult = _processMatchedSlotValueByType(matchResult[j], scratch.slots[j - 1].type)
          returnValue.slots[scratch.slots[j - 1].name] = {"name": scratch.slots[j - 1].name, "value": processedMatchResult};
        }
        return returnValue;
      }
    }
  }
};

var _generateRunTimeJson = function(config, intents, utterances, customSlots){
  //  console.log("_generateRunTimeJson, config: ", JSON.stringify(config));
  //  console.log("_generateRunTimeJson, intents: ", JSON.stringify(intents));
  //  console.log("_generateRunTimeJson, utterances: ", JSON.stringify(utterances));
  var recognizerSet = {};
  recognizerSet.matchConfig = [];
  // First process all the utterances
  for(var i = 0; i < utterances.length; i ++){
    var currentValue = {};
    var splitLine = utterances[i].split(/\s+/);
    var currentIntent = splitLine[0];
    var scratchRegExp = new RegExp("^" + currentIntent + "\\s+");
    var currentUtterance = utterances[i].split(scratchRegExp)[1];
    var slots = [];
    var slotRegExp = /\{(\w+)\}/ig;
    let slotMatchExecResult;
    var slots = [];
    var slotMatches = [];
    while(slotMatchExecResult = slotRegExp.exec(currentUtterance)){
      slotMatches.push(slotMatchExecResult[0]);
      slots.push(slotMatchExecResult[1]);
    }
    currentValue.slots = [];

    for(var j = 0; j < slots.length; j ++){
      var slotType = _getSlotType(intents, currentIntent, slots[j]);
      currentValue.slots.push({"name": slots[j], "type": slotType});
    }
    var regExString = currentUtterance;
    if(slots.length > 0){
      // Need to create a different regExString
      for(var j = 0; j < slotMatches.length; j++){
        var replacementString = _getReplacementRegExpStringForSlotType(_getSlotType(intents, currentIntent, slots[j]), config)
        regExString = regExString.replace(slotMatches[j], replacementString);
      }
    }
    // Now split regExString into non-white space parts and reconstruct the
    // whole thing with any sequence of white spaces replaced with a white space
    // reg exp.
    var splitRegEx = regExString.split(/\s+/);
    var reconstructedRegEx = "^\\s*";
    for(var j = 0; j < splitRegEx.length; j++){
      if(splitRegEx[j].length > 0){
        if(j > 0){
          reconstructedRegEx += "\\s+";
        }
        reconstructedRegEx += splitRegEx[j];
      }
    }
    reconstructedRegEx += "\\s*[.]?\\s*$";
    currentValue.regExString = reconstructedRegEx;
    currentValue.intent = currentIntent;
    recognizerSet.matchConfig.push(currentValue);
  }
  // Now process all the built in intents.  Note that their triggering
  // utterances will NOT be part of "utterances" arg, but instead will be in config.

  return recognizerSet;
};

recognizer.Recognizer.generateRunTimeJson = _generateRunTimeJson;
recognizer.Recognizer.prototype.generateRunTimeJson = _generateRunTimeJson;

recognizer.Recognizer.matchText = _matchText;
recognizer.Recognizer.prototype.matchText = _matchText;

var _getSlotType = function(intents, intent, slot){
  for(var i = 0; i < intents.intents.length; i++){
    if(intents.intents[i].intent == intent){
      for(var j = 0; j < intents.intents[i].slots.length; j ++){
        if(intents.intents[i].slots[j].name == slot){
          return intents.intents[i].slots[j].type;
        }
      }
      return;
    }
  }
}

var _getSlotTypeFromRecognizer = function(recognizer, intent, slot){
  for(var i = 0; i < recognizer.matchConfig.length; i++){
    if(recognizer.matchConfig[i].intent == intent){
      for(var j = 0; j < recognizer.matchConfig[i].slots.length; j ++){
        if(recognizer.matchConfig[i].slots[j].name == slot){
          return recognizer.matchConfig[i].slots[j].type;
        }
      }
      return;
    }
  }
}

module.exports = recognizer;
