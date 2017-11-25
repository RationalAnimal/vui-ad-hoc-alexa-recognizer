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
"use strict";
let fs = require("fs");
let path = require("path");
let soundex = require("./soundex.js");
let recognizer = {};
let constants = require("./constants.js");
let responder = require("./responder.js");

/**
* Call this to translate the slot from whatever type it was actually reported into
* a "built in" equivalent
*/
// USED IN MATCH
// USED IN GENERATE
// TODO refactor out - currently in two places
var _getTranslatedSlotTypeForInternalLookup = function(slotType){
  let periodIndex = slotType.indexOf(".");
  if(periodIndex < 0){
    return slotType;
  }
  let sansPlatform = slotType.substring(periodIndex);

  let scratch = "TRANSCEND" + sansPlatform;
  return scratch;
};

var _getTranslatedIntentForOutput = function(intent, platformConfig){
  let periodIndex = intent.indexOf(".");
  if(periodIndex < 0){
    return intent;
  }
  let sansPlatform = intent.substring(periodIndex);

  let scratch = platformConfig.output + sansPlatform;
  return scratch;
};
// USED IN MATCH
// USED IN GENERATE
// TODO refactor out - currently in two places
var _hasFlag = function(flagName, flags){
  if(typeof flagName === "undefined" || typeof flags === "undefined" || Array.isArray(flags) === false){
    return false;
  }
  for(let i = 0; i < flags.length; i++){
    if(flags[i].name === flagName){
      return true;
    }
  }
  return false;
};

var _getOrderOfMagnitude = function(number){
  let oom = Math.floor(Math.log10(number));
  //  console.log("_getOrderOfMagnitude, number: " + number + ", oom: " + oom);
  return oom;
};

