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
var fs = require('fs');

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

var _makeFullRegExpString = function(arrayToConvert){
  let regExString = _makeReplacementRegExpString(arrayToConvert);
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
  return reconstructedRegEx;
}

recognizer.Recognizer = class {
};

recognizer.errorCodes = {};
recognizer.errorCodes.MISSING_RECOGNIZER = 1001;

// The sections below are for the built in slots support
recognizer.builtInValues = {};
// Ommiting AMAZON. prefix
recognizer.builtInValues.NUMBER = require("./builtinslottypes/numbers.json");
let numbersWithAnd = recognizer.builtInValues.NUMBER.values.slice();
numbersWithAnd.push("and");
recognizer.builtInValues.NUMBER.replacementRegExpString = _makeReplacementRegExpString(numbersWithAnd);
recognizer.builtInValues.NUMBER.replacementRegExp = new RegExp(recognizer.builtInValues.NUMBER.replacementRegExpString, "ig");

recognizer.builtInValues.FOUR_DIGIT_NUMBER = {};
recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString =
  "(" +
    "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine)\\s*){4}" +
    "|" +
    "(?:" +
      "(?:(?:(?:zero|one|two|three|four|five|six|seven|eight|nine)\\s*){2})" +
      "|" +
      "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){1}\\s*" +
    ")" +
    "|" +
    "(?:" +
      "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){2}\\s*" +
    ")" +
  ")";
recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExp = new RegExp(recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString, "ig");

recognizer.builtInValues.DATE = require("./builtinslottypes/dates.json");
{
  let fullCalendarDateString1 = "(?:January|February|March|April|May|June|July|August|September|October|November|December){1}\\s+" +
  "(?:one|first|two|second|three|third|four|fourth|five|fifth|six|sixth|seven|seventh|eight|eighth|nine|nineth|ten|tenth|" +
  "eleven|eleventh|twelve|twelfth|thirteen|thirteenth|fourteen|fourteenth|fifteen|fifteenth|sixteen|sixteenth|seventeen|seventeenth|eighteen|eighteenth|nineteen|nineteenth|twenty|twentieth|" +
  "twenty one|twenty first|twenty two|twenty second|twenty three|thwenty third|twenty four|twenty fourth|twenty five|twenty fifth|twenty six|twenty sixth|twenty seven|twenty seventh|twenty eight|twenty eighth|twenty nine|twenty ningth|thirty|thirtieth|thirty one|thirty first){1}\\s*" +
  // Now the year, first as spelled out number, e.g. one thousand nine hundred forty five
  "(?:" +
  "(?:" +
  "(?:one thousand|two thousand){0,1}\\s*(?:(?:one|two|three|four|five|six|seven|eight|nine)\\s*hundred){0,1}\\s*" + "(?:and\\s*){0,1}(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,1}\\s*"+
  ")" +
  // then as two two digit numbers, e.g. nineteen forty five
  "|" +
  "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,2}\\s*" +
  ")";
  recognizer.builtInValues.DATE.values.push(fullCalendarDateString1);
}
recognizer.builtInValues.DATE.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.DATE.values);
recognizer.builtInValues.DATE.replacementRegExp = new RegExp(recognizer.builtInValues.DATE.replacementRegExpString, "ig");

recognizer.builtInValues.TIME = {};
recognizer.builtInValues.TIME.replacementRegExpString = "";

recognizer.builtInValues.US_STATE = require("./builtinslottypes/usstates.json");
recognizer.builtInValues.US_STATE.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.US_STATE.values);
recognizer.builtInValues.US_STATE.replacementRegExp = new RegExp(recognizer.builtInValues.US_STATE.replacementRegExpString, "ig");

recognizer.builtInValues.US_FIRST_NAME = require("./builtinslottypes/usfirstnames.json");
recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.US_FIRST_NAME.values);
recognizer.builtInValues.US_FIRST_NAME.replacementRegExp = new RegExp(recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString, "ig");

recognizer.builtInValues.DayOfWeek = {};
recognizer.builtInValues.DayOfWeek.values = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
recognizer.builtInValues.DayOfWeek.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.DayOfWeek.values);
recognizer.builtInValues.DayOfWeek.replacementRegExp = new RegExp(recognizer.builtInValues.DayOfWeek.replacementRegExpString, "ig");