var _processMatchedNumericSlotValue = function(value){
//  console.log("_processMatchedNumericSlotValue, 1, value: " + JSON.stringify(value));
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
  value = value.replace(/,0/ig, " 0");
  value = value.replace(/,/ig, "");
  value = value.replace(/zero/ig, "0");
  value = value.replace(/oh/ig, "0");

  value = value.replace(/tenth/ig, "10");
  value = value.replace(/eleventh/ig, "11");
  value = value.replace(/twelfth/ig, "12");
  value = value.replace(/thirteenth/ig, "13");
  value = value.replace(/fourteenth/ig, "14");
  value = value.replace(/fifteenth/ig, "15");
  value = value.replace(/sixteenth/ig, "16");
  value = value.replace(/seventeenth/ig, "17");
  value = value.replace(/eighteenth/ig, "18");
  value = value.replace(/nineteenth/ig, "19");
  value = value.replace(/twentieth/ig, "20");
  value = value.replace(/thirtieth/ig, "30");
  value = value.replace(/fortieth/ig, "40");
  value = value.replace(/fiftieth/ig, "50");
  value = value.replace(/sixtieth/ig, "60");
  value = value.replace(/seventieth/ig, "70");
  value = value.replace(/eightieth/ig, "80");
  value = value.replace(/ninetieth/ig, "90");
  value = value.replace(/first/ig, "1");
  value = value.replace(/second/ig, "2");
  value = value.replace(/third/ig, "3");
  value = value.replace(/fourth/ig, "4");
  value = value.replace(/fifth/ig, "5");
  value = value.replace(/sixth/ig, "6");
  value = value.replace(/seventh/ig, "7");
  value = value.replace(/eighth/ig, "8");
  value = value.replace(/ninth/ig, "9");
  value = value.replace(/hundredth/ig, "100");
  value = value.replace(/thousandth/ig, "1000");
  value = value.replace(/millionth/ig, "1000000");
  value = value.replace(/billionth/ig, "1000000000");
  value = value.replace(/trillionth/ig, "1000000000000");


  value = value.replace(/ten/ig, "10");
  value = value.replace(/eleven/ig, "11");
  value = value.replace(/twelve/ig, "12");
  value = value.replace(/thirteen/ig, "13");
  value = value.replace(/fourteen/ig, "14");
  value = value.replace(/fifteen/ig, "15");
  value = value.replace(/sixteen/ig, "16");
  value = value.replace(/seventeen/ig, "17");
  value = value.replace(/eighteen/ig, "18");
  value = value.replace(/nineteen/ig, "19");
  value = value.replace(/twenty/ig, "20");
  value = value.replace(/thirty/ig, "30");
  value = value.replace(/forty/ig, "40");
  value = value.replace(/fifty/ig, "50");
  value = value.replace(/sixty/ig, "60");
  value = value.replace(/seventy/ig, "70");
  value = value.replace(/eighty/ig, "80");
  value = value.replace(/ninety/ig, "90");
  value = value.replace(/one/ig, "1");
  value = value.replace(/two/ig, "2");
  value = value.replace(/three/ig, "3");
  value = value.replace(/four/ig, "4");
  value = value.replace(/five/ig, "5");
  value = value.replace(/six/ig, "6");
  value = value.replace(/seven/ig, "7");
  value = value.replace(/eight/ig, "8");
  value = value.replace(/nine/ig, "9");
  value = value.replace(/hundred/ig, "100");
  value = value.replace(/thousand/ig, "1000");
  value = value.replace(/million/ig, "1000000");
  value = value.replace(/billion/ig, "1000000000");
  value = value.replace(/trillion/ig, "1000000000000");

  value = value.replace(/and/ig, " ");
  //  console.log("_processMatchedNumericSlotValue, 1.1, value: " + JSON.stringify(value));

  value = value.split(/\s+/);
  let convertedValues = [];
  for(let i = 0; i < value.length; i ++){
    if(isNaN(value[i]) || typeof value[i] ===  "undefined" || value[i] === null || value[i].trim().length === 0){
      continue;
    }
    convertedValues.push(parseInt(value[i]));
  }

  value = convertedValues;
  let scratchValues = [];
  let haveAccumulatedValue = false;
  let accummulatedStack = [];
  let lastValue = 0;
  let lastOrderOfMagnitude = 0;
  for(let i = 0; i < value.length; i ++){
    if(haveAccumulatedValue === false){
      if(value[i] === 0){
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
      if(value[i] === 0){
        if(accummulatedStack.length === 2){
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
      if(
        ((accummulatedOrderOfMagnitude < currentOrderOfMagnitude) && value[i] === 100) ||
          ((accummulatedOrderOfMagnitude < currentOrderOfMagnitude) && currentOrderOfMagnitude > 2)
      ){
        // The new value's order of magnitude is larger than the entire accumulated
        // value and new value's order of magnitude is at least 2.  This means
        // we multiply them.
        accummulatedStack[accummulatedStack.length - 1] *= value[i];
        lastOrderOfMagnitude = currentOrderOfMagnitude;
        lastValue = value[i];
        // Need to verify that multiplying does not trigger writing earlier value out.
        if(accummulatedStack.length === 2 &&
           (Math.floor(_getOrderOfMagnitude(accummulatedStack[0])/3) < Math.floor(_getOrderOfMagnitude(accummulatedStack[1])/3))){
          scratchValues.push(accummulatedStack[0]);
          accummulatedStack.splice(0, 1);
        }
        // Now, if the current value, value[i] is >= 1000 then we also need to collapse the stack by adding its values
        if(accummulatedStack.length === 2 && currentOrderOfMagnitude >= 3){
          accummulatedStack[0] += accummulatedStack[1];
          accummulatedStack.splice(1, 1);
        }
        continue;
      }
      if(currentOrderOfMagnitude < lastOrderOfMagnitude){
        // The new value is smaller than the last value.
        // There are 3 possible cases here. First is a special exception for
        // when the previous value was a "teen" or ten value and the current one is in
        // single digits, it still should NOT be added, rather it triggers an
        // output of the prior values and starts a new stack.
        // Other than that, if the last OOM was >= 300 - push it, else add it.
        if(lastValue >= 10 && lastValue <= 19){
          if(accummulatedStack.length === 2){
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
      // the current value. Write out the last value and set the accumulated
      // value to the current one.
      if(accummulatedStack.length === 2){
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
    if(accummulatedStack.length === 2){
      accummulatedStack[0] += accummulatedStack[1];
      accummulatedStack.splice(1, 1);
    }
    scratchValues.push(accummulatedStack[0]);
  }

  value = "";
  for(let i = 0; i < scratchValues.length; i++){
    value += ("" + scratchValues[i]);
  }

  return value;
};

var _processMatchedUsPhoneNumberSlotValue = function(value){
  let strippedDownValue = value.replace(/[-(.,)]/ig, " ");
  strippedDownValue = strippedDownValue.replace("0", "0 ").replace("1", "1 ").replace("2", "2 ").replace("3", "3 ").replace("4", "4 ").replace("5", "5 ").replace("6", "6 ").replace("7", "7 ").replace("8", "8 ").replace("9", "9 ");
  return _processMatchedNumericSlotValue(strippedDownValue);
};

var _twoDigitFormatter = function(number){
  let returnValue = "0" + number;
  returnValue = returnValue.slice(-2);
  return returnValue;
};
var _fourDigitFormatter = function(number){
  let returnValue = "0000" + number;
  returnValue = returnValue.slice(-4);
  return returnValue;
};

var _formatDate = function(date){
  return "" + date.getFullYear() + "-" + _twoDigitFormatter(date.getMonth() + 1) + "-" + _twoDigitFormatter(date.getDate());
};

var _processMatchedCustomSlotValueByType = function(value, slotType, flags, recognizerSet){
//  console.log("_processMatchedCustomSlotValueByType, 1, value: " + value + ", slotType: " + slotType);
  for(let i = 0; i < recognizerSet.customSlotTypes.length; i++){
    let scratchCustomSlotType = recognizerSet.customSlotTypes[i];
    if(scratchCustomSlotType.name !== slotType){
      //      console.log("_processMatchedCustomSlotValueByType, 2");
      continue;
    }
    //    console.log("_processMatchedCustomSlotValueByType, 3");
    if(_hasFlag("SOUNDEX_MATCH", flags)){
      // do regular expression matching
      if(_hasFlag("EXCLUDE_SYNONYMS_MATCH", flags) === false){
        // This is the INCLUDE_SYNONYMS_MATCH case.
        if(typeof scratchCustomSlotType.soundExRegExps === "undefined"){
          scratchCustomSlotType.soundExRegExps = [];
          for(let j = 0; j < scratchCustomSlotType.soundExRegExpStrings.length; j++){
            scratchCustomSlotType.soundExRegExps.push(new RegExp(scratchCustomSlotType.soundExRegExpStrings[j], "ig"));
          }
        }
      }
      else {
        if(typeof scratchCustomSlotType.soundExRegExpsNoSynonyms === "undefined"){
          scratchCustomSlotType.soundExRegExpsNoSynonyms = [];
          for(let j = 0; j < scratchCustomSlotType.soundExRegExpNoSynonymsStrings.length; j++){
            scratchCustomSlotType.soundExRegExpsNoSynonyms.push(new RegExp(scratchCustomSlotType.soundExRegExpNoSynonymsStrings[j], "ig"));
          }
        }
      }

      // Now attempt to match.  If successful - return the corresponding value.
      let matchResult;
      let soundexValue = soundex.simple.soundEx(value, " ");

      if(_hasFlag("EXCLUDE_SYNONYMS_MATCH", flags) === false) {
        // This is the INCLUDE_SYNONYMS_MATCH case.
        for(let j = 0; j < scratchCustomSlotType.soundExRegExpStrings.length; j++){
          scratchCustomSlotType.soundExRegExps[j].lastIndex = 0;
          matchResult = scratchCustomSlotType.soundExRegExps[j].exec(soundexValue);
          if(matchResult){
            if(typeof scratchCustomSlotType.values[j] === "string"){
              return scratchCustomSlotType.values[j];
            }
            else {
              return scratchCustomSlotType.values[j].value;
            }
          }
        }
      }
      else {
        for(let j = 0; j < scratchCustomSlotType.soundExRegExpNoSynonymsStrings.length; j++){
          scratchCustomSlotType.soundExRegExpsNoSynonyms[j].lastIndex = 0;
          matchResult = scratchCustomSlotType.soundExRegExpsNoSynonyms[j].exec(soundexValue);
          if(matchResult){
            if(typeof scratchCustomSlotType.values[j] === "string"){
              return scratchCustomSlotType.values[j];
            }
            else {
              return scratchCustomSlotType.values[j].value;
            }
          }
        }
      }

      // If we are here, that means our wildcard pattern didn't match any of the
      // soundex values.  Return undefined to indicate this.
      return;
    }
    else {
      // Regular, as opposed to SOUNDEX, match
      if(typeof scratchCustomSlotType.regExps === "undefined"){
        scratchCustomSlotType.regExps = [];
        for(let j = 0; j < scratchCustomSlotType.regExpStrings.length; j++){
          scratchCustomSlotType.regExps.push(new RegExp(scratchCustomSlotType.regExpStrings[j], "ig"));
        }
      }
      // Now attempt to match.  If successful - return the corresponding value.
      let matchResult;
      for(let j = 0; j < scratchCustomSlotType.regExps.length; j++){
        scratchCustomSlotType.regExps[j].lastIndex = 0;
        matchResult = scratchCustomSlotType.regExps[j].exec(value);
        if(matchResult){
          if(typeof scratchCustomSlotType.customRegExpString === "string" && scratchCustomSlotType.customRegExpString.length > 0){
            return value;
          }
          if(typeof scratchCustomSlotType.values[j] === "string"){
            return scratchCustomSlotType.values[j];
          }
          else {
            return scratchCustomSlotType.values[j].value;
          }
        }
      }
    }
  }

  // If there is no match, then return the original value
  return value;
};

var _processMatchedTimeSlotValue = function(value){
//  console.log("_processMatchedTimeSlotValue, 1");
  let matchResult;
  let regExp = /(^\s*noon\s*$)/ig;
  if(regExp.exec(value)){
    return "12:00";
  }
  regExp = /(^\s*midnight\s*$)/ig;
  if(regExp.exec(value)){
    return "00:00";
  }
  regExp = /(^\s*(?:this\s*)?morning\s*$)/ig;
  if(regExp.exec(value)){
    return "MO";
  }
  regExp = /(^\s*(?:this\s*)?night\s*$)/ig;
  if(regExp.exec(value)){
    return "NI";
  }
  regExp = /(^\s*(?:this\s*)?after\s*noon\s*$)/ig;
  if(regExp.exec(value)){
    return "AF";
  }
  regExp = /(^\s*(?:this\s*)?evening\s*$)/ig;
  if(regExp.exec(value)){
    return "EV";
  }

  let hourOnlyString =
  "^\\s*(zero|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23){1}\\s*(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*$";

  regExp = new RegExp(hourOnlyString, "ig");
  matchResult = regExp.exec(value);
  if(matchResult){
    //    console.log("matching time, hour only, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    let specifier = matchResult[2];
    if(typeof hour === "undefined" || hour === null || hour.length === 0 ){
      // Didn't actually match a real value.
    }
    else {
      hour = _processMatchedNumericSlotValue(hour);
      let numericHour = parseInt(hour);
      if(specifier === "am" || specifier === "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier === "pm" || specifier === "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier === "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier === "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier === "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour === 12){
          numericHour = 0;
        }
      }
      return "" + _twoDigitFormatter(numericHour) + ":00";
    }
  }

  /*
    if(matchResult = regExp.exec(value)){
  //    console.log("matching time, just the hour, matchResult: " + JSON.stringify(matchResult));
      let hour = matchResult[1];
      if(typeof hour === "undefined" || hour === null || hour.length === 0){
        // Didn't actually match a real value.
      }
      else {
        hour = _processMatchedNumericSlotValue(hour);
        return "" + _twoDigitFormatter(hour) + ":00";
      }
    }
  */
  /*
  * This string is meant to match on an informal hour and minute, e.g. five twenty five.
  * It is assumed that if the person means to say hour and single digit then it will be preceeded by a leading zero, e.g. five oh five or five zero five
  * AM or PM or o'clock may be included
  */
  let hourAndMinutesString1 =
  "^\\s*" +
    "(zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23){1}\\s*" +
    "(zero zero|zero oh|zero 0|oh oh|oh zero|oh 0|0 zero|0 oh|00|0 0|" +
     "zero one|zero 1|oh one|oh 1|0 one|01|0 1|" +
     "zero two|zero 2|oh two|oh 2|0 two|02|0 2|" +
     "zero three|zero 3|oh three|oh 3|0 three|03|0 3|" +
     "zero four|zero 4|oh four|oh 4|0 four|04|0 4|" +
     "zero five|zero 5|oh five|oh 5|0 five|05|0 5|" +
     "zero six|zero 6|oh six|oh 6|0 six|06|0 6|" +
     "zero seven|zero 7|oh seven|oh 7|0 seven|07|0 7|" +
     "zero eight|zero 8|oh eight|oh 8|0 eight|08|0 8|" +
     "zero nine|zero 9|oh nine|oh 9|0 nine|09|0 9|" +

     "ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|" +
     "twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24|twenty five|25|twenty six|26|twenty seven|27|twenty eight|28|twenty nine|29" +
     "thirty|30|thirty one|31|thirty two|32|thirty three|33|thirty four|34|thirty five|35|thirty six|36|thirty seven|37|thirty eight|38|thirty nine|39" +
     "forty|40|forty one|41|forty two|42|forty three|43|forty four|44|forty five|45|forty six|46|forty seven|47|forty eight|48|forty nine|49" +
     "fifty|50|fifty one|51|fifty two|52|fifty three|53|fifty four|54|fifty five|55|fifty six|56|fifty seven|57|fifty eight|58|fifty nine|59" +
    "){1}\\s*" +
    "(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}" +
  "\\s*$";

  regExp = new RegExp(hourAndMinutesString1, "ig");
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
    //    console.log("matching time, hour and minutes, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    let minutes = matchResult[2];
    let specifier = matchResult[3];
    if(typeof hour === "undefined" || hour === null || hour.length === 0 || typeof minutes === "undefined" || minutes === null || minutes.length === 0 ){
      // Didn't actually match a real value.
    }
    else {
      hour = _processMatchedNumericSlotValue(hour);
      minutes = _processMatchedNumericSlotValue(minutes);
      let numericHour = parseInt(hour);
      if(specifier === "am" || specifier === "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier === "pm" || specifier === "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier === "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier === "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier === "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour === 12){
          numericHour = 0;
        }
      }
      return "" + _twoDigitFormatter(numericHour) + ":" + _twoDigitFormatter(minutes);
    }
  }

  regExp = /(^\s*quarter (?:past|after) midnight\s*$)/ig;
  if(regExp.exec(value)){
    return "00:15";
  }
  regExp = /(^\s*half (?:past|after) midnight\s*$)/ig;
  if(regExp.exec(value)){
    return "00:30";
  }
  regExp = /(^\s*quarter (?:to|before) midnight\s*$)/ig;
  if(regExp.exec(value)){
    return "23:45";
  }



  regExp = /(^\s*quarter (?:past|after) noon\s*$)/ig;
  if(regExp.exec(value)){
    return "12:15";
  }
  regExp = /(^\s*half (?:past|after) noon\s*$)/ig;
  if(regExp.exec(value)){
    return "12:30";
  }
  regExp = /(^\s*quarter (?:to|before) noon\s*$)/ig;
  if(regExp.exec(value)){
    return "11:45";
  }

  let quarterPastHour1 = "^\\s*(?:quarter (?:past|after) (zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23)\\s*(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*$)";

  regExp = new RegExp(quarterPastHour1, "ig");
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
    //    console.log("matching quarter after hour, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    let specifier = matchResult[2];
    hour = _processMatchedNumericSlotValue(hour);
    let numericHour = parseInt(hour);
    if(typeof hour === "undefined" || hour === null || hour.length === 0){
      // Didn't actually match a real value.
    }
    else {
      if(specifier === "am" || specifier === "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier === "pm" || specifier === "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier === "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier === "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier === "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour === 12){
          numericHour = 0;
        }
      }
      //      console.log("quarter past, hour: " + numericHour);
      return "" + _twoDigitFormatter(numericHour) + ":15";
    }
  }

  let halfPastHour1 = "^\\s*(?:half (?:past|after) (zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23)\\s*(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*$)";

  regExp = new RegExp(halfPastHour1, "ig");
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
    //    console.log("matching half after hour, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    let specifier = matchResult[2];
    hour = _processMatchedNumericSlotValue(hour);
    let numericHour = parseInt(hour);
    if(typeof hour === "undefined" || hour === null || hour.length === 0){
      // Didn't actually match a real value.
    }
    else {
      if(specifier === "am" || specifier === "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier === "pm" || specifier === "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier === "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier === "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier === "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour === 12){
          numericHour = 0;
        }
      }

      return "" + _twoDigitFormatter(numericHour) + ":30";
    }
  }

  let quarterToHour1 = "^\\s*(?:quarter (?:to|before) (one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24)\\s*(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*$)";

  regExp = new RegExp(quarterToHour1, "ig");
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
    //    console.log("matching quarter to hour, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    hour = _processMatchedNumericSlotValue(hour);

    let specifier = matchResult[2];
    if(typeof hour === "undefined" || hour === null || hour.length === 0){
      // Didn't actually match a real value.
    }
    else {
      hour = _processMatchedNumericSlotValue(hour);
      let numericHour = parseInt(hour);
      if(specifier === "am" || specifier === "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier === "pm" || specifier === "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier === "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier === "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier === "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour === 12){
          numericHour = 0;
        }
      }
      numericHour --;
      return "" + _twoDigitFormatter(numericHour) + ":45";
    }
  }

  /*
  * This string is meant to match on an informal minute before/after the hour, e.g. twenty five past seven.
  * It is assumed that the range of minutes is 1-30 (not 0-60), since people will NOT be saying 0 past 5 or 45 past 7.
  * Instead they will say 5 and 15 to 8, respectively
  * AM or PM or o'clock may be included, but will be ignored if non-sensical (e.g. if 15:15, then it's a 24 hour format and we don't care about a.m./p.m.)
  */
  let hourAndMinutesString2 =
  "^\\s*" +
    "(one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|" +
      "ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|" +
      "twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24|twenty five|25|twenty six|26|twenty seven|27|twenty eight|28|twenty nine|29" +
      "thirty|30" +
    "){1}\\s*" +
    "(past|after|to|before){1}\\s*" +
    "(zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24){1}\\s*" +
    "(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}" +
  "\\s*$";
  regExp = new RegExp(hourAndMinutesString2, "ig");
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
    //    console.log("matching time, hour and minutes, matchResult: " + JSON.stringify(matchResult));
    let minutes = matchResult[1];
    let hour = matchResult[3];
    let beforeAfter = matchResult[2];
    let specifier = matchResult[4];
    hour = _processMatchedNumericSlotValue(hour);
    minutes = _processMatchedNumericSlotValue(minutes);
    //      console.log("matching time, hour and minutes, specifier: " + specifier);
    let numericHour = parseInt(hour);
    if(specifier === "am" || specifier === "a.m."){
      // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
    }
    else if(specifier === "pm" || specifier === "p.m."){
      if(numericHour < 12){
        numericHour += 12;
        hour = "" + numericHour;
      }
    }
    else if(specifier === "in the morning"){
      // Nothing to do really.  Either we have an hour that's < 12 or the user misspoke but we can't correct it.
    }
    else if(specifier === "in the afternoon"){
      if(numericHour >= 1 && numericHour <= 6){
        numericHour += 12;
        hour = "" + numericHour;
      }
      else {
        // Nothing to do really.  The user misspoke but we can't correct it.
      }
    }
    else if(specifier === "in the evening"){
      if(numericHour >= 5 && numericHour <= 9){
        numericHour += 12;
        hour = "" + numericHour;
      }
      else {
        // Nothing to do really.  The user misspoke but we can't correct it.
      }
    }
    else if(specifier === "at night"){
      if(numericHour >= 6 && numericHour <= 11){
        numericHour += 12;
        hour = "" + numericHour;
      }
      else if(numericHour === 12){
        numericHour = 0;
        hour = "" + numericHour;
      }
      else {
        // Nothing to do really.  The user misspoke but we can't correct it.
      }
    }

    if(beforeAfter === "after" || beforeAfter === "past"){
      // Add minutes to hours.
      if(numericHour === 24){
        numericHour = 0;
        hour = "0";
      }
      return _twoDigitFormatter(numericHour) + ":" + _twoDigitFormatter(minutes);
    }
    else {
      // Subtract minutes from hour, a.k.a. add minutes + 30 to the previous hour
      if(numericHour === 0){
        numericHour = 23;
        hour = "23";
      }
      else {
        numericHour --;
        hour = "" + numericHour;
      }
      let numericMinute = parseInt(minutes);
      numericMinute = (60 - numericMinute);
      return _twoDigitFormatter(numericHour) + ":" + _twoDigitFormatter(numericMinute);
    }
  }


  /*
  * This string is meant to match on a military style even hour, e.g. oh one hundred hours or 18 hundred.
  */
  let hourString3 =
  "^\\s*" +
    "(" +
      "oh one hundred|zero one hundred|one hundred|oh 1 hundred|zero 1 hundred|1 hundred|oh 100|0100|100|" +
      "oh two hundred|zero two hundred|two hundred|oh 2 hundred|zero 2 hundred|2 hundred|oh 200|0200|200|" +
      "oh three hundred|zero three hundred|three hundred|oh 3 hundred|zero 3 hundred|3 hundred|oh 300|0300|300|" +
      "oh four hundred|zero four hundred|four hundred|oh 4 hundred|zero 4 hundred|4 hundred|oh 400|0400|400|" +
      "oh five hundred|zero five hundred|five hundred|oh 5 hundred|zero 5 hundred|5 hundred|oh 500|0500|500|" +
      "oh six hundred|zero six hundred|six hundred|oh 6 hundred|zero 6 hundred|6 hundred|oh 600|0600|600|" +
      "oh seven hundred|zero seven hundred|seven hundred|oh 7 hundred|zero 7 hundred|7 hundred|oh 700|0700|700|" +
      "oh eight hundred|zero eight hundred|eight hundred|oh 8 hundred|zero 8 hundred|8 hundred|oh 800|0800|800|" +
      "oh nine hundred|zero nine hundred|nine hundred|oh 9 hundred|zero 9 hundred|9 hundred|oh 900|0900|900|" +
      "eleven hundred|11 hundred|11 100|1100|" +
      "twelve hundred|12 hundred|12 100|1200|" +
      "thirteen hundred|13 hundred|13 100|1300|" +
      "fourteen hundred|14 hundred|14 100|1400|" +
      "fifteen hundred|15 hundred|15 100|1500|" +
      "sixteen hundred|16 hundred|16 100|1600|" +
      "seventeen hundred|17 hundred|17 100|1700|" +
      "eighteen hundred|18 hundred|18 100|1800|" +
      "nineteen hundred|19 hundred|19 100|1900|" +
      "twenty hundred|20 hundred|20 100|2000|" +
      "twenty one hundred|21 hundred|21 100|2100|" +
      "twenty two hundred|22 hundred|22 100|2200|" +
      "twenty three hundred|23 hundred|23 100|2300|" +
      "twenty four hundred|24 hundred|24 100|2400" +
    "){1}\\s*(?:hours|hour){0,1}" +
  "\\s*$";
  regExp = new RegExp(hourString3, "ig");
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
  //    console.log("matching time, hour and minutes, matchResult: " + JSON.stringify(matchResult));
    let time = matchResult[1];
    time = _processMatchedNumericSlotValue(time);
    let numericTime = parseInt(time);
    return _twoDigitFormatter(numericTime/100) + ":00";
  }
};

var _processMatchedDurationSlotValue = function(value){
  let matchResult;
  let generalDurationString =
  "^\\s*" +
    "(" +
       "(?:and|zero|oh|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|\\s|[0-9,])+" +
       "\\s*(?:years{0,1}|months{0,1}|weeks{0,1}|days{0,1}|hours{0,1}|minutes{0,1}|seconds{0,1})" +
    ")+\\s*" +
  "\\s*$";

  let regExp = new RegExp(generalDurationString, "ig");
  let remainingValue = value;
  matchResult = regExp.exec(remainingValue);
  let years;
  let months;
  let weeks;
  let days;
  let hours;
  let minutes;
  let seconds;
  let gotDuration = false;
  let gotTimePortion = false;
  while(matchResult){
    remainingValue = remainingValue.replace(matchResult[1], "");
    if(/year/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/years?/, "");
      years = _processMatchedNumericSlotValue(scratchSubValue);
      years = parseInt(years);
      if(years === 0){
        years = undefined;
      }
      else {
        years = "" + years;
        gotDuration = true;
      }
      //      console.log("years: " + years);
    }
    else if(/month/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/months?/, "");
      months = _processMatchedNumericSlotValue(scratchSubValue);
      months = parseInt(months);
      if(months === 0){
        months = undefined;
      }
      else {
        months = "" + months;
        gotDuration = true;
      }
      //      console.log("months: " + months);
    }
    else if(/week/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/weeks?/, "");
      weeks = _processMatchedNumericSlotValue(scratchSubValue);
      weeks = parseInt(weeks);
      if(weeks === 0){
        weeks = undefined;
      }
      else {
        weeks = "" + weeks;
        gotDuration = true;
      }
      //      console.log("weeks: " + weeks);
    }
    else if(/day/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/days?/, "");
      days = _processMatchedNumericSlotValue(scratchSubValue);
      days = parseInt(days);
      if(days === 0){
        days = undefined;
      }
      else {
        days = "" + days;
        gotDuration = true;
      }
      //      console.log("days: " + days);
    }
    else if(/hour/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/hours?/, "");
      hours = _processMatchedNumericSlotValue(scratchSubValue);
      hours = parseInt(hours);
      if(hours === 0){
        hours = undefined;
      }
      else {
        hours = "" + hours;
        gotDuration = true;
        gotTimePortion = true;
      }
      //      console.log("hours: " + hours);
    }
    else if(/minute/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/minutes?/, "");
      minutes = _processMatchedNumericSlotValue(scratchSubValue);
      minutes = parseInt(minutes);
      if(minutes === 0){
        minutes = undefined;
      }
      else {
        minutes = "" + minutes;
        gotDuration = true;
        gotTimePortion = true;
      }
      //      console.log("minutes: " + minutes);
    }
    else if(/second/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/seconds?/, "");
      seconds = _processMatchedNumericSlotValue(scratchSubValue);
      seconds = parseInt(seconds);
      if(seconds === 0){
        seconds = undefined;
      }
      else {
        seconds = "" + seconds;
        gotDuration = true;
        gotTimePortion = true;
      }
      //      console.log("seconds: " + seconds);
    }
    regExp.lastIndex = 0;
    matchResult = regExp.exec(remainingValue);
  }
  if(gotDuration){
    let returnValue = "P";
    if(typeof years !== "undefined"){
      returnValue += (years + "Y");
    }
    if(typeof months !== "undefined"){
      returnValue += (months + "M");
    }
    if(typeof weeks !== "undefined"){
      returnValue += (weeks + "W");
    }
    if(typeof days !== "undefined"){
      returnValue += (days + "D");
    }
    if(gotTimePortion){
      returnValue += "T";
      if(typeof hours !== "undefined"){
        returnValue += (hours + "H");
      }
      if(typeof minutes !== "undefined"){
        returnValue += (minutes + "M");
      }
      if(typeof seconds !== "undefined"){
        returnValue += (seconds + "S");
      }
    }
    return returnValue;
  }
};