recognizer.builtInValues.Country = require("./builtinslottypes/countries.json");
recognizer.builtInValues.Country.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Country.values);
recognizer.builtInValues.Country.replacementRegExp = new RegExp(recognizer.builtInValues.Country.replacementRegExpString, "ig");


var _getReplacementRegExpStringForSlotType = function(slotType, config){
  if(slotType == "AMAZON.NUMBER"){
    return recognizer.builtInValues.NUMBER.replacementRegExpString;
  }
  else if(slotType == "AMAZON.FOUR_DIGIT_NUMBER"){
    return recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString;
  }
  else if(slotType == "AMAZON.US_STATE"){
    return recognizer.builtInValues.US_STATE.replacementRegExpString;
  }
  else if(slotType == "AMAZON.US_FIRST_NAME"){
    return recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString;
  }
  else if(slotType == "AMAZON.DATE"){
    return recognizer.builtInValues.DATE.replacementRegExpString;
  }
  else if(slotType == "AMAZON.DayOfWeek"){
    return recognizer.builtInValues.DayOfWeek.replacementRegExpString;
  }
  else if(slotType == "AMAZON.Country"){
    return recognizer.builtInValues.Country.replacementRegExpString;
  }
//  else if(slotType.startsWith("AMAZON.")){
//    // TODO add handling of other built in Amazon slot types, for now just return the value
//    return "((?:\\w|\\s|[0-9])+)";
//  }
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

var _getOrderOfMagnitude = function(number){
  var oom = Math.floor(Math.log10(number));
//  console.log("_getOrderOfMagnitude, number: " + number + ", oom: " + oom);
  return oom;
}

var _processMatchedNumericSlotValue = function(value){
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

  value = value.replace(/tenth/ig, 10);
  value = value.replace(/eleventh/ig, 11);
  value = value.replace(/twelfth/ig, 12);
  value = value.replace(/thirteenth/ig, 13);
  value = value.replace(/fourteenth/ig, 14);
  value = value.replace(/fifteenth/ig, 15);
  value = value.replace(/sixteenth/ig, 16);
  value = value.replace(/seventeenth/ig, 17);
  value = value.replace(/eighteenth/ig, 18);
  value = value.replace(/nineteenth/ig, 19);
  value = value.replace(/twentieth/ig, 20);
  value = value.replace(/thirtieth/ig, 30);
  value = value.replace(/fortieth/ig, 40);
  value = value.replace(/fiftieth/ig, 50);
  value = value.replace(/sixtieth/ig, 60);
  value = value.replace(/seventieth/ig, 70);
  value = value.replace(/eightieth/ig, 80);
  value = value.replace(/ninetieth/ig, 90);
  value = value.replace(/first/ig, 1);
  value = value.replace(/second/ig, 2);
  value = value.replace(/third/ig, 3);
  value = value.replace(/fourth/ig, 4);
  value = value.replace(/fifth/ig, 5);
  value = value.replace(/sixth/ig, 6);
  value = value.replace(/seventh/ig, 7);
  value = value.replace(/eighth/ig, 8);
  value = value.replace(/ninth/ig, 9);
  value = value.replace(/hundredth/ig, 100);
  value = value.replace(/thousandth/ig, 1000);
  value = value.replace(/millionth/ig, 1000000);
  value = value.replace(/billionth/ig, 1000000000);
  value = value.replace(/trillionth/ig, 1000000000000);


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
  value = value.replace(/one/ig, 1);
  value = value.replace(/two/ig, 2);
  value = value.replace(/three/ig, 3);
  value = value.replace(/four/ig, 4);
  value = value.replace(/five/ig, 5);
  value = value.replace(/six/ig, 6);
  value = value.replace(/seven/ig, 7);
  value = value.replace(/eight/ig, 8);
  value = value.replace(/nine/ig, 9);
  value = value.replace(/hundred/ig, 100);
  value = value.replace(/thousand/ig, 1000);
  value = value.replace(/million/ig, 1000000);
  value = value.replace(/billion/ig, 1000000000);
  value = value.replace(/trillion/ig, 1000000000000);

  value = value.replace(/and/ig, "");

  value = value.split(/\s+/);
  var convertedValues = [];
  for(var i = 0; i < value.length; i ++){
    convertedValues.push(parseInt(value[i]));
  }
  value = convertedValues;
  var scratchValues = [];
  var haveAccumulatedValue = false;
  var accummulatedStack = [];
  var lastValue = 0;
  var lastOrderOfMagnitude = 0;
  for(var i = 0; i < value.length; i ++){
    if(haveAccumulatedValue == false){
      if(value[i] == 0){
        scratchValues.push(value[i]);
        continue;
      }
      haveAccumulatedValue = true;
      accummulatedStack.push(value[i]);
      lastOrderOfMagnitude = _getOrderOfMagnitude(value[i]);
      lastValue = value[i];
    }
    else {
      // We have a currently accumulating value.
      if(value[i] == 0){
        if(accummulatedStack.length == 2){
          scratchValues.push(accummulatedStack[0] + accummulatedStack[1]);
        }
        else {
          scratchValues.push(accummulatedStack[0]);
        }
        scratchValues.push(value[i]);
        haveAccumulatedValue = false;
        accummulatedStack = [];
        lastOrderOfMagnitude = 0;
        lastValue = 0;
        continue;
      }
      let currentOrderOfMagnitude = _getOrderOfMagnitude(value[i]);
      let accummulatedOrderOfMagnitude = _getOrderOfMagnitude(accummulatedStack[accummulatedStack.length - 1]);
      if((accummulatedOrderOfMagnitude < currentOrderOfMagnitude) && currentOrderOfMagnitude >= 2){
        // The new value's order of magnitune is larger than the entire accummulated
        // value and new value's order of magnitude is at least 2.  This means
        // we multiply them.
        accummulatedStack[accummulatedStack.length - 1] *= value[i];
        lastOrderOfMagnitude = currentOrderOfMagnitude;
        lastValue = value[i];
        // Need to verify that multiplying does not trigger writing earlier value out.
        if(accummulatedStack.length == 2 && _getOrderOfMagnitude(accummulatedStack[0]) < _getOrderOfMagnitude(accummulatedStack[1]) + 3){
          scratchValues.push(accummulatedStack[0])
          accummulatedStack.splice(0, 1);
        }
        // Now, if the current value, value[i] is >= 1000 then we also need to collapse the stack by adding its values
        if(accummulatedStack.length == 2 && currentOrderOfMagnitude >= 3){
          accummulatedStack[0] += accummulatedStack[1];
          accummulatedStack.splice(1, 1);
        }
        continue;
      }
      if(currentOrderOfMagnitude < lastOrderOfMagnitude){
        // The new value is smaller than the last value.
        // There are 3 possible cases here. First is a special exception for
        // when the previous value was a "teen" value and the current one is in
        // single digits, it still should NOT be added, rather it triggers an
        // output of the prior values and starts a new stack.
        // Other than that, if the last OOM was >= 300 - push it, else add it.
        if(lastValue >= 11 && lastValue <= 19){
          if(accummulatedStack.length == 2){
            accummulatedStack[0] += accummulatedStack[1];
            accummulatedStack.splice(1, 1);
          }
          scratchValues.push(accummulatedStack[0]);
          accummulatedStack.splice(0, 1);
          accummulatedStack.push(value[i]);
        }
        else if(lastOrderOfMagnitude >= 3){
          accummulatedStack.push(value[i]);
        }
        else {
          accummulatedStack[accummulatedStack.length - 1] += value[i];
        }
        lastOrderOfMagnitude = currentOrderOfMagnitude;
        lastValue = value[i];
        continue;
      }
      // If we are here that means we are not combining the accumulated value and
      // the current value. Write out the last value and set the accummulated
      // value to the current one.
      if(accummulatedStack.length == 2){
        accummulatedStack[0] += accummulatedStack[1];
        accummulatedStack.splice(1, 1);
      }
      scratchValues.push(accummulatedStack[0]);
      accummulatedStack.splice(0, 1);
      accummulatedStack.push(value[i]);
      lastOrderOfMagnitude = currentOrderOfMagnitude;
      lastValue = value[i];
    }
  }
  // May need to write out last value
  if(haveAccumulatedValue){
    if(accummulatedStack.length == 2){
      accummulatedStack[0] += accummulatedStack[1];
      accummulatedStack.splice(1, 1);
    }
    scratchValues.push(accummulatedStack[0]);
  }
  haveAccumulatedValue = false;
  accummulatedStack = [];
  lastOrderOfMagnitude = 0;
  lastValue = 0;

  value = "";
  for(var i = 0; i < scratchValues.length; i++){
    value += ("" + scratchValues[i]);
  }
  value = parseInt(value);
  return value;
}

var _twoDigitFormatter = function(number){
  let returnValue = "0" + number;
  returnValue = returnValue.slice(-2);
  return returnValue;
}
var _fourDigitFormatter = function(number){
  let returnValue = "0000" + number;
  returnValue = returnValue.slice(-4);
  return returnValue;
}

var _formatDate = function(date){
  return "" + date.getFullYear() + "-" + _twoDigitFormatter(date.getMonth() + 1) + "-" + _twoDigitFormatter(date.getDate());
}

var _processMatchedDateSlotValue = function(value){
  var matchResult;
  var regExp = /(right now)/ig
  if(matchResult = regExp.exec(value)){
    return "PRESENT_REF";
  }
  regExp = /(today)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    return _formatDate(today);
  }
  regExp = /(yesterday)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() - 1);
    return _formatDate(today);
  }
  regExp = /(tomorrow)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() + 1);
    return _formatDate(today);
  }

  regExp = /(^\s*this week\s*\.*$)/ig
  if(matchResult = regExp.exec(value)){
    return _getWeekOfYear(new Date());
  }

  regExp = /(^\s*last week\s*\.*$)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() - 7);
    return _getWeekOfYear(today);
  }

  regExp = /(^\s*next week\s*\.*$)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() + 7);
    return _getWeekOfYear(today);
  }

  regExp = /(^\s*this weekend\s*\.*$)/ig
  if(matchResult = regExp.exec(value)){
    return (_getWeekOfYear(new Date()) + "-WE");
  }

  regExp = /(^\s*last weekend\s*\.*$)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() - 7);
    return (_getWeekOfYear(today) + "-WE");
  }

  regExp = /(^\s*next weekend\s*\.*$)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() + 7);
    return (_getWeekOfYear(today) + "-WE");
  }

  regExp = /(this month)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    return "" + year + "-" + _twoDigitFormatter(month + 1);
  }
  regExp = /(last month)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    month --;
    if(month < 0){
      return "" + (year - 1) + "-12";
    }
    else {
      return "" + year + "-" + _twoDigitFormatter(month + 1);
    }
  }
  regExp = /(next month)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    month ++;
    if(month > 11){
      return "" + (year + 1) + "-01";
    }
    else {
      return "" + year + "-" + _twoDigitFormatter(month + 1);
    }
  }

  regExp = /^\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s*\.*$/ig;
  if(matchResult = regExp.exec(value)){
    let month = matchResult[1];
    month = month.replace(/January/ig, 1);
    month = month.replace(/February/ig, 2);
    month = month.replace(/March/ig, 3);
    month = month.replace(/April/ig, 4);
    month = month.replace(/May/ig, 5);
    month = month.replace(/June/ig, 6);
    month = month.replace(/July/ig, 7);
    month = month.replace(/August/ig, 8);
    month = month.replace(/September/ig, 9);
    month = month.replace(/October/ig, 10);
    month = month.replace(/November/ig, 11);
    month = month.replace(/December/ig, 12);

    let today = new Date();
    let year = today.getFullYear();
    let todaysMonth = today.getMonth();
    todaysMonth++; // Make it 1-based
    if(todaysMonth > month){
      year++;
    }
    return "" + year + "-" + _twoDigitFormatter(month);
  }

  regExp = /^\s*(last January|last February|last March|last April|last May|last June|last July|last August|last September|last October|last November|last December)\s*\.*$/ig;
  if(matchResult = regExp.exec(value)){
    let month = matchResult[1];
    month = month.replace(/last January/ig, 1);
    month = month.replace(/last February/ig, 2);
    month = month.replace(/last March/ig, 3);
    month = month.replace(/last April/ig, 4);
    month = month.replace(/last May/ig, 5);
    month = month.replace(/last June/ig, 6);
    month = month.replace(/last July/ig, 7);
    month = month.replace(/last August/ig, 8);
    month = month.replace(/last September/ig, 9);
    month = month.replace(/last October/ig, 10);
    month = month.replace(/last November/ig, 11);
    month = month.replace(/last December/ig, 12);

    let today = new Date();
    let year = today.getFullYear();
    let todaysMonth = today.getMonth();
    todaysMonth++; // Make it 1-based
    if(todaysMonth > month){
      // No need to do anything - already in the past.
    }
    else {
      year--;
    }
    return "" + year + "-" + _twoDigitFormatter(month);
  }

  regExp = /^\s*(next January|next February|next March|next April|next May|next June|next July|next August|next September|next October|next November|next December)\s*\.*$/ig;
  if(matchResult = regExp.exec(value)){
    let month = matchResult[1];
    month = month.replace(/next January/ig, 1);
    month = month.replace(/next February/ig, 2);
    month = month.replace(/next March/ig, 3);
    month = month.replace(/next April/ig, 4);
    month = month.replace(/next May/ig, 5);
    month = month.replace(/next June/ig, 6);
    month = month.replace(/next July/ig, 7);
    month = month.replace(/next August/ig, 8);
    month = month.replace(/next September/ig, 9);
    month = month.replace(/next October/ig, 10);
    month = month.replace(/next November/ig, 11);
    month = month.replace(/next December/ig, 12);

    let today = new Date();
    let year = today.getFullYear();
    let todaysMonth = today.getMonth();
    todaysMonth++; // Make it 1-based
    if(todaysMonth >= month){
      year++;
    }
    return "" + year + "-" + _twoDigitFormatter(month);
  }



  regExp = /(this year)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    return "" + year;
  }
  regExp = /(last year)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    year--;
    return "" + year;
  }
  regExp = /(next year)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    year++;
    return "" + year;
  }
  regExp = /(this decade)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let decade = Math.floor(year / 10);
    return "" + decade + "X";
  }
  regExp = /(last decade)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let decade = Math.floor(year / 10) - 1;
    return "" + decade + "X";
  }
  regExp = /(next decade)/ig
  if(matchResult = regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let decade = Math.floor(year / 10) + 1;
    return "" + decade + "X";
  }

  let fullCalendarDateString1 = "^(January|February|March|April|May|June|July|August|September|October|November|December){1}\\s+" +
  "(one|first|two|second|three|third|four|fourth|five|fifth|six|sixth|seven|seventh|eight|eighth|nine|nineth|ten|tenth|" +
  "eleven|eleventh|twelve|twelfth|thirteen|thirteenth|fourteen|fourteenth|fifteen|fifteenth|sixteen|sixteenth|seventeen|seventeenth|eighteen|eighteenth|nineteen|nineteenth|twenty|twentieth|" +
  "twenty one|twenty first|twenty two|twenty second|twenty three|thwenty third|twenty four|twenty fourth|twenty five|twenty fifth|twenty six|twenty sixth|twenty seven|twenty seventh|twenty eight|twenty eighth|twenty nine|twenty ningth|thirty|thirtieth|thirty one|thirty first){1}\\s*" +
  // Now the year, first as spelled out number, e.g. one thousand nine hundred forty five
  "(" +
  "(?:" +
  "(?:one thousand|two thousand){0,1}\\s*(?:(?:one|two|three|four|five|six|seven|eight|nine)\\s*hundred){0,1}\\s*" + "(?:and\\s*){0,1}(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,1}\\s*"+
  ")" +
  // then as two two digit numbers, e.g. nineteen forty five
  "|" +
  "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,2}\\s*" +
  ")\\.*$";

  regExp = new RegExp(fullCalendarDateString1, "ig");
  if(matchResult = regExp.exec(value)){
    let month = matchResult[1];
    month = month.replace(/January/ig, 1);
    month = month.replace(/February/ig, 2);
    month = month.replace(/March/ig, 3);
    month = month.replace(/April/ig, 4);
    month = month.replace(/May/ig, 5);
    month = month.replace(/June/ig, 6);
    month = month.replace(/July/ig, 7);
    month = month.replace(/August/ig, 8);
    month = month.replace(/September/ig, 9);
    month = month.replace(/October/ig, 10);
    month = month.replace(/November/ig, 11);
    month = month.replace(/December/ig, 12);
    let dayOfMonth = matchResult[2];
    dayOfMonth = _processMatchedNumericSlotValue(dayOfMonth);
    let year = matchResult[3];
    year = _processMatchedNumericSlotValue(year);

    return "" + _fourDigitFormatter(year) + "-" + _twoDigitFormatter(month) + "-" + _twoDigitFormatter(dayOfMonth);
  }

  return value;
}