// USED IN MATCH
// NOT IN GENERATE
var _processMatchedDateSlotValue = function(value, flags){
  let matchResult;
  let regExp = /(right now)/ig;
  if(regExp.exec(value)){
    return "PRESENT_REF";
  }
  regExp = /(today)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    return _formatDate(today);
  }
  regExp = /(yesterday)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() - 1);
    return _formatDate(today);
  }
  regExp = /(tomorrow)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() + 1);
    return _formatDate(today);
  }

  regExp = /(^\s*this week\s*\.*$)/ig;
  if(regExp.exec(value)){
    return _getWeekOfYear(new Date());
  }

  regExp = /(^\s*last week\s*\.*$)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() - 7);
    return _getWeekOfYear(today);
  }

  regExp = /(^\s*next week\s*\.*$)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() + 7);
    return _getWeekOfYear(today);
  }

  regExp = /(^\s*this weekend\s*\.*$)/ig;
  if(regExp.exec(value)){
    return (_getWeekOfYear(new Date()) + "-WE");
  }

  regExp = /(^\s*last weekend\s*\.*$)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() - 7);
    return (_getWeekOfYear(today) + "-WE");
  }

  regExp = /(^\s*next weekend\s*\.*$)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    today.setDate(today.getDate() + 7);
    return (_getWeekOfYear(today) + "-WE");
  }

  regExp = /(this month)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    return "" + year + "-" + _twoDigitFormatter(month + 1);
  }
  regExp = /(last month)/ig;
  if(regExp.exec(value)){
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
  regExp = /(next month)/ig;
  if(regExp.exec(value)){
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
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
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
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
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
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
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

  regExp = /(this year)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    return "" + year;
  }
  regExp = /(last year)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    year--;
    return "" + year;
  }
  regExp = /(next year)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    year++;
    return "" + year;
  }
  regExp = /(this decade)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let decade = Math.floor(year / 10);
    return "" + decade + "X";
  }
  regExp = /(last decade)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let decade = Math.floor(year / 10) - 1;
    return "" + decade + "X";
  }
  regExp = /(next decade)/ig;
  if(regExp.exec(value)){
    let today = new Date();
    let year = today.getFullYear();
    let decade = Math.floor(year / 10) + 1;
    return "" + decade + "X";
  }

  let fullCalendarDateString1 =
  "^(January|February|March|April|May|June|July|August|September|October|November|December){0,1}\\s*" +
  "(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|sixth|6th|seventh|7th|eighth|8th|nineth|9th|tenth|10th|" +
  "eleventh|11th|twelfth|12th|thirteenth|13th|fourteenth|14th|fifteenth|15th|sixteenth|16th|seventeenth|17th|eighteenth|18th|nineteenth|19th|twentieth|20th|" +
  "twenty first|21st|twenty second|22nd|thwenty third|23rd|twenty fourth|24th|twenty fifth|25th|twenty sixth|26th|twenty seventh|27th|" +
  "twenty eighth|28th|twenty ninth|29th|thirtieth|30th|thirty first|31st){0,1}\\s*" +
    /*
  "(one|first|1st|two|second|2nd|three|third|3rd|four|fourth|4th|five|fifth|5th|six|sixth|6th|seven|seventh|7th|eight|eighth|8th|nine|nineth|9th|ten|tenth|10th|" +
  "eleven|eleventh|11th|twelve|twelfth|12th|thirteen|thirteenth|13th|fourteen|fourteenth|14th|fifteen|fifteenth|15th|sixteen|sixteenth|16th|seventeen|seventeenth|17th|eighteen|eighteenth|18th|nineteen|nineteenth|19th|twenty|twentieth|20th|" +
  "twenty one|twenty first|21st|twenty two|twenty second|22nd|twenty three|thwenty third|23rd|twenty four|twenty fourth|24th|twenty five|twenty fifth|25th|twenty six|twenty sixth|26th|twenty seven|twenty seventh|27th|" +
  "twenty eight|twenty eighth|28th|twenty nine|twenty ninth|29th|thirty|thirtieth|30th|thirty one|thirty first|31st){1}\\s*" +
*/
  // Now the year, first as spelled out number, e.g. one thousand nine hundred forty five
  "(" +
    "(?:" +
      "(?:one thousand|two thousand){0,1}\\s*(?:(?:one|two|three|four|five|six|seven|eight|nine)\\s*hundred){0,1}\\s*" + "(?:and\\s*){0,1}(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,1}\\s*"+
    ")" +
    // then as two two digit numbers, e.g. nineteen forty five
    "|" +
    "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,2}\\s*" +
    // then as four digits, e.g. 1945
    "|" +
    "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9])\\s*){4}" +
  "){0,1}\\.*$";

  regExp = new RegExp(fullCalendarDateString1, "ig");
  if(matchResult = regExp.exec(value)){ // eslint-disable-line no-cond-assign
    let month = matchResult[1];
    let dayOfMonth = matchResult[2];
    let year = matchResult[3];
    let monthNotSpecified = false;

    if(typeof month === "undefined" || month === null || month.trim().length === 0){
      monthNotSpecified = true;
    }
    else {
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
    }
    let dayOfMonthNotSpecified = false;
    if(typeof dayOfMonth === "undefined" || dayOfMonth === null || dayOfMonth.trim().length === 0){
      dayOfMonthNotSpecified = true;
    }
    else {
      dayOfMonth = dayOfMonth.replace(/0th/,0);
      dayOfMonth = dayOfMonth.replace(/1st/,1);
      dayOfMonth = dayOfMonth.replace(/2nd/,2);
      dayOfMonth = dayOfMonth.replace(/3rd/,3);
      dayOfMonth = dayOfMonth.replace(/1th/,1);
      dayOfMonth = dayOfMonth.replace(/2th/,2);
      dayOfMonth = dayOfMonth.replace(/3th/,3);
      dayOfMonth = dayOfMonth.replace(/4th/,4);
      dayOfMonth = dayOfMonth.replace(/5th/,5);
      dayOfMonth = dayOfMonth.replace(/6th/,6);
      dayOfMonth = dayOfMonth.replace(/7th/,7);
      dayOfMonth = dayOfMonth.replace(/8th/,8);
      dayOfMonth = dayOfMonth.replace(/9th/,9);
      dayOfMonth = _processMatchedNumericSlotValue(dayOfMonth);
    }
    let yearNotSpecified = false;
    if(typeof year === "undefined" || year === null || year.length === 0){
      yearNotSpecified = true;
    }
    else {
      year = _processMatchedNumericSlotValue(year);
    }
    if(monthNotSpecified === false && dayOfMonthNotSpecified === false && yearNotSpecified === false){
      return "" + _fourDigitFormatter(year) + "-" + _twoDigitFormatter(month) + "-" + _twoDigitFormatter(dayOfMonth);
    }
    if(monthNotSpecified === false && dayOfMonthNotSpecified === true && yearNotSpecified === false){
      // Return just a year and month
      return "" + _fourDigitFormatter(year) + "-" + _twoDigitFormatter(month);
    }
    if(monthNotSpecified === true && dayOfMonthNotSpecified === true && yearNotSpecified === false){
      // Return just a year
      // Test for EXCLUDE_YEAR_ONLY_DATES flag - if there, return undefined;
      if(_hasFlag("EXCLUDE_YEAR_ONLY_DATES", flags)){
        return;
      }
      return "" + _fourDigitFormatter(year);
    }
    if(monthNotSpecified === false && dayOfMonthNotSpecified === false && yearNotSpecified === true){
      // Get the closest in the future year and return the full date
      let today = new Date();
      year = today.getFullYear();
      if(today.getMonth() + 1 > month || (today.getMonth() + 1 === month && (today.getDate() > dayOfMonth))){
        year++;
      }
      return "" + _fourDigitFormatter(year) + "-" + _twoDigitFormatter(month) + "-" + _twoDigitFormatter(dayOfMonth);
    }
  }
  return value;
};

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
  if(firstOfYearDay === 0){
    // If Sunday then change to 7.
    firstOfYearDay = 7;
  }
  let monday = new Date(firstOfYear);
  monday.setDate((-1 * firstOfYearDay) + 1);
  // Now compute the number of weeks from that Monday to now.
  let weeksDiff = Math.floor((dateToProcess - monday)/(7 * 24 * 60 * 60 * 1000));
  let weekNumber = weeksDiff + weekStartingValue;
  if(weekNumber === 0){
    // This means it's the last week of previous year.
    return (_getWeekOfYear(new Date("" + year + "/12/31")));
  }
  return "" + year + "-W" + _twoDigitFormatter(weekNumber);

};

// USED IN MATCH
// NOT IN GENERATE
var _findExactCaseBuiltInValue = function(value, slotType, recognizerSet){
  let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, slotType);
  let scratchValue = value.toUpperCase();
  for(let i = 0; i < builtInSlotValues.length; i ++){
    if(builtInSlotValues[i].toUpperCase() === scratchValue){
      return builtInSlotValues[i];
    }
  }
  return value;
};

// USED IN MATCH
// NOT IN GENERATE

var _processMatchedSlotValueByType = function(value, slotType, flags, slot, intent, recognizerSet){
//  console.log("_processMatchedSlotValueByType, entered");
  slotType = _getTranslatedSlotTypeForInternalLookup(slotType);
  //  console.log("_processMatchedSlotValueByType, 1, slotType: " + slotType + ", value: " + value);
  let returnValue = value;
  if(slotType === "TRANSCEND.NUMBER" || slotType === "TRANSCEND.FOUR_DIGIT_NUMBER"){
    returnValue = _processMatchedNumericSlotValue(value);
  }
  else if(slotType === "TRANSCEND.US_PHONE_NUMBER"){
    returnValue = _processMatchedUsPhoneNumberSlotValue(value);
  }
  else if(slotType === "TRANSCEND.DATE"){
    returnValue =  _processMatchedDateSlotValue(value, flags);
  }
  else if(slotType === "TRANSCEND.TIME"){
    returnValue =  _processMatchedTimeSlotValue(value);
  }
  else if(slotType === "TRANSCEND.DURATION"){
    returnValue =  _processMatchedDurationSlotValue(value);
  }
  else if(slotType.startsWith("TRANSCEND.")){
    // already did returnValue = value;
    // Now need to match the capitalization
    if(slotType === "TRANSCEND.Airline"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.Airline");
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toUpperCase() === scratchValue){
          returnValue = builtInSlotValues[i].name;
          break;
        }
      }
    }
    else if(slotType === "TRANSCEND.SportsTeam"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.SportsTeam");
      let scratchValue = returnValue.toUpperCase();
      outsideloop:
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toUpperCase() === scratchValue){
          returnValue = builtInSlotValues[i].name;
          break outsideloop;
        }
        if(typeof builtInSlotValues[i].alternativeNames !== "undefined" && Array.isArray(builtInSlotValues[i].alternativeNames)){
          for(let j = 0; j < builtInSlotValues[i].alternativeNames.length; j++){
            if(builtInSlotValues[i].alternativeNames[j].toUpperCase() === scratchValue){
              returnValue = builtInSlotValues[i].name;
              break outsideloop;
            }
          }
        }
        for(let j = 0; j < builtInSlotValues[i].priorNames.length; j++){
          if(builtInSlotValues[i].priorNames[j].toUpperCase() === scratchValue){
            returnValue = builtInSlotValues[i].priorNames[j];
            break outsideloop;
          }
        }
      }
    }
    else if(slotType === "TRANSCEND.Corporation"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.Corporation");
      let scratchValue = returnValue.toUpperCase();
      outsideloop:
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toUpperCase() === scratchValue){
          returnValue = builtInSlotValues[i].name;
          break outsideloop;
        }
        if(typeof builtInSlotValues[i].alternativeNames !== "undefined" && Array.isArray(builtInSlotValues[i].alternativeNames)){
          for(let j = 0; j < builtInSlotValues[i].alternativeNames.length; j++){
            if(builtInSlotValues[i].alternativeNames[j].toUpperCase() === scratchValue){
              returnValue = builtInSlotValues[i].name;
              break outsideloop;
            }
          }
        }
        for(let j = 0; j < builtInSlotValues[i].priorNames.length; j++){
          if(builtInSlotValues[i].priorNames[j].toUpperCase() === scratchValue){
            returnValue = builtInSlotValues[i].priorNames[j];
            break outsideloop;
          }
        }
      }
    }
    else if(slotType === "TRANSCEND.Airport"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.Airport");
      let scratchValue = returnValue.toUpperCase();
      outsideloop:
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toUpperCase() === scratchValue){
          returnValue = builtInSlotValues[i].name;
          break outsideloop;
        }
        if(typeof builtInSlotValues[i].alternativeNames !== "undefined" && Array.isArray(builtInSlotValues[i].alternativeNames)){
          for(let j = 0; j < builtInSlotValues[i].alternativeNames.length; j++){
            if(builtInSlotValues[i].alternativeNames[j].toUpperCase() === scratchValue){
              returnValue = builtInSlotValues[i].name;
              break outsideloop;
            }
          }
        }
        for(let j = 0; j < builtInSlotValues[i].priorNames.length; j++){
          if(builtInSlotValues[i].priorNames[j].toUpperCase() === scratchValue){
            returnValue = builtInSlotValues[i].priorNames[j];
            break outsideloop;
          }
        }
      }
    }
    else if(slotType === "TRANSCEND.US_STATE"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.US_STATE");
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toUpperCase() === scratchValue){
          returnValue = builtInSlotValues[i].name;
          break;
        }
      }
    }
    else if(slotType === "TRANSCEND.US_PRESIDENT"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.US_PRESIDENT");
      let scratchValue = returnValue.toLowerCase();
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toLowerCase() === scratchValue ||
           builtInSlotValues[i].matchingStrings.indexOf(scratchValue) > 0 ||
           builtInSlotValues[i].ordinalMatchingStrings.indexOf(scratchValue) > 0
        ){
          returnValue = builtInSlotValues[i].name;
          break;
        }
      }
    }
    else {
      returnValue = _findExactCaseBuiltInValue(value, slotType, recognizerSet);
    }
  }
  else {
    // Here we are dealing with a custom slot value
    returnValue =  _processMatchedCustomSlotValueByType(value, slotType, flags, recognizerSet);
  }
  let transformFilename = _getSlotTransformSrcFilenameFromRecognizer(recognizerSet, intent, slot);
  if(typeof transformFilename !== "undefined"){
    try {
      if(Array.isArray(transformFilename)){
        for(let i = 0; i < transformFilename.length; i ++){
          let transform = require(path.resolve(transformFilename[i]));
          returnValue = transform(returnValue, intent, slot, slotType);
        }
      }
      else {
        let transform = require(path.resolve(transformFilename));
        returnValue = transform(returnValue, intent, slot, slotType);
      }
    }
    catch(e){
      console.log("got e while trying to load a transform function: ", e);
    }
  }
  return returnValue;
};