var _getWeekOfYear = function(dateToProcess){
  let year = dateToProcess.getFullYear();
  let firstOfYear = new Date("" + year + "/1/1");
  let firstOfYearDay = firstOfYear.getDay();
  // Note that in js day of week begins with Sunday, being 0
  // For the standard week day calculations, week begins on Monday as 1.
  let weekStartingValue = 1;
  if(firstOfYearDay >= 1 && firstOfYearDay <= 4){
    // 1/1/year is in the current year.
    weekStartingValue = 1;
  }
  else {
    // 1/1/year is in the last year.
    weekStartingValue = 0;
  }
  // Compute Monday of the week that contains January 1st.  Remember that for
  // these purposes the week starts on Monday.
  if(firstOfYearDay == 0){
    // If Sunday then change to 7.
    firstOfYearDay = 7;
  }
  let monday = new Date(firstOfYear);
  monday.setDate((-1 * firstOfYearDay) + 1);
  // Now compute the number of weeks from that Monday to now.
  let weeksDiff = Math.floor((dateToProcess - monday)/(7 * 24 * 60 * 60 * 1000));
  let weekNumber = weeksDiff + weekStartingValue;
  if(weekNumber == 0){
    // This means it's the last week of previous year.
    return (_getWeekOfYear(new Date("" + year + "/12/31")))
  }
  return "" + year + "-W" + _twoDigitFormatter(weekNumber);

}