let _isSubObject = function(subObject, withinObject){
  if(subObject === withinObject){
    return true;
  }
  if(typeof subObject === "undefined"){
    return false;
  }
  if(typeof withinObject === "undefined"){
    return false;
  }
  if(subObject === null && withinObject === null){
    return true;
  }
  if(subObject === null || withinObject === null){
    return false;
  }
  if(typeof subObject !== "object" || typeof withinObject !== "object"){
    return subObject === withinObject;
  }
  for(let key in subObject) {
    if(subObject.hasOwnProperty(key)){
      //      if(subObject[key] !== withinObject[key] && _isSubObject(subObject[key], withinObject[key]) === false){
      if(_isSubObject(subObject[key], withinObject[key]) === false){
        return false;
      }
    }
  }
  return true;
};

let _isSubObjectAny = function(subObject, withinArray){
  if(typeof withinArray === "undefined" || withinArray === null || Array.isArray(withinArray) === false){
    return false;
  }
  for(let i = 0; i < withinArray.length; i++){
    if(_isSubObject(subObject, withinArray[i])){
      return true;
    }
  }
  return false;
};

/**
 * Call this function to determine whether state matches or not.
 * @param state - a single "state" from the domain file's "states" field
 * @param stateAccessor - the state accessor object to use to access the state
 * @returns {boolean} - true if state condition matches, false otherwise
 * @private
 */
// TODO examine code to see why applicationState is being passed. This does not seem to be needed anymore and should be removed.
let _checkStateMatchCriteria = function(state, stateAccessor, applicationState){ // eslint-disable-line no-unused-vars
  if(
    (state.matchCriteria === "default") ||
      (
        (typeof state.matchCriteria === "object" && state.matchCriteria !== null && typeof stateAccessor === "object") &&
        (
          ((state.matchCriteria.match === true) && _isSubObject(stateAccessor.getState(state.matchCriteria.selector), state.matchCriteria.value)) ||
          ((state.matchCriteria.match === false) && (_isSubObject(stateAccessor.getState(state.matchCriteria.selector), state.matchCriteria.value)) === false) ||
          ((state.matchCriteria.match === true) && _isSubObjectAny(stateAccessor.getState(state.matchCriteria.selector), state.matchCriteria.values)) ||
          ((state.matchCriteria.match === false) && (_isSubObjectAny(stateAccessor.getState(state.matchCriteria.selector), state.matchCriteria.values)) === false)
        )
      )
  ) {
    return true;
  }
  return false;
};

/**
 * Call this function to use an AppModule/Domain json to match text
 * @param {string} stringToMatch - the text to match to intent or result.
 * @param {string|object} domain
 * @param {object} stateAccessor - optional, needed only if state is specified in the domain or if responder is
 *   specified. Call this function to get or set the current state info.
 * @returns {object}
 * @private
 */
var _matchTextDomain = function(stringToMatch, domain, stateAccessor, stateSelectors, applicationState){
//  console.log("_matchTextDomain, 1");
  let domainToUse;
  if(typeof domain === "string"){
    //    console.log("_matchTextDomain, 2");
    // We need to load the domain
    // TODO add code to properly resolve domains at run time
    domainToUse = require(domain);
  }
  else if(typeof domain === "object" && domain != null){
    //    console.log("_matchTextDomain, 3");
    domainToUse = domain;
  }
  else {
    //    console.log("_matchTextDomain, 4");
    return undefined;
  }
  if((typeof domainToUse.recognizers === "undefined" || Array.isArray(domainToUse.recognizers) === false) &&
     (typeof domainToUse.domains     === "undefined" || Array.isArray(domainToUse.domains)     === false)){
    //    console.log("_matchTextDomain, 5");
    return undefined;
  }
  if(typeof stateSelectors === "undefined" || stateSelectors === null || Array.isArray(stateSelectors) === false){
    stateSelectors = [];
  }
  // Now populate all the recognizers.
  let recognizers = {};
  //  console.log("_matchTextDomain, 6");
  if(typeof domainToUse.recognizers !== "undefined" && Array.isArray(domainToUse.recognizers)){
    for(let i = 0; i < domainToUse.recognizers.length; i ++){
      //    console.log("_matchTextDomain, 7, i: " + i);
      let currentRecognizer = domainToUse.recognizers[i];
      if(typeof currentRecognizer.path === "string" && typeof currentRecognizer.key !== "undefined"){
        try{
          // TODO add code to properly resolve recognizers at run time
          recognizers[currentRecognizer.key] = require(currentRecognizer.path);
        }
        catch(e){
          // TODO handle failure to load recognizer
        }
      }
      else if(typeof currentRecognizer.recognizer === "object" && typeof currentRecognizer.key !== "undefined"){
        recognizers[currentRecognizer.key] = currentRecognizer.recognizer;
      }
    }
  }
  // Now populate all the domains.
  let domains = {};
  if(typeof domainToUse.domains !== "undefined" && Array.isArray(domainToUse.domains)){
    for(let i = 0; i < domainToUse.domains.length; i ++){
      let currentDomain = domainToUse.domains[i];
      if(typeof currentDomain.path === "string" && typeof currentDomain.key !== "undefined"){
        try{
          // TODO add code to properly resolve domains at run time
          domains[currentDomain.key] = require(currentDomain.path);
        }
        catch(e){
          // TODO handle failure to load recognizer
        }
      }
      else if(typeof currentDomain.domain === "object" && typeof currentDomain.key !== "undefined"){
        domains[currentDomain.key] = currentDomain.domain;
      }
    }
  }

  //  for (let key in recognizers) {
  //    if (recognizers.hasOwnProperty(key)) {
  //      console.log("_matchTextDomain, 12, key: " + key);
  //    }
  //  }

  // Now actually try to get the match
  for(let i = 0; i < domainToUse.states.length; i++){
    //    console.log("_matchTextDomain, 13, i: " + i);
    let state = domainToUse.states[i];
    //    console.log("_matchTextDomain, 14");
    if(_checkStateMatchCriteria(state, stateAccessor, applicationState)){
      for(let j = 0; j < state.matchSpecs.length; j ++){
        if(typeof state.matchSpecs[j].recognizer !== "undefined"){
          let scratchRecognizer = recognizers[state.matchSpecs[j].recognizer];
          let match = _matchText(stringToMatch, undefined, undefined, scratchRecognizer);
          if(typeof match !== "undefined" && match !== null){
            let returnObject = {"match": match};
            if(typeof state.matchSpecs[j].responder !== "undefined"){
              // TODO add code to get the intent name regardless of platform
              returnObject.result = responder.produceResult(match.name, stateAccessor, stateSelectors, state.matchSpecs[j].responder);
            }
            else if(typeof state.matchSpecs[j].responders !== "undefined" && Array.isArray(state.matchSpecs[j].responders)){
              // TODO add code to get the intent name regardless of platform
              returnObject.result = {};
              for(let k = 0; k < state.matchSpecs[j].responders.length; k++){
                let newResult = responder.produceResult(match.name, stateAccessor, stateSelectors, state.matchSpecs[j].responders[k]);
                returnObject.result = responder.combineResponses(returnObject.result, newResult, state.matchSpecs[j].responders[k].result.combineRule);
              }
            }
            return returnObject;
          }
        }
        else if(typeof state.matchSpecs[j].domain !== "undefined"){
          let scratchDomain = domains[state.matchSpecs[j].domain];
          let updatedSelectors = [].concat(stateSelectors);
          for(let k = 0; k < domainToUse.domains.length; k++){
            let scratchDomainInfo = domainToUse.domains[k];
            if(scratchDomainInfo.key === state.matchSpecs[j].domain){
              let scratchDomainSelector = scratchDomainInfo.selector;
              let scratchDomainTrusted =  scratchDomainInfo.trusted;
              if(typeof scratchDomainSelector === "string"){
                // This is a short hand notation for an untrusted domain with a given selector and no specified location for untrusted state store.
                let subAccessor = stateAccessor.createSubAccessor(updatedSelectors, {"read": false, "write": false, "selector": scratchDomainSelector});
                let result = _matchTextDomain(stringToMatch, scratchDomain, subAccessor, [], applicationState);
                if(typeof result !== "undefined" && result !== null){
                  return result;
                }
              }
              else if(typeof scratchDomainTrusted !== "undefined" && scratchDomainTrusted !== null){
                // If we are here that means we have the domain trust specification
                if(scratchDomainTrusted.read === true && scratchDomainTrusted.write === true){
                  // This means the domain is fully trusted.
                  let subAccessor = stateAccessor.createSubAccessor(updatedSelectors, scratchDomainTrusted);
                  let result = _matchTextDomain(stringToMatch, scratchDomain, subAccessor, [], applicationState);
                  if(typeof result !== "undefined" && result !== null){
                    return result;
                  }
                }
                else if(scratchDomainTrusted.read === false && scratchDomainTrusted.write === false){
                  // This means the domain is fully trusted.
                  let subAccessor = stateAccessor.createSubAccessor(updatedSelectors, scratchDomainTrusted);
                  let result = _matchTextDomain(stringToMatch, scratchDomain, subAccessor, [], applicationState);
                  if(typeof result !== "undefined" && result !== null){
                    return result;
                  }
                }
              }
            }
          }
        }
      }
    }
    else {
      //      console.log("_matchTextDomain, 20");
      // TODO continue from here.
    }
  }
  //  console.log("_matchTextDomain, 21");
  return undefined;
};