var _processMatchedSlotValueByType = function(value, slotType){
//  console.log("_processMatchedSlotValueByType, value: " + JSON.stringify(value) + ", slotType: " + slotType);
  if(slotType == "AMAZON.NUMBER" || slotType == "AMAZON.FOUR_DIGIT_NUMBER"){
    return _processMatchedNumericSlotValue(value);
  }
  if(slotType == "AMAZON.DATE"){
    return _processMatchedDateSlotValue(value);
  }

  return value;
}

var _matchText = function(stringToMatch){
//  console.log("_matchText, 1");
  var recognizerSet;
  if (fs.existsSync("./recognizer.json")) {
    console.log("_matchText, 1.1");
    recognizerSet = require("./recognizer.json");
  }
  else if (fs.existsSync("../../recognizer.json")){
    console.log("_matchText, 1.2");
    recognizerSet = require("../../recognizer.json");
  }
  if(typeof recognizerSet == "undefined"){
    throw {"error": recognizer.errorCodes.MISSING_RECOGNIZER, "message": "Unable to load recognizer.json"};
  }
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
//        console.log(JSON.stringify(scratch, null, 2));
        var returnValue = {};
        returnValue.name = scratch.intent;
        returnValue.slots = {};
        for(var j = 1; j < matchResult.length; j++){
          var processedMatchResult = _processMatchedSlotValueByType(matchResult[j], scratch.slots[j - 1].type)
//          console.log("processedMatchResult: " + processedMatchResult);
          returnValue.slots[scratch.slots[j - 1].name] = {"name": scratch.slots[j - 1].name, "value": processedMatchResult};
        }
        return returnValue;
      }
    }
  }
  // Now try the built in intents
  for(var i = 0; i < recognizerSet.builtInIntents.length; i ++){
    let scratch = recognizerSet.builtInIntents[i];
    if(typeof scratch.regExp == "undefined"){
      scratch.regExp = new RegExp(scratch.regExpString, "ig");
//      scratch.regExp = new RegExp("^\\s*((?:help\\s*|help\\s+me\\s*|can\\s+you\\s+help\\s+me\\s*)+)\\s*[.]?\\s*$", "ig");
    }
    let matchResult;
    if(matchResult = scratch.regExp.exec(stringToMatch)){
//      console.log("matchResult: " + JSON.stringify(matchResult));
      var returnValue = {};
      returnValue.name = scratch.name;
      returnValue.slots = {};
      return returnValue;
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
    if(utterances[i].trim() == ""){
      continue;
    }
    var currentValue = {};
    var splitLine = utterances[i].split(/\s+/);
    var currentIntent = splitLine[0];
    if(typeof currentIntent == "undefined" || currentIntent.trim() ==""){
      continue;
    }
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
  recognizerSet.builtInIntents = [];

  var cancelIntent = {
    "name": "AMAZON.CancelIntent",
    "utterances": [
      "cancel", "never mind", "forget it"
    ]
  }
  cancelIntent.regExpString = _makeFullRegExpString(cancelIntent.utterances);
  recognizerSet.builtInIntents.push(cancelIntent);

  var helpIntent = {
    "name": "AMAZON.HelpIntent",
    "utterances": [
      "help", "help me", "can you help me"
    ]
  }
  helpIntent.regExpString = _makeFullRegExpString(helpIntent.utterances);
  recognizerSet.builtInIntents.push(helpIntent);

  var loopOffIntent = {
    "name": "AMAZON.LoopOffIntent",
    "utterances": [
      "loop off"
    ]
  }
  loopOffIntent.regExpString = _makeFullRegExpString(loopOffIntent.utterances);
  recognizerSet.builtInIntents.push(loopOffIntent);

  var loopOnIntentIntent = {
    "name": "AMAZON.LoopOnIntent",
    "utterances": [
      "loop", "loop on", "keep repeating this song"
    ]
  }
  loopOnIntentIntent.regExpString = _makeFullRegExpString(loopOnIntentIntent.utterances);
  recognizerSet.builtInIntents.push(loopOnIntentIntent);

  var nextIntent = {
    "name": "AMAZON.NextIntent",
    "utterances": [
      "next", "skip", "skip forward"
    ]
  }
  nextIntent.regExpString = _makeFullRegExpString(nextIntent.utterances);
  recognizerSet.builtInIntents.push(nextIntent);

  var noIntent = {
    "name": "AMAZON.NoIntent",
    "utterances": [
      "no", "no thanks"
    ]
  }
  noIntent.regExpString = _makeFullRegExpString(noIntent.utterances);
  recognizerSet.builtInIntents.push(noIntent);

  var pauseIntent = {
    "name": "AMAZON.PauseIntent",
    "utterances": [
      "pause", "pause that"
    ]
  }
  pauseIntent.regExpString = _makeFullRegExpString(pauseIntent.utterances);
  recognizerSet.builtInIntents.push(pauseIntent);

  var previousIntent = {
    "name": "AMAZON.PreviousIntent",
    "utterances": [
      "go back", "skip back", "back up"
    ]
  }
  previousIntent.regExpString = _makeFullRegExpString(previousIntent.utterances);
  recognizerSet.builtInIntents.push(previousIntent);

  var repeatIntent = {
    "name": "AMAZON.RepeatIntent",
    "utterances": [
      "repeat", "say that again", "repeat that"
    ]
  }
  repeatIntent.regExpString = _makeFullRegExpString(repeatIntent.utterances);
  recognizerSet.builtInIntents.push(repeatIntent);

  var resumeIntent = {
    "name": "AMAZON.ResumeIntent",
    "utterances": [
      "resume", "continue", "keep going"
    ]
  }
  resumeIntent.regExpString = _makeFullRegExpString(resumeIntent.utterances);
  recognizerSet.builtInIntents.push(resumeIntent);

  var shuffleOffIntent = {
    "name": "AMAZON.ShuffleOffIntent",
    "utterances": [
      "stop shuffling", "shuffle off", "turn off shuffle"
    ]
  }
  shuffleOffIntent.regExpString = _makeFullRegExpString(shuffleOffIntent.utterances);
  recognizerSet.builtInIntents.push(shuffleOffIntent);

  var shuffleOnIntent = {
    "name": "AMAZON.ShuffleOnIntent",
    "utterances": [
      "shuffle", "shuffle on", "shuffle the music", "shuffle mode"
    ]
  }
  shuffleOnIntent.regExpString = _makeFullRegExpString(shuffleOnIntent.utterances);
  recognizerSet.builtInIntents.push(shuffleOnIntent);

  var startOverIntent = {
    "name": "AMAZON.StartOverIntent",
    "utterances": [
      "start over", "restart", "start again"
    ]
  }
  startOverIntent.regExpString = _makeFullRegExpString(startOverIntent.utterances);
  recognizerSet.builtInIntents.push(startOverIntent);

  var stopIntent = {
    "name": "AMAZON.StopIntent",
    "utterances": [
      "stop", "off", "shut up"
    ]
  }
  stopIntent.regExpString = _makeFullRegExpString(stopIntent.utterances);
  recognizerSet.builtInIntents.push(stopIntent);

  var yesIntent = {
    "name": "AMAZON.YesIntent",
    "utterances": [
      "yes", "yes please", "sure"
    ]
  }
  yesIntent.regExpString = _makeFullRegExpString(yesIntent.utterances);
  recognizerSet.builtInIntents.push(yesIntent);

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