// USED IN MATCH
// NOT IN GENERATE
var _matchText = function(stringToMatch, intentsSequence, excludeIntents, recognizerToUse){
  //  console.log("_matchText, 1");
  let recognizerSet;
  if(typeof recognizerToUse !== "undefined" && recognizerToUse !== null){
    recognizerSet = recognizerToUse;
  }
  else {
    if (fs.existsSync("./recognizer.json")) {
    //    console.log("_matchText, 1.1");
      recognizerSet = require("./recognizer.json");
    }
    else if (fs.existsSync("../../recognizer.json")){
    //    console.log("_matchText, 1.2");
      recognizerSet = require("../../recognizer.json");
    }
  }
  if(typeof recognizerSet === "undefined"){
    throw {"error": constants.errorCodes.MISSING_RECOGNIZER, "message": "Unable to load recognizer.json"};
  }

  // First, correct some of Microsoft's "deviations"
  // Do this only if the number slot type is used
  let numberValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.NUMBER");
  if(typeof numberValues !== "undefined" && Array.isArray(numberValues)){
    // look for a $ followed by a number and replace it with the number followed by the word "dollars".
    let regExpString = "(\\$\\s*(?:\\s*";
    for(let i = 0; i < numberValues.length; i++){
      regExpString += "|" + numberValues[i];
    }
    regExpString += "|,";

    regExpString +=    ")+)";
    let regExp = new RegExp(regExpString, "ig");
    let regExpNonGlobal = new RegExp(regExpString, "i");
    let dollarMatchResult;
    while(dollarMatchResult = regExp.exec(stringToMatch)){ // eslint-disable-line no-cond-assign
      //    console.log("dollarMatchResult: " + JSON.stringify(dollarMatchResult));
      if(dollarMatchResult === null){
        continue;
      }
      let dollarlessMatch = dollarMatchResult[0].substring(1);
      //    console.log("dollarlessMatch: " + JSON.stringify(dollarlessMatch));
      regExpNonGlobal.lastIndex = 0;
      stringToMatch = stringToMatch.replace(regExpNonGlobal, dollarlessMatch + " dollars ");
      //    console.log("stringToMatch: " + JSON.stringify(stringToMatch));
      regExp.lastIndex = 0;
    }
    // Now separate all leading zeros so that they don't get lost later in the parsing.
    regExp = /(^0[0-9])/;
    let leadingZeroMatchResult;
    if(leadingZeroMatchResult = regExp.exec(stringToMatch)){ // eslint-disable-line no-cond-assign
      if(leadingZeroMatchResult !== null){
        let replacementString = "0 " + leadingZeroMatchResult[0].substring(1);
        stringToMatch = stringToMatch.replace(/(^0[0-9])/, replacementString);
        regExp.lastIndex = 0;
      }
    }

    regExp = /([^0-9]0[0-9])/ig;
    while(leadingZeroMatchResult = regExp.exec(stringToMatch)){ // eslint-disable-line no-cond-assign
      if(leadingZeroMatchResult === null){
        continue;
      }
      let replacementString = leadingZeroMatchResult[0].substring(0, 1) + "0 " + leadingZeroMatchResult[0].substring(2);
      stringToMatch = stringToMatch.replace(/([^0-9]0[0-9])/, replacementString);
      regExp.lastIndex = 0;
    }
  }

  //  console.log("_matchText, 2, recognizerSet: " + JSON.stringify(recognizerSet));
  let originalMatchConfig = [].concat(recognizerSet.matchConfig);

  if(typeof intentsSequence !== "undefined" && intentsSequence !== null){
    if(Array.isArray(intentsSequence) === false){
      intentsSequence = ["" + intentsSequence];
    }
  }
  else {
    intentsSequence = [];
  }
  if(typeof excludeIntents !== "undefined" && excludeIntents !== null){
    if(Array.isArray(excludeIntents) === false){
      excludeIntents = ["" + excludeIntents];
    }
  }
  else {
    excludeIntents = [];
  }
  let sortedMatchConfig = [];
  // Now create the list to be used for matching
  // First, add all the intents that were part of the intentsSequence, in that
  // order, but exclude any that are also in the excludeIntents.
  for(let currentIntentIndex = 0; currentIntentIndex < intentsSequence.length; currentIntentIndex++){
    let currentIntent = intentsSequence[currentIntentIndex];
    for(let currentUtteranceIndex = 0; currentUtteranceIndex < originalMatchConfig.length; currentUtteranceIndex++){
      let currentMatchConfig = originalMatchConfig[currentUtteranceIndex];
      if(currentMatchConfig.intent === currentIntent){
        // Remove this from the recognizerSet, push it onto sortedMatchConfig
        // (if not being excluded), decrement counter to stay on the same index
        // since we just removed one item.
        originalMatchConfig.splice(currentUtteranceIndex, 1);
        if(excludeIntents.indexOf(currentIntent) < 0){
          sortedMatchConfig.push(currentMatchConfig);
        }
        currentUtteranceIndex--;
      }
    }
  }
  // Now move the remaining match configs to the sorted array but only if they
  // are not part of the excluded intents.
  for(let currentUtteranceIndex = 0; currentUtteranceIndex < originalMatchConfig.length; currentUtteranceIndex++){
    let currentMatchConfig = originalMatchConfig[currentUtteranceIndex];
    originalMatchConfig.splice(currentUtteranceIndex, 1);
    if(excludeIntents.indexOf(currentMatchConfig.intent) < 0){
      sortedMatchConfig.push(currentMatchConfig);
    }
    currentUtteranceIndex--;
  }

  for(let i = 0; i < sortedMatchConfig.length; i++){
    //    console.log("_matchText, 3, i: " + i);
    let scratch = sortedMatchConfig[i];
    //    if(i == 6){
    //      console.log("_matchText, 4, scratch: " + JSON.stringify(scratch, null, 2));
    //      console.log("_matchText, 4.1, scratch.regExpStrings: " + JSON.stringify(scratch.regExpStrings));
    //    }
    if(typeof scratch.regExpStrings !== "undefined" && Array.isArray(scratch.regExpStrings)){
      for(let k = 0; k < scratch.regExpStrings.length; k ++){
        let scratchRegExpString = scratch.regExpStrings[k];
        //        console.log("_matchText, 4.1.0, scratch.regExpString: " + scratchRegExpString);
        let scratchRegExp = new RegExp(scratchRegExpString, "ig");
        if(k === (scratch.regExpStrings.length - 1)){
          // This is the final reg exp
          let matchResult;
          while(matchResult = scratchRegExp.exec(stringToMatch)){ // eslint-disable-line no-cond-assign
            //            console.log("_matchText, 4.1.1, matchResult: ", JSON.stringify(matchResult, null, 2));
            //            for(let j = matchResult.length - 1; j >= 0; j--){
            //              console.log("_matchText, 4.1.1.1, matchResult[" + j + "]: ", matchResult[j]);
            //              if(matchResult[j] === null || typeof matchResult[j] == "undefined"){
            //                console.log("_matchText, 4.1.1.2, matchResult[" + j + "]: ", matchResult[j]);
            //                matchResult.splice(j, 1);
            //              }
            //            }
            //            console.log("_matchText, 4.1.2, matchResult: ", JSON.stringify(matchResult, null, 2));
            multistage: {
              if(matchResult !== null){
                let returnValue = {};
                returnValue.name = scratch.intent;
                returnValue.slots = {};
                for(let j = 1; j < matchResult.length; j++){
                  let processedMatchResult = _processMatchedSlotValueByType(matchResult[j], scratch.slots[j - 1].type, scratch.slots[j - 1].flags, scratch.slots[j - 1].name, scratch.intent, recognizerSet);
                  if(typeof processedMatchResult === "undefined"){
                    // This means a multi-stage match, such as SOUNDEX_MATCH, has failed to match on a follow up stage.
                    // Treat it as a no match
                    break multistage;
                  }
                  returnValue.slots[scratch.slots[j - 1].name] = {"name": scratch.slots[j - 1].name, "value": processedMatchResult};
                }
                // Now call the mix in code before returning
                if(typeof recognizerSet.mixIns !== "undefined" && typeof recognizerSet.mixIns.intents !== "undefined"){
                  let mixIns = recognizerSet.mixIns.intents[scratch.intent];
                  if(typeof mixIns !== "undefined" && Array.isArray(mixIns) === true){
                    for (let j = 0; j < mixIns.length; j++){
                      let mixIn = mixIns[j];
                      if(typeof mixIn !== "undefined" && mixIn !== null){
                        _applyMixIns(path.resolve(mixIn.resolvedFileName), returnValue.name, stringToMatch, returnValue, mixIn.arguments);
                      }
                    }
                  }
                }
                return returnValue;
              }
            }
          }
        }
        // TODO looks like leftover code from refactoring - verify it's not need and remove or expand if still needed.
        else {
          // This is a preliminary reg exp
          let scratchMatchResult = scratchRegExp.test(stringToMatch);
          if(scratchMatchResult){
            // we are good to try the real one.
            //            console.log("_matchText, 4.2, scratchMatchResult: ", JSON.stringify(scratchMatchResult, null, 2));
          }
          else {
            // This is definitely not a match - continue
            //            console.log("_matchText, 4.2.1");
            break;
          }
        }
      }
    }

  }

  // Now try the built in intents
  for(let i = 0; i < recognizerSet.builtInIntents.length; i ++){
    let scratch = recognizerSet.builtInIntents[i];
    if(typeof scratch.regExp === "undefined"){
      scratch.regExp = new RegExp(scratch.regExpString, "ig");
      //      console.log("scratch.regExp: " + scratch.regExp);
      //      scratch.regExp = new RegExp("^\\s*((?:help\\s*|help\\s+me\\s*|can\\s+you\\s+help\\s+me\\s*)+)\\s*[.]?\\s*$", "ig");
    }
    let matchResult;
    scratch.regExp.lastIndex = 0;
    matchResult = scratch.regExp.exec(stringToMatch);
    if(matchResult){
      //      console.log("matchResult: " + JSON.stringify(matchResult));
      let returnValue = {};
      returnValue.name = _getTranslatedIntentForOutput(scratch.name, recognizerSet.platform);
      returnValue.slots = {};
      // Now call the mix in code before returning
      if(typeof recognizerSet.mixIns !== "undefined"  && typeof recognizerSet.mixIns.intents !== "undefined"){
        let mixIns = recognizerSet.mixIns.intents[scratch.name];
        if(typeof mixIns !== "undefined" && Array.isArray(mixIns) === true){
          for (let j = 0; j < mixIns.length; j++){
            let mixIn = mixIns[j];
            if(typeof mixIn !== "undefined" && mixIn !== null){
              _applyMixIns(mixIn.resolvedFileName, returnValue.name, stringToMatch, returnValue, mixIn.arguments);
            }
          }
        }
      }
      return returnValue;
    }
  }
  // If we are here that means we are about to return undefined.  Check for any mix in code that applies to unmatched
  let returnValue;
  if(typeof recognizerSet.mixIns != "undefined" && recognizerSet.mixIns !== null){
    for(let i = 0; i < recognizerSet.mixIns.unmatched.length; i++){
      let mixIn = recognizerSet.mixIns.unmatched[i];
      let scratchReturnValue;
      if(typeof returnValue === "undefined"){
        scratchReturnValue = {};
      }
      else {
        scratchReturnValue = returnValue;
      }
      if(typeof mixIn !== "undefined" && mixIn !== null){
        _applyMixIns(mixIn.resolvedFileName, scratchReturnValue.name, stringToMatch, scratchReturnValue, mixIn.arguments);
      }
      // Check to see if scratchReturnValue has changed.  If so, update returnValue
      if(JSON.stringify(scratchReturnValue) === JSON.stringify({})){
        // Nothing to do
      }
      else {
        returnValue = scratchReturnValue;
      }
    }
  }
  return returnValue;
};

var _applyMixIns = function(mixInFilePath, intent, utterance, returnValue, mixInSpecificArgs){// eslint-disable-line no-unused-vars
  let mixIn = require(path.resolve(mixInFilePath));
  let standardArgs = {"intentName": intent, "utterance": utterance, "priorResult": returnValue};
  mixIn(standardArgs, mixInSpecificArgs);
};

// USED IN MATCH
// NOT IN GENERATE
var _getBuiltInSlotValuesFromRecognizer = function(recognizerSet, builtInSlotType){
  for(let i = 0; i < recognizerSet.builtInSlotTypes.length; i ++){
    if(recognizerSet.builtInSlotTypes[i].name === builtInSlotType){
      return recognizerSet.builtInSlotTypes[i].values;
    }
  }
};

// USED IN MATCH
// NOT IN GENERATE
var _getSlotTransformSrcFilenameFromRecognizer = function(recognizer, intent, slot){
  for(let i = 0; i < recognizer.matchConfig.length; i++){
    if(recognizer.matchConfig[i].intent === intent){
      for(let j = 0; j < recognizer.matchConfig[i].slots.length; j ++){
        if(recognizer.matchConfig[i].slots[j].name === slot){
          return recognizer.matchConfig[i].slots[j].transformSrcFilename;
        }
      }
      return;
    }
  }
};

recognizer.Recognizer = class {
};

recognizer.Recognizer.matchText = _matchText;
recognizer.Recognizer.prototype.matchText = _matchText;

recognizer.Recognizer.matchDomain = _matchTextDomain;
recognizer.Recognizer.prototype.matchDomain = _matchTextDomain;

module.exports = recognizer;
