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
var soundex = require('./soundex.js');
var utilities = require('./utilities.js');
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
  reconstructedRegEx += "\\s*[.?!]?\\s*$";
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
numbersWithAnd.push(",");
recognizer.builtInValues.NUMBER.replacementRegExpString = _makeReplacementRegExpString(numbersWithAnd);
recognizer.builtInValues.NUMBER.replacementRegExp = new RegExp(recognizer.builtInValues.NUMBER.replacementRegExpString, "ig");

recognizer.builtInValues.FOUR_DIGIT_NUMBER = {};
recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString =
  "(" +

    "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){4}" +
    "|" +

    "(?:" +
      "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){2}" +
      "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
    ")" +
    "|" +


    "(?:" +
      "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){1}" +
      "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
      "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9])\\s*){1}" +
    ")" +
    "|" +

    "(?:" +
      "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
      "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9])\\s*){2}" +
    ")" +
    "|" +


    "(?:" +
      "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){2}\\s*" +
    ")" +
    "|" +

    "(?:" +
      "(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*thousand\\s*[,]{0,1}\\s*" +
      "(?:(?:one|two|three|four|five|six|seven|eight|nine|[1-9])\\s*hundred\\s*){0,1}" +
      "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){0,1}\\s*){0,1}\\s*" +
    ")" +


  ")\\s*";
recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExp = new RegExp(recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString, "ig");

recognizer.builtInValues.DATE = require("./builtinslottypes/dates.json");
{
  let fullCalendarDateString1 =
  "(?:January|February|March|April|May|June|July|August|September|October|November|December){0,1}\\s*" +
  "(?:first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|sixth|6th|seventh|7th|eighth|8th|nineth|9th|tenth|10th|" +
  "eleventh|11th|twelfth|12th|thirteenth|13th|fourteenth|14th|fifteenth|15th|sixteenth|16th|seventeenth|17th|eighteenth|18th|nineteenth|19th|twentieth|20th|" +
  "twenty first|21st|twenty second|22nd|thwenty third|23rd|twenty fourth|24th|twenty fifth|25th|twenty sixth|26th|twenty seventh|27th|" +
  "twenty eighth|28th|twenty ningth|29th|thirtieth|30th|thirty first|31st){0,1}\\s*" +
  // Now the year, first as spelled out number, e.g. one thousand nine hundred forty five
  "(?:" +
    "(?:" +
      "(?:one thousand|two thousand){0,1}\\s*(?:(?:one|two|three|four|five|six|seven|eight|nine)\\s*hundred){0,1}\\s*" + "(?:and\\s*){0,1}(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,1}\\s*"+
    ")" +
  // then as two two digit numbers, e.g. nineteen forty five
    "|" +
    "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,2}\\s*" +
    // then as four digits, e.g. 1945
    "|" +
    "(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9])\\s*){4}" +
  ")";
  recognizer.builtInValues.DATE.values.push(fullCalendarDateString1);
}
recognizer.builtInValues.DATE.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.DATE.values);
recognizer.builtInValues.DATE.replacementRegExp = new RegExp(recognizer.builtInValues.DATE.replacementRegExpString, "ig");

recognizer.builtInValues.TIME = require("./builtinslottypes/times.json");
{
  let hourOnlyString =
  "\\s*(?:zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23){1}(?:\\s*o'clock){0,1}\\s*";

  recognizer.builtInValues.TIME.values.push(hourOnlyString);
  let hourAndMinutesString1 =
  "\\s*" +
    "(?:zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23){1}\\s*" +
    "(?:zero zero|zero oh|zero 0|oh oh|oh zero|oh 0|0 zero|0 oh|00|0 0|" +
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
    "(?:o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}" +
  "\\s*";

  recognizer.builtInValues.TIME.values.push(hourAndMinutesString1);

  recognizer.builtInValues.TIME.values.push("(?:\\s*quarter (?:past|after) midnight\\s*)");
  recognizer.builtInValues.TIME.values.push("(?:\\s*half (?:past|after) midnight\\s*)");
  recognizer.builtInValues.TIME.values.push("(?:\\s*quarter (?:to|before) midnight\\s*)");
  recognizer.builtInValues.TIME.values.push("(?:\\s*quarter (?:past|after) noon\\s*)");
  recognizer.builtInValues.TIME.values.push("(?:\\s*half (?:past|after) noon\\s*)");
  recognizer.builtInValues.TIME.values.push("(?:\\s*quarter (?:to|before) noon\\s*)");

  recognizer.builtInValues.TIME.values.push("(?:\\s*quarter (?:past|after) (?:zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23)\\s*(?:o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*)");
  recognizer.builtInValues.TIME.values.push("(?:\\s*quarter (?:to|before) (?:one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24)\\s*(?:o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*)");
  recognizer.builtInValues.TIME.values.push("(?:\\s*half (?:past|after) (?:zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23)\\s*(?:o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*)");

  let hourAndMinutesString2 =
  "\\s*" +
    "(?:one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|" +
      "ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|" +
      "twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24|twenty five|25|twenty six|26|twenty seven|27|twenty eight|28|twenty nine|29" +
      "thirty|30" +
    "){1}\\s*" +
    "(?:past|after|to|before)\\s*" +
    "(?:zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24){1}\\s*" +
    "(?:o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}" +
  "\\s*";
  recognizer.builtInValues.TIME.values.push(hourAndMinutesString2);

  let hourString3 =
  "\\s*" +
    "(?:" +
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
  "\\s*";
  recognizer.builtInValues.TIME.values.push(hourString3);


}
recognizer.builtInValues.TIME.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.TIME.values);
recognizer.builtInValues.TIME.replacementRegExp = new RegExp(recognizer.builtInValues.TIME.replacementRegExpString, "ig");

recognizer.builtInValues.DURATION = {};
recognizer.builtInValues.DURATION.values = [];
{
  let generalDurationString =
  "\\s*" +
    "(?:.+\\s*years{0,1}){0,1}\\s*" +
    "(?:.+\\s*months{0,1}){0,1}\\s*" +
    "(?:.+\\s*weeks{0,1}){0,1}\\s*" +
    "(?:.+\\s*days{0,1}){0,1}\\s*" +
    "(?:.+\\s*hours{0,1}){0,1}\\s*" +
    "(?:.+\\s*minutes{0,1}){0,1}\\s*" +
    "(?:.+\\s*seconds{0,1}){0,1}\\s*" +
  "\\s*";
  recognizer.builtInValues.DURATION.values.push(generalDurationString);
}
recognizer.builtInValues.DURATION.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.DURATION.values);
recognizer.builtInValues.DURATION.replacementRegExp = new RegExp(recognizer.builtInValues.DURATION.replacementRegExpString, "ig");

recognizer.builtInValues.US_STATE = require("./builtinslottypes/usstates.json");
{
  let statesAndTerritories = [];
  let states = [];
  for(let i = 0; i < recognizer.builtInValues.US_STATE.values.length; i ++){
    statesAndTerritories.push(recognizer.builtInValues.US_STATE.values[i].name);
    if(recognizer.builtInValues.US_STATE.values[i].isState){
      states.push(recognizer.builtInValues.US_STATE.values[i].name);
    }
  }
  recognizer.builtInValues.US_STATE.replacementRegExpString = _makeReplacementRegExpString(statesAndTerritories);
  recognizer.builtInValues.US_STATE.replacementStatesOnlyRegExpString = _makeReplacementRegExpString(states);
  recognizer.builtInValues.US_STATE.replacementRegExp = new RegExp(recognizer.builtInValues.US_STATE.replacementRegExpString, "ig");
}

recognizer.builtInValues.US_FIRST_NAME = require("./builtinslottypes/usfirstnames.json");
recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.US_FIRST_NAME.values);
recognizer.builtInValues.US_FIRST_NAME.replacementRegExp = new RegExp(recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString, "ig");

recognizer.builtInValues.Actor = require("./builtinslottypes/actors.json");
recognizer.builtInValues.Actor.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Actor.values);
recognizer.builtInValues.Actor.replacementRegExp = new RegExp(recognizer.builtInValues.Actor.replacementRegExpString, "ig");

recognizer.builtInValues.Artist = require("./builtinslottypes/artists.json");
recognizer.builtInValues.Artist.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Artist.values);
recognizer.builtInValues.Artist.replacementRegExp = new RegExp(recognizer.builtInValues.Artist.replacementRegExpString, "ig");

recognizer.builtInValues.CivicStructure = require("./builtinslottypes/civicstructures.json");
recognizer.builtInValues.CivicStructure.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.CivicStructure.values);
recognizer.builtInValues.CivicStructure.replacementRegExp = new RegExp(recognizer.builtInValues.CivicStructure.replacementRegExpString, "ig");


recognizer.builtInValues.BroadcastChannel = require("./builtinslottypes/broadcastchannels.json");
recognizer.builtInValues.BroadcastChannel.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.BroadcastChannel.values);
recognizer.builtInValues.BroadcastChannel.replacementRegExp = new RegExp(recognizer.builtInValues.BroadcastChannel.replacementRegExpString, "ig");

recognizer.builtInValues.BookSeries = require("./builtinslottypes/bookseries.json");
recognizer.builtInValues.BookSeries.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.BookSeries.values);
recognizer.builtInValues.BookSeries.replacementRegExp = new RegExp(recognizer.builtInValues.BookSeries.replacementRegExpString, "ig");

recognizer.builtInValues.Book = require("./builtinslottypes/books.json");
recognizer.builtInValues.Book.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Book.values);
recognizer.builtInValues.Book.replacementRegExp = new RegExp(recognizer.builtInValues.Book.replacementRegExpString, "ig");

recognizer.builtInValues.Author = require("./builtinslottypes/authors.json");
recognizer.builtInValues.Author.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Author.values);
recognizer.builtInValues.Author.replacementRegExp = new RegExp(recognizer.builtInValues.Author.replacementRegExpString, "ig");


recognizer.builtInValues.Athlete = require("./builtinslottypes/athletes.json");
recognizer.builtInValues.Athlete.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Athlete.values);
recognizer.builtInValues.Athlete.replacementRegExp = new RegExp(recognizer.builtInValues.Athlete.replacementRegExpString, "ig");

recognizer.builtInValues.AdministrativeArea = require("./builtinslottypes/administrativeareas.json");
recognizer.builtInValues.AdministrativeArea.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.AdministrativeArea.values);
recognizer.builtInValues.AdministrativeArea.replacementRegExp = new RegExp(recognizer.builtInValues.AdministrativeArea.replacementRegExpString, "ig");

recognizer.builtInValues.Month = {};
recognizer.builtInValues.Month.values = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
recognizer.builtInValues.Month.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Month.values);
recognizer.builtInValues.Month.replacementRegExp = new RegExp(recognizer.builtInValues.Month.replacementRegExpString, "ig");

recognizer.builtInValues.DayOfWeek = {};
recognizer.builtInValues.DayOfWeek.values = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
recognizer.builtInValues.DayOfWeek.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.DayOfWeek.values);
recognizer.builtInValues.DayOfWeek.replacementRegExp = new RegExp(recognizer.builtInValues.DayOfWeek.replacementRegExpString, "ig");

recognizer.builtInValues.Country = require("./builtinslottypes/countries.json");
recognizer.builtInValues.Country.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Country.values);
recognizer.builtInValues.Country.replacementRegExp = new RegExp(recognizer.builtInValues.Country.replacementRegExpString, "ig");

recognizer.builtInValues.Color = require("./builtinslottypes/colors.json");
recognizer.builtInValues.Color.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Color.values);
recognizer.builtInValues.Color.replacementRegExp = new RegExp(recognizer.builtInValues.Color.replacementRegExpString, "ig");

recognizer.builtInValues.Room = require("./builtinslottypes/rooms.json");
recognizer.builtInValues.Room.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Room.values);
recognizer.builtInValues.Room.replacementRegExp = new RegExp(recognizer.builtInValues.Room.replacementRegExpString, "ig");

var _getReplacementRegExpStringForSlotType = function(slotType, config, slotFlags){
  if(slotType == "AMAZON.NUMBER"){
    // Ignore flags for now
    return recognizer.builtInValues.NUMBER.replacementRegExpString;
  }
  else if(slotType == "AMAZON.FOUR_DIGIT_NUMBER"){
    // Ignore flags for now
    return recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString;
  }
  else if(slotType == "AMAZON.US_STATE"){
    if(slotFlags.indexOf("EXCLUDE_NON_STATES") >= 0){
      // number are used in cases of names like John the 1st
      return recognizer.builtInValues.US_STATE.replacementStatesOnlyRegExpString;
    }
    else {
      return recognizer.builtInValues.US_STATE.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.US_FIRST_NAME"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.Actor"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Actor.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.Artist"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Artist.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.CivicStructure"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.CivicStructure.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.BroadcastChannel"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.BroadcastChannel.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.BookSeries"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.BookSeries.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.Book"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Book.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.Author"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Author.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.Athlete"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Athlete.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.AdministrativeArea"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      // number are used in cases of names like the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.AdministrativeArea.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.DATE"){
    // Ignore flags for now
    return recognizer.builtInValues.DATE.replacementRegExpString;
  }
  else if(slotType == "AMAZON.TIME"){
    // Ignore flags for now
    return recognizer.builtInValues.TIME.replacementRegExpString;
  }
  else if(slotType == "AMAZON.DURATION"){
    // Ignore flags for now
    return recognizer.builtInValues.DURATION.replacementRegExpString;
  }
  else if(slotType == "AMAZON.Month"){
    // Ignore flags for now
    return recognizer.builtInValues.Month.replacementRegExpString;
  }
  else if(slotType == "AMAZON.DayOfWeek"){
    // Ignore flags for now
    return recognizer.builtInValues.DayOfWeek.replacementRegExpString;
  }
  else if(slotType == "AMAZON.Country"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Country.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.Color"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Color.replacementRegExpString;
    }
  }
  else if(slotType == "AMAZON.Room"){
    // Ignore SOUNDEX_MATCH flag for now
    if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
      return "((?:\\w|\\s|[0-9]|')+)";
    }
    else {
      return recognizer.builtInValues.Room.replacementRegExpString;
    }
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
        if(slotFlags.indexOf("SOUNDEX_MATCH") >= 0){
          if(typeof customSlotType.replacementSoundExpRegExp == "undefined"){
            customSlotType.replacementSoundExpRegExp = _makeReplacementRegExpString(customSlotType.soundExValues);
          }
          // Returning wildcard match because the first pass will be on matching on anything, THEN matching on soundex values
          return "((?:\\w|\\s|[0-9])+)";
        }
        else if(slotFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
          // numbers are used in cases of names like John the 1st
          return "((?:\\w|\\s|[0-9])+)";
        }
        else {
          if(typeof customSlotType.replacementRegExp == "undefined"){
            customSlotType.replacementRegExp = _makeReplacementRegExpString(customSlotType.values);
          }
          return customSlotType.replacementRegExp;
        }
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

  value = value.replace(/and/ig, " ");
//  console.log("_processMatchedNumericSlotValue, 1.1, value: " + JSON.stringify(value));

  value = value.split(/\s+/);
  var convertedValues = [];
  for(var i = 0; i < value.length; i ++){
    if(isNaN(value[i]) || typeof value[i] ==  "undefined" || value[i] == null || value[i].trim().length == 0){
      continue;
    }
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
      if(
          ((accummulatedOrderOfMagnitude < currentOrderOfMagnitude) && value[i] == 100) ||
          ((accummulatedOrderOfMagnitude < currentOrderOfMagnitude) && currentOrderOfMagnitude > 2)
        ){
        // The new value's order of magnitune is larger than the entire accummulated
        // value and new value's order of magnitude is at least 2.  This means
        // we multiply them.
        accummulatedStack[accummulatedStack.length - 1] *= value[i];
        lastOrderOfMagnitude = currentOrderOfMagnitude;
        lastValue = value[i];
        // Need to verify that multiplying does not trigger writing earlier value out.
        if(accummulatedStack.length == 2 &&
           (Math.floor(_getOrderOfMagnitude(accummulatedStack[0])/3) < Math.floor(_getOrderOfMagnitude(accummulatedStack[1])/3))){
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
        // when the previous value was a "teen" or ten value and the current one is in
        // single digits, it still should NOT be added, rather it triggers an
        // output of the prior values and starts a new stack.
        // Other than that, if the last OOM was >= 300 - push it, else add it.
        if(lastValue >= 10 && lastValue <= 19){
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
//  value = parseInt(value);
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
var _processMatchedCustomSlotValueByType = function(value, slotType, flags, recognizerSet){
//  console.log("_processMatchedCustomSlotValueByType, 1, value: " + value + ", slotType: " + slotType);
  for(var i = 0; i < recognizerSet.customSlotTypes.length; i++){
    let scratchCustomSlotType = recognizerSet.customSlotTypes[i];
    if(scratchCustomSlotType.name != slotType){
//      console.log("_processMatchedCustomSlotValueByType, 2");
      continue;
    }
//    console.log("_processMatchedCustomSlotValueByType, 3");
    if(flags.indexOf("SOUNDEX_MATCH") >= 0){
      // do regular expression matching
      if(typeof scratchCustomSlotType.soundExRegExps == "undefined"){
        scratchCustomSlotType.soundExRegExps = [];
        for(let j = 0; j < scratchCustomSlotType.soundExRegExpStrings.length; j++){
          scratchCustomSlotType.soundExRegExps.push(new RegExp(scratchCustomSlotType.soundExRegExpStrings[j], "ig"));
        }
      }
      // Now attempt to match.  If successful - return the corresponding value.
      let matchResult;
      let soundexValue = soundex.simple.soundEx(value, " ");

      for(let j = 0; j < scratchCustomSlotType.soundExRegExpStrings.length; j++){
        scratchCustomSlotType.soundExRegExps[j].lastIndex = 0;
        if(matchResult = scratchCustomSlotType.soundExRegExps[j].exec(soundexValue)){
          return scratchCustomSlotType.values[j];
        }
      }
      // If we are here, that means our wildcard pattern didn't match any of the
      // soundex values.  Return undefined to indicate this.
      return;
    }
    else {
      if(typeof scratchCustomSlotType.regExps == "undefined"){
        scratchCustomSlotType.regExps = [];
        for(let j = 0; j < scratchCustomSlotType.regExpStrings.length; j++){
          scratchCustomSlotType.regExps.push(new RegExp(scratchCustomSlotType.regExpStrings[j], "ig"));
        }
      }
      // Now attempt to match.  If successful - return the corresponding value.
      let matchResult;
      for(let j = 0; j < scratchCustomSlotType.regExps.length; j++){
        scratchCustomSlotType.regExps[j].lastIndex = 0;
        if(matchResult = scratchCustomSlotType.regExps[j].exec(value)){
          return scratchCustomSlotType.values[j];
        }
      }
    }
  }

  // If there is no match, then return the original value
  return value;
}

var _processMatchedTimeSlotValue = function(value){
//  console.log("_processMatchedTimeSlotValue, 1");
  var matchResult;
  var regExp = /(^\s*noon\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "12:00";
  }
  regExp = /(^\s*midnight\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "00:00";
  }
  regExp = /(^\s*(?:this\s*){0,1}morning\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "MO";
  }
  regExp = /(^\s*(?:this\s*){0,1}night\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "NI";
  }
  regExp = /(^\s*(?:this\s*){0,1}after\s*noon\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "AF";
  }
  regExp = /(^\s*(?:this\s*){0,1}evening\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "EV";
  }

  let hourOnlyString =
  "^\\s*(zero|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23){1}(?:\\s*o'clock){0,1}\\s*$";

  regExp = new RegExp(hourOnlyString, "ig");
  if(matchResult = regExp.exec(value)){
//    console.log("matching time, just the hour, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    if(typeof hour == "undefined" || hour == null || hour.length == 0){
      // Didn't actually match a real value.
    }
    else {
      hour = _processMatchedNumericSlotValue(hour);
      return "" + _twoDigitFormatter(hour) + ":00";
    }
  }

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
  if(matchResult = regExp.exec(value)){
//    console.log("matching time, hour and minutes, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    let minutes = matchResult[2];
    let specifier = matchResult[3];
    if(typeof hour == "undefined" || hour == null || hour.length == 0 || typeof minutes == "undefined" || minutes == null || minutes.length == 0 ){
      // Didn't actually match a real value.
    }
    else {
      hour = _processMatchedNumericSlotValue(hour);
      minutes = _processMatchedNumericSlotValue(minutes);
      let numericHour = parseInt(hour);
      if(specifier == "am" || specifier == "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier == "pm" || specifier == "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier == "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier == "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier == "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour == 12){
          numericHour = 0;
        }
      }
      return "" + _twoDigitFormatter(numericHour) + ":" + _twoDigitFormatter(minutes);
    }
  }

  regExp = /(^\s*quarter (?:past|after) midnight\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "00:15";
  }
  regExp = /(^\s*half (?:past|after) midnight\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "00:30";
  }
  regExp = /(^\s*quarter (?:to|before) midnight\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "23:45";
  }



  regExp = /(^\s*quarter (?:past|after) noon\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "12:15";
  }
  regExp = /(^\s*half (?:past|after) noon\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "12:30";
  }
  regExp = /(^\s*quarter (?:to|before) noon\s*$)/ig
  if(matchResult = regExp.exec(value)){
    return "11:45";
  }

  let quarterPastHour1 = "^\\s*(?:quarter (?:past|after) (zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23)\\s*(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*$)";

  regExp = new RegExp(quarterPastHour1, "ig");
  if(matchResult = regExp.exec(value)){
//    console.log("matching quarter after hour, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    let specifier = matchResult[2];
    hour = _processMatchedNumericSlotValue(hour);
    let numericHour = parseInt(hour);
    if(typeof hour == "undefined" || hour == null || hour.length == 0){
      // Didn't actually match a real value.
    }
    else {
      if(specifier == "am" || specifier == "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier == "pm" || specifier == "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier == "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier == "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier == "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour == 12){
          numericHour = 0;
        }
      }
//      console.log("quarter past, hour: " + numericHour);
      return "" + _twoDigitFormatter(numericHour) + ":15";
    }
  }

  let halfPastHour1 = "^\\s*(?:half (?:past|after) (zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23)\\s*(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*$)";

  regExp = new RegExp(halfPastHour1, "ig");
  if(matchResult = regExp.exec(value)){
//    console.log("matching half after hour, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    let specifier = matchResult[2];
    hour = _processMatchedNumericSlotValue(hour);
    let numericHour = parseInt(hour);
    if(typeof hour == "undefined" || hour == null || hour.length == 0){
      // Didn't actually match a real value.
    }
    else {
      if(specifier == "am" || specifier == "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier == "pm" || specifier == "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier == "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier == "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier == "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour == 12){
          numericHour = 0;
        }
      }

      return "" + _twoDigitFormatter(numericHour) + ":30";
    }
  }

  let quarterToHour1 = "^\\s*(?:quarter (?:to|before) (one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23|twenty four|24)\\s*(o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*$)";

  regExp = new RegExp(quarterToHour1, "ig");
  if(matchResult = regExp.exec(value)){
//    console.log("matching quarter to hour, matchResult: " + JSON.stringify(matchResult));
    let hour = matchResult[1];
    hour = _processMatchedNumericSlotValue(hour);

    let specifier = matchResult[2];
    if(typeof hour == "undefined" || hour == null || hour.length == 0){
      // Didn't actually match a real value.
    }
    else {
      hour = _processMatchedNumericSlotValue(hour);
      let numericHour = parseInt(hour);
      if(specifier == "am" || specifier == "a.m."){
        // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
      }
      else if(specifier == "pm" || specifier == "p.m."){
        if(numericHour < 12){
          numericHour += 12;
        }
      }
      else if(specifier == "in the afternoon"){
        if(numericHour >= 1 && numericHour <= 6){
          numericHour += 12;
        }
      }
      else if(specifier == "in the evening"){
        if(numericHour >= 5 && numericHour <= 9){
          numericHour += 12;
        }
      }
      else if(specifier == "at night"){
        if(numericHour >= 6 && numericHour <= 11){
          numericHour += 12;
        }
        else if(numericHour == 12){
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
  if(matchResult = regExp.exec(value)){
//    console.log("matching time, hour and minutes, matchResult: " + JSON.stringify(matchResult));
    let minutes = matchResult[1];
    let hour = matchResult[3];
    let beforeAfter = matchResult[2];
    let specifier = matchResult[4];
    hour = _processMatchedNumericSlotValue(hour);
    minutes = _processMatchedNumericSlotValue(minutes);
//      console.log("matching time, hour and minutes, specifier: " + specifier);
    let numericHour = parseInt(hour);
    if(specifier == "am" || specifier == "a.m."){
      // Nothing to do really.  Either we have an hour that's < 12 or the use misspoke but we can't correct it.
    }
    else if(specifier == "pm" || specifier == "p.m."){
      if(numericHour < 12){
        numericHour += 12;
        hour = "" + numericHour;
      }
    }
    else if(specifier == "in the morning"){
      // Nothing to do really.  Either we have an hour that's < 12 or the user misspoke but we can't correct it.
    }
    else if(specifier == "in the afternoon"){
      if(numericHour >= 1 && numericHour <= 6){
        numericHour += 12;
        hour = "" + numericHour;
      }
      else {
        // Nothing to do really.  The user misspoke but we can't correct it.
      }
    }
    else if(specifier == "in the evening"){
      if(numericHour >= 5 && numericHour <= 9){
        numericHour += 12;
        hour = "" + numericHour;
      }
      else {
        // Nothing to do really.  The user misspoke but we can't correct it.
      }
    }
    else if(specifier == "at night"){
      if(numericHour >= 6 && numericHour <= 11){
        numericHour += 12;
        hour = "" + numericHour;
      }
      else if(numericHour == 12){
        numericHour = 0;
        hour = "" + numericHour;
      }
      else {
        // Nothing to do really.  The user misspoke but we can't correct it.
      }
    }

    if(beforeAfter == "after" || beforeAfter == "past"){
      // Add minutes to hours.
      if(numericHour == 24){
        numericHour = 0;
        hour = "0";
      }
      return _twoDigitFormatter(numericHour) + ":" + _twoDigitFormatter(minutes)
    }
    else {
      // Subtract minutes from hour, a.k.a. add minutes + 30 to the previous hour
      if(numericHour == 0){
        numericHour = 23;
        hour = "23";
      }
      else {
        numericHour --;
        hour = "" + numericHour;
      }
      let numericMinute = parseInt(minutes);
      numericMinute = (60 - numericMinute);
      return _twoDigitFormatter(numericHour) + ":" + _twoDigitFormatter(numericMinute)
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
  if(matchResult = regExp.exec(value)){
  //    console.log("matching time, hour and minutes, matchResult: " + JSON.stringify(matchResult));
    let time = matchResult[1];
    time = _processMatchedNumericSlotValue(time);
    let numericTime = parseInt(time);
    return _twoDigitFormatter(numericTime/100) + ":00";
  }

  return;
}

var _processMatchedDurationSlotValue = function(value){
  var matchResult;
  let generalDurationString =
  "^\\s*" +
    "(" +
       "(?:and|zero|oh|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|\\s|[0-9,])+" +
       "\\s*(?:years{0,1}|months{0,1}|weeks{0,1}|days{0,1}|hours{0,1}|minutes{0,1}|seconds{0,1})" +
    ")+\\s*" +
  "\\s*$";


  var regExp = new RegExp(generalDurationString, "ig");
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
      let scratchSubValue = matchResult[1].replace(/years{0,1}/, "");
      years = _processMatchedNumericSlotValue(scratchSubValue);
      years = parseInt(years);
      if(years == 0){
        years == undefined;
      }
      else {
        years = "" + years;
        gotDuration = true;
      }
//      console.log("years: " + years);
    }
    else if(/month/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/months{0,1}/, "");
      months = _processMatchedNumericSlotValue(scratchSubValue);
      months = parseInt(months);
      if(months == 0){
        months == undefined;
      }
      else {
        months = "" + months;
        gotDuration = true;
      }
//      console.log("months: " + months);
    }
    else if(/week/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/weeks{0,1}/, "");
      weeks = _processMatchedNumericSlotValue(scratchSubValue);
      weeks = parseInt(weeks);
      if(weeks == 0){
        weeks == undefined;
      }
      else {
        weeks = "" + weeks;
        gotDuration = true;
      }
//      console.log("weeks: " + weeks);
    }
    else if(/day/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/days{0,1}/, "");
      days = _processMatchedNumericSlotValue(scratchSubValue);
      days = parseInt(days);
      if(days == 0){
        days == undefined;
      }
      else {
        days = "" + days;
        gotDuration = true;
      }
//      console.log("days: " + days);
    }
    else if(/hour/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/hours{0,1}/, "");
      hours = _processMatchedNumericSlotValue(scratchSubValue);
      hours = parseInt(hours);
      if(hours == 0){
        hours == undefined;
      }
      else {
        hours = "" + hours;
        gotDuration = true;
        gotTimePortion = true;
      }
//      console.log("hours: " + hours);
    }
    else if(/minute/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/minutes{0,1}/, "");
      minutes = _processMatchedNumericSlotValue(scratchSubValue);
      minutes = parseInt(minutes);
      if(minutes == 0){
        minutes == undefined;
      }
      else {
        minutes = "" + minutes;
        gotDuration = true;
        gotTimePortion = true;
      }
//      console.log("minutes: " + minutes);
    }
    else if(/second/ig.exec(matchResult[1])){
      let scratchSubValue = matchResult[1].replace(/seconds{0,1}/, "");
      seconds = _processMatchedNumericSlotValue(scratchSubValue);
      seconds = parseInt(seconds);
      if(seconds == 0){
        seconds == undefined;
      }
      else {
        seconds = "" + seconds;
        gotDuration = true;
        gotTimePortion = true;
      }
//      console.log("seconds: " + seconds);
    }
    regExp.lastIndex = 0;
    matchResult = regExp.exec(remainingValue)
  }
  if(gotDuration){
    let returnValue = "P";
    if(typeof years != "undefined"){
      returnValue += (years + "Y");
    }
    if(typeof months != "undefined"){
      returnValue += (months + "M");
    }
    if(typeof weeks != "undefined"){
      returnValue += (weeks + "W");
    }
    if(typeof days != "undefined"){
      returnValue += (days + "D");
    }
    if(gotTimePortion){
      returnValue += "T";
      if(typeof hours != "undefined"){
        returnValue += (hours + "H");
      }
      if(typeof minutes != "undefined"){
        returnValue += (minutes + "M");
      }
      if(typeof seconds != "undefined"){
        returnValue += (seconds + "S");
      }
    }
    return returnValue;
  }

  return;
}

var _processMatchedDateSlotValue = function(value, flags){
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

  let fullCalendarDateString1 =
  "^(January|February|March|April|May|June|July|August|September|October|November|December){0,1}\\s*" +
  "(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|sixth|6th|seventh|7th|eighth|8th|nineth|9th|tenth|10th|" +
  "eleventh|11th|twelfth|12th|thirteenth|13th|fourteenth|14th|fifteenth|15th|sixteenth|16th|seventeenth|17th|eighteenth|18th|nineteenth|19th|twentieth|20th|" +
  "twenty first|21st|twenty second|22nd|thwenty third|23rd|twenty fourth|24th|twenty fifth|25th|twenty sixth|26th|twenty seventh|27th|" +
  "twenty eighth|28th|twenty ningth|29th|thirtieth|30th|thirty first|31st){0,1}\\s*" +
/*
  "(one|first|1st|two|second|2nd|three|third|3rd|four|fourth|4th|five|fifth|5th|six|sixth|6th|seven|seventh|7th|eight|eighth|8th|nine|nineth|9th|ten|tenth|10th|" +
  "eleven|eleventh|11th|twelve|twelfth|12th|thirteen|thirteenth|13th|fourteen|fourteenth|14th|fifteen|fifteenth|15th|sixteen|sixteenth|16th|seventeen|seventeenth|17th|eighteen|eighteenth|18th|nineteen|nineteenth|19th|twenty|twentieth|20th|" +
  "twenty one|twenty first|21st|twenty two|twenty second|22nd|twenty three|thwenty third|23rd|twenty four|twenty fourth|24th|twenty five|twenty fifth|25th|twenty six|twenty sixth|26th|twenty seven|twenty seventh|27th|" +
  "twenty eight|twenty eighth|28th|twenty nine|twenty ningth|29th|thirty|thirtieth|30th|thirty one|thirty first|31st){1}\\s*" +
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
  if(matchResult = regExp.exec(value)){
    let month = matchResult[1];
    let dayOfMonth = matchResult[2];
    let year = matchResult[3];
    let monthNotSpecified = false;

    if(typeof month == "undefined" || month == null || month.trim().length == 0){
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
    if(typeof dayOfMonth == "undefined" || dayOfMonth == null || dayOfMonth.trim().length == 0){
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
    if(typeof year == "undefined" || year == null || year.length == 0){
      yearNotSpecified = true;
    }
    else {
      year = _processMatchedNumericSlotValue(year);
    }
    if(monthNotSpecified == false && dayOfMonthNotSpecified == false && yearNotSpecified == false){
      return "" + _fourDigitFormatter(year) + "-" + _twoDigitFormatter(month) + "-" + _twoDigitFormatter(dayOfMonth);
    }
    if(monthNotSpecified == false && dayOfMonthNotSpecified == true && yearNotSpecified == false){
      // Return just a year and month
      return "" + _fourDigitFormatter(year) + "-" + _twoDigitFormatter(month);
    }
    if(monthNotSpecified == true && dayOfMonthNotSpecified == true && yearNotSpecified == false){
      // Return just a year
      // Test for EXCLUDE_YEAR_ONLY_DATES flag - if there, return undefined;
      if(flags.indexOf("EXCLUDE_YEAR_ONLY_DATES") >= 0){
        return;
      }
      return "" + _fourDigitFormatter(year);
    }
    if(monthNotSpecified == false && dayOfMonthNotSpecified == false && yearNotSpecified == true){
      // Get the closest in the future year and return the full date
      let today = new Date();
      year = today.getFullYear();
      if(today.getMonth() + 1 > month || (today.getMonth() + 1 == month && (today.getDate() > dayOfMonth))){
        year++;
      }
      return "" + _fourDigitFormatter(year) + "-" + _twoDigitFormatter(month) + "-" + _twoDigitFormatter(dayOfMonth);
    }
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

var _processMatchedSlotValueByType = function(value, slotType, flags, slot, intent, recognizerSet){
//  console.log("_processMatchedSlotValueByType, 1, slotType: " + slotType + ", value: " + value);
  let returnValue = value;
  if(slotType == "AMAZON.NUMBER" || slotType == "AMAZON.FOUR_DIGIT_NUMBER"){
    returnValue = _processMatchedNumericSlotValue(value);
  }
  else if(slotType == "AMAZON.DATE"){
    returnValue =  _processMatchedDateSlotValue(value, flags);
  }
  else if(slotType == "AMAZON.TIME"){
    returnValue =  _processMatchedTimeSlotValue(value);
  }
  else if(slotType == "AMAZON.DURATION"){
    returnValue =  _processMatchedDurationSlotValue(value);
  }
  else if(slotType.startsWith("AMAZON.")){
    // already did returnValue = value;
    // Now need to match the capitalization
    if(slotType == "AMAZON.Color"){
      let arrayToSearch = recognizer.builtInValues.Color.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    if(slotType == "AMAZON.Country"){
      let arrayToSearch = recognizer.builtInValues.Country.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.US_FIRST_NAME"){
      let arrayToSearch = recognizer.builtInValues.US_FIRST_NAME.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.Actor"){
      let arrayToSearch = recognizer.builtInValues.Actor.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.Artist"){
      let arrayToSearch = recognizer.builtInValues.Artist.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.CivicStructure"){
      let arrayToSearch = recognizer.builtInValues.CivicStructure.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.BroadcastChannel"){
      let arrayToSearch = recognizer.builtInValues.BroadcastChannel.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.BookSeries"){
      let arrayToSearch = recognizer.builtInValues.BookSeries.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.Book"){
      let arrayToSearch = recognizer.builtInValues.Book.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.Author"){
      let arrayToSearch = recognizer.builtInValues.Author.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.Athlete"){
      let arrayToSearch = recognizer.builtInValues.Athlete.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.AdministrativeArea"){
      let arrayToSearch = recognizer.builtInValues.AdministrativeArea.values;
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < arrayToSearch.length; i++){
        if(scratchValue == arrayToSearch[i].toUpperCase()){
          returnValue = arrayToSearch[i];
          break;
        }
      }
    }
    else if(slotType == "AMAZON.US_STATE"){
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < recognizer.builtInValues.US_STATE.values.length; i ++){
        if(recognizer.builtInValues.US_STATE.values[i].name.toUpperCase()){
          returnValue = recognizer.builtInValues.US_STATE.values[i].name;
          break;
        }
      }
    }
    /*
    for(let i = 0; i < recognizer.builtInValues.US_STATE.values.length; i ++){
      statesAndTerritories.push(recognizer.builtInValues.US_STATE.values[i].name);
      if(recognizer.builtInValues.US_STATE.values[i].isState){
        states.push(recognizer.builtInValues.US_STATE.values[i].name);
      }
    }

    */
    else {
      // All other built in list values use lower case only
      returnValue = returnValue.toLowerCase();
    }
  }
  else {
    // Here we are dealing with a custom slot value
    returnValue =  _processMatchedCustomSlotValueByType(value, slotType, flags, recognizerSet);
  }
  let transformFilename = _getSlotTransformSrcFilenameFromRecognizer(recognizerSet, intent, slot);
  if(typeof transformFilename != "undefined"){
    try {
      let transform = require(transformFilename);
      returnValue = transform(value, intent, slot);
    }
    catch(e){
    }
  }
  return returnValue;
}

var _matchText = function(stringToMatch, intentsSequence, excludeIntents){
  // First, correct some of Microsoft's "deviations"
  // look for a $ followed by a number and replace it with the number followed by the word "dollars".
  let regExpString = "(\\$\\s*(?:\\s*";
  for(let i = 0; i < recognizer.builtInValues.NUMBER.values.length; i++){
    regExpString += "|" + recognizer.builtInValues.NUMBER.values[i];
  }
  regExpString += "|,"

  regExpString +=    ")+)"
  let regExp = new RegExp(regExpString, "ig");
  let regExpNonGlobal = new RegExp(regExpString, "i");
  let dollarMatchResult;
  while(dollarMatchResult = regExp.exec(stringToMatch)){
//    console.log("dollarMatchResult: " + JSON.stringify(dollarMatchResult));
    if(dollarMatchResult == null){
      continue;
    }
    let dollarlessMatch = dollarMatchResult[0].substring(1);
//    console.log("dollarlessMatch: " + JSON.stringify(dollarlessMatch));
    regExpNonGlobal.lastIndex = 0;
    stringToMatch = stringToMatch.replace(regExpNonGlobal, dollarlessMatch + " dollars ");
//    console.log("stringToMatch: " + JSON.stringify(stringToMatch));
    regExp.lastIndex = 0;
  }
  // Now replace all ordinal digits with cardinal numbers
/*
  regExp = /([0-9]*(?:1st|2nd|3rd|[0456789]th))/ig
  let ordinalMatch;
  if(ordinalMatch = regExp.exec(stringToMatch)){
    console.log("ordinalMatch: " + JSON.stringify(ordinalMatch));
  }
*/
  // Now separate all leading zeros so that they don't get lost later in the parsing.
  regExp = /(^0[0-9])/;
  let leadingZeroMatchResult;
  if(leadingZeroMatchResult = regExp.exec(stringToMatch)){
    if(leadingZeroMatchResult != null){
      let replacementString = "0 " + leadingZeroMatchResult[0].substring(1);
      stringToMatch = stringToMatch.replace(/(^0[0-9])/, replacementString);
      regExp.lastIndex = 0;
    }
  }

  regExp = /([^0-9]0[0-9])/ig;
  while(leadingZeroMatchResult = regExp.exec(stringToMatch)){
    if(leadingZeroMatchResult == null){
      continue;
    }
    let replacementString = leadingZeroMatchResult[0].substring(0, 1) + "0 " + leadingZeroMatchResult[0].substring(2);
    stringToMatch = stringToMatch.replace(/([^0-9]0[0-9])/, replacementString);
    regExp.lastIndex = 0;
  }

//  console.log("_matchText, 1");
  var recognizerSet;
  if (fs.existsSync("./recognizer.json")) {
//    console.log("_matchText, 1.1");
    recognizerSet = require("./recognizer.json");
  }
  else if (fs.existsSync("../../recognizer.json")){
//    console.log("_matchText, 1.2");
    recognizerSet = require("../../recognizer.json");
  }
  if(typeof recognizerSet == "undefined"){
    throw {"error": recognizer.errorCodes.MISSING_RECOGNIZER, "message": "Unable to load recognizer.json"};
  }
//  console.log("_matchText, 2, recognizerSet: " + JSON.stringify(recognizerSet));
  let originalMatchConfig = [].concat(recognizerSet.matchConfig);

  if(typeof intentsSequence != "undefined" && intentsSequence != null){
    if(Array.isArray(intentsSequence) == false){
      intentsSequence = ["" + intentsSequence];
    }
  }
  else {
    intentsSequence = [];
  }
  if(typeof excludeIntents != "undefined" && excludeIntents != null){
    if(Array.isArray(excludeIntents) == false){
      excludeIntents = ["" + excludeIntents];
    }
  }
  else {
    excludeIntents = [];
  }
  var sortedMatchConfig = [];
  // Now create the list to be used for matching
  // First, add all the intents that were part of the intentsSequence, in that
  // order, but exclude any that are also in the excludeIntents.
  for(let currentIntentIndex = 0; currentIntentIndex < intentsSequence.length; currentIntentIndex++){
    let currentIntent = intentsSequence[currentIntentIndex];
    for(let currentUtteranceIndex = 0; currentUtteranceIndex < originalMatchConfig.length; currentUtteranceIndex++){
      let currentMatchConfig = originalMatchConfig[currentUtteranceIndex];
      if(currentMatchConfig.intent == currentIntent){
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

  for(var i = 0; i < sortedMatchConfig.length; i++){
//    console.log("_matchText, 3, i: " + i);
    var scratch = sortedMatchConfig[i];
//    console.log("_matchText, 4, scratch: " + JSON.stringify(scratch, null, 2));
//    console.log("_matchText, 4.1, scratch.regExString: " + JSON.stringify(scratch.regExString));
    // First try the wildcard reg exp if it's there  wildcardRegExString
    if(typeof scratch.wildcardRegExString != "undefined"){
//      console.log("_matchText, 4.0.1");
      let wildcardRegExp = new RegExp(scratch.wildcardRegExString, "ig");
//      console.log("_matchText, 4.0.2, wildcardRegExp: ", wildcardRegExp);
      let wildcardMatchResult = wildcardRegExp.test(stringToMatch);
      if(wildcardMatchResult){
        // we are good to try the real one.
//        console.log("_matchText, 4.0.3, potential match, wildcardRegExp: ", wildcardRegExp);
      }
      else {
        // This is definitely not a match - continue
//        console.log("_matchText, 4.0.4, NOT a potential match, wildcardRegExp: ", wildcardRegExp);
        continue;
      }
    }
    else {
      // No wildcardRegExString, so proceed straight to the actual match.
//      console.log("_matchText, 4.0.5, NO wildcardRegExString");
    }
//    console.log("_matchText, 4.0.6, stringToMatch: " + stringToMatch);

    var scratchRegExp = new RegExp(scratch.regExString, "ig");
//    console.log("_matchText, 4.2, scratchRegExp: " + scratchRegExp);
    var matchResult;
    var slotValues = [];
//    console.log("_matchText, 4.3, stringToMatch: " + stringToMatch);
    while(matchResult = scratchRegExp.exec(stringToMatch)){
//      console.log("_matchText, 5, matchResult: " + JSON.stringify(matchResult));
      multistage: {
        if(matchResult != null){
//          console.log("FOUND A MATCH: " + JSON.stringify(matchResult));
//          console.log(JSON.stringify(scratch, null, 2));
          var returnValue = {};
          returnValue.name = scratch.intent;
          returnValue.slots = {};
          for(var j = 1; j < matchResult.length; j++){
            var processedMatchResult = _processMatchedSlotValueByType(matchResult[j], scratch.slots[j - 1].type, scratch.slots[j - 1].flags, scratch.slots[j - 1].name, scratch.intent, recognizerSet);
//            console.log("processedMatchResult: " + processedMatchResult);
            if(typeof processedMatchResult == "undefined"){
              // This means a multi-stage match, such as SOUNDEX_MATCH, has failed to match on a follow up stage.
              // Treat it as a no match
//              console.log("multi-state mismatch");
              break multistage;
            }
//            console.log("multi-state match");
            returnValue.slots[scratch.slots[j - 1].name] = {"name": scratch.slots[j - 1].name, "value": processedMatchResult};
          }
          return returnValue;
        }
      }
    }
  }

  // Now try the built in intents
  for(var i = 0; i < recognizerSet.builtInIntents.length; i ++){
    let scratch = recognizerSet.builtInIntents[i];
    if(typeof scratch.regExp == "undefined"){
      scratch.regExp = new RegExp(scratch.regExpString, "ig");
//      console.log("scratch.regExp: " + scratch.regExp);
//      scratch.regExp = new RegExp("^\\s*((?:help\\s*|help\\s+me\\s*|can\\s+you\\s+help\\s+me\\s*)+)\\s*[.]?\\s*$", "ig");
    }
    let matchResult;
    scratch.regExp.lastIndex = 0;
    if(matchResult = scratch.regExp.exec(stringToMatch)){
//      console.log("matchResult: " + JSON.stringify(matchResult));
      var returnValue = {};
      returnValue.name = scratch.name;
      returnValue.slots = {};
      return returnValue;
    }
  }

};

var _generateRunTimeJson = function(config, intents, utterances){
//  console.log("_generateRunTimeJson, config: ", JSON.stringify(config));
//  console.log("_generateRunTimeJson, intents: ", JSON.stringify(intents));
//  console.log("_generateRunTimeJson, utterances: ", JSON.stringify(utterances));
  // First, extend the built in slot values with values from config
  let slotConfig = _getBuiltInSlotConfig(config, "AMAZON.US_FIRST_NAME");
  let extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.US_FIRST_NAME.values = recognizer.builtInValues.US_FIRST_NAME.values.concat(extendedValues);
  }
  recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.US_FIRST_NAME.values);
  recognizer.builtInValues.US_FIRST_NAME.replacementRegExp = new RegExp(recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString, "ig");
  if(typeof slotConfig != "undefined" && slotConfig != null){
    recognizer.builtInValues.US_FIRST_NAME.transformSrcFilename = slotConfig.transformSrcFilename;
  }

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Actor");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.Actor.values = recognizer.builtInValues.Actor.values.concat(extendedValues);
  }
  recognizer.builtInValues.Actor.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Actor.values);
  recognizer.builtInValues.Actor.replacementRegExp = new RegExp(recognizer.builtInValues.Actor.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Artist");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.Artist.values = recognizer.builtInValues.Artist.values.concat(extendedValues);
  }
  recognizer.builtInValues.Artist.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Artist.values);
  recognizer.builtInValues.Artist.replacementRegExp = new RegExp(recognizer.builtInValues.Artist.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.CivicStructure");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.CivicStructure.values = recognizer.builtInValues.CivicStructure.values.concat(extendedValues);
  }
  recognizer.builtInValues.CivicStructure.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.CivicStructure.values);
  recognizer.builtInValues.CivicStructure.replacementRegExp = new RegExp(recognizer.builtInValues.CivicStructure.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.BroadcastChannel");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.BroadcastChannel.values = recognizer.builtInValues.BroadcastChannel.values.concat(extendedValues);
  }
  recognizer.builtInValues.BroadcastChannel.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.BroadcastChannel.values);
  recognizer.builtInValues.BroadcastChannel.replacementRegExp = new RegExp(recognizer.builtInValues.BroadcastChannel.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.BookSeries");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.BookSeries.values = recognizer.builtInValues.BookSeries.values.concat(extendedValues);
  }
  recognizer.builtInValues.BookSeries.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.BookSeries.values);
  recognizer.builtInValues.BookSeries.replacementRegExp = new RegExp(recognizer.builtInValues.BookSeries.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Book");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.Book.values = recognizer.builtInValues.Book.values.concat(extendedValues);
  }
  recognizer.builtInValues.Book.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Book.values);
  recognizer.builtInValues.Book.replacementRegExp = new RegExp(recognizer.builtInValues.Book.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Author");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.Author.values = recognizer.builtInValues.Author.values.concat(extendedValues);
  }
  recognizer.builtInValues.Author.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Author.values);
  recognizer.builtInValues.Author.replacementRegExp = new RegExp(recognizer.builtInValues.Author.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Athlete");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.Athlete.values = recognizer.builtInValues.Athlete.values.concat(extendedValues);
  }
  recognizer.builtInValues.Athlete.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Athlete.values);
  recognizer.builtInValues.Athlete.replacementRegExp = new RegExp(recognizer.builtInValues.Athlete.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.AdministrativeArea");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.AdministrativeArea.values = recognizer.builtInValues.AdministrativeArea.values.concat(extendedValues);
  }
  recognizer.builtInValues.AdministrativeArea.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.AdministrativeArea.values);
  recognizer.builtInValues.AdministrativeArea.replacementRegExp = new RegExp(recognizer.builtInValues.AdministrativeArea.replacementRegExpString, "ig");


  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Room");
  extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
  if(typeof extendedValues != "undefined"){
    recognizer.builtInValues.Room.values = recognizer.builtInValues.Room.values.concat(extendedValues);
  }
  recognizer.builtInValues.Room.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Room.values);
  recognizer.builtInValues.Room.replacementRegExp = new RegExp(recognizer.builtInValues.Room.replacementRegExpString, "ig");

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.US_STATE");
  if(typeof slotConfig != "undefined" && slotConfig != null){
    recognizer.builtInValues.US_STATE.transformSrcFilename = slotConfig.transformSrcFilename;
  }

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Country");
  if(typeof slotConfig != "undefined" && slotConfig != null){
    recognizer.builtInValues.Country.transformSrcFilename = slotConfig.transformSrcFilename;
  }

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Color");
  if(typeof slotConfig != "undefined" && slotConfig != null){
    recognizer.builtInValues.Color.transformSrcFilename = slotConfig.transformSrcFilename;
  }

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Room");
  if(typeof slotConfig != "undefined" && slotConfig != null){
    recognizer.builtInValues.Room.transformSrcFilename = slotConfig.transformSrcFilename;
  }

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.Month");
  if(typeof slotConfig != "undefined" && slotConfig != null){
    recognizer.builtInValues.Month.transformSrcFilename = slotConfig.transformSrcFilename;
  }

  slotConfig = _getBuiltInSlotConfig(config, "AMAZON.DayOfWeek");
  if(typeof slotConfig != "undefined" && slotConfig != null){
    recognizer.builtInValues.DayOfWeek.transformSrcFilename = slotConfig.transformSrcFilename;
  }

  var recognizerSet = {};
  if(typeof config != "undefined" && typeof config.customSlotTypes != "undefined"){
    recognizerSet.customSlotTypes = config.customSlotTypes;
    // Iterate over all the values and create a corresponding array of match
    // regular expressions so that the exact value is returned rather than what
    // was passed in, say from Cortana.  This is needed because Alexa respects
    // capitalization, etc, while Cortana gratuitously capitalizes first letters
    // and adds periods and other punctuations at the end.
    for(var i = 0; i < recognizerSet.customSlotTypes.length; i++){
      let scratchCustomSlotType = recognizerSet.customSlotTypes[i];
      scratchCustomSlotType.regExpStrings = [];
      for(var j = 0; j < scratchCustomSlotType.values.length; j++){
        scratchCustomSlotType.regExpStrings.push("(?:^\\s*(" +  scratchCustomSlotType.values[j] + ")\\s*$){1}");
      }
    }
    // Now generate soundex equivalents so that we can match on soundex if the
    // regular match fails
    for(var i = 0; i < recognizerSet.customSlotTypes.length; i++){
      let scratchCustomSlotType = recognizerSet.customSlotTypes[i];
      scratchCustomSlotType.soundExValues = [];
      scratchCustomSlotType.soundExRegExpStrings = [];
      for(var j = 0; j < scratchCustomSlotType.values.length; j++){
        let soundexValue = soundex.simple.soundEx(scratchCustomSlotType.values[j], " ");
        scratchCustomSlotType.soundExValues.push(soundexValue);
        let soundexRegExpString = soundex.simple.soundEx(scratchCustomSlotType.values[j], "\\s+");
        scratchCustomSlotType.soundExRegExpStrings.push("(?:^\\s*(" +  soundexRegExpString + ")\\s*){1}");
      }
    }
  }
  recognizerSet.matchConfig = [];
  let allowedSlotFlags = ["INCLUDE_VALUES_MATCH", "EXCLUDE_VALUES_MATCH", "INCLUDE_WILDCARD_MATCH", "EXCLUDE_WILDCARD_MATCH", "SOUNDEX_MATCH", "EXCLUDE_YEAR_ONLY_DATES", "EXCLUDE_NON_STATES"];
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
    var slotRegExp = /\{(\w+)(?:[:]{1}((?:\s*[A-Z_]\s*,{0,1}\s*)+)+)*\}/ig;
    let slotMatchExecResult;
    var slotMatches = [];
    var slotFlags = [];
    while(slotMatchExecResult = slotRegExp.exec(currentUtterance)){
      slotMatches.push(slotMatchExecResult[0]);
      slots.push(slotMatchExecResult[1]);
      let slotFlagsString = slotMatchExecResult[2];
      if(typeof slotFlagsString == "undefined" || slotFlagsString == null){
        slotFlags.push(["INCLUDE_VALUES_MATCH", "EXCLUDE_WILDCARD_MATCH"]);
      }
      else {
        // parse the flags, create an array, trim it, verify the values, verify
        // the defaults are used if not specified and then push the result onto
        // slotFlags;
        let scratchFlags = slotFlagsString.split(/\s*,\s*/);
        let cleanedUpFlags = [];
        for(let j = 0; j < scratchFlags.length; j++){
          let scratchFlag = scratchFlags[j];
          if(typeof scratchFlag == "string" && scratchFlag != null){
            scratchFlag = scratchFlag.replace(/\s*/ig, '');
            if(allowedSlotFlags.indexOf(scratchFlag) >= 0){
              cleanedUpFlags.push(scratchFlag);
            }
          }
        }
        // Now add default flags if there aren't corresponding flags in there
        // already
        if(cleanedUpFlags.indexOf("SOUNDEX_MATCH") >= 0){
          _removeAllInstancesFromArray(cleanedUpFlags, "INCLUDE_VALUES_MATCH");
          _removeAllInstancesFromArray(cleanedUpFlags, "INCLUDE_WILDCARD_MATCH");
          _removeAllInstancesFromArray(cleanedUpFlags, "EXCLUDE_VALUES_MATCH");
          _removeAllInstancesFromArray(cleanedUpFlags, "EXCLUDE_WILDCARD_MATCH");
          cleanedUpFlags.push("EXCLUDE_WILDCARD_MATCH");
          cleanedUpFlags.push("EXCLUDE_VALUES_MATCH");
        }
        else {
          // We are not doing SOUNDEX_MATCH here
          if(cleanedUpFlags.indexOf("INCLUDE_WILDCARD_MATCH") >= 0){
            _removeAllInstancesFromArray(cleanedUpFlags, "INCLUDE_VALUES_MATCH");
            _removeAllInstancesFromArray(cleanedUpFlags, "EXCLUDE_VALUES_MATCH");
            _removeAllInstancesFromArray(cleanedUpFlags, "EXCLUDE_WILDCARD_MATCH");
            cleanedUpFlags.push("EXCLUDE_VALUES_MATCH");
          }
          else if(cleanedUpFlags.indexOf("INCLUDE_VALUES_MATCH") >= 0){
            _removeAllInstancesFromArray(cleanedUpFlags, "INCLUDE_WILDCARD_MATCH");
            _removeAllInstancesFromArray(cleanedUpFlags, "EXCLUDE_VALUES_MATCH");
            _removeAllInstancesFromArray(cleanedUpFlags, "EXCLUDE_WILDCARD_MATCH");
            cleanedUpFlags.push("EXCLUDE_WILDCARD_MATCH");
          }
          else {
            cleanedUpFlags.push("INCLUDE_VALUES_MATCH");
            cleanedUpFlags.push("EXCLUDE_WILDCARD_MATCH");
          }
        }
        slotFlags.push(cleanedUpFlags);
      }
    }
    currentValue.slots = [];

    for(var j = 0; j < slots.length; j ++){
      var slotType = _getSlotType(intents, currentIntent, slots[j]);
      // TODO add code to exclude EXCLUDE_YEAR_ONLY_DATES if slotType is not AMAZON.DATE
      let slotToPush = {"name": slots[j], "type": slotType, "flags": slotFlags[j]};
      let slotTypeTransformSrcFilename = _getSlotTypeTransformSrcFilename(config, slotType);
      if(typeof slotTypeTransformSrcFilename != "undefined"){
        slotToPush.transformSrcFilename = slotTypeTransformSrcFilename;
      }
      currentValue.slots.push(slotToPush);
    }
    var regExString = currentUtterance;
    if(slots.length > 0){
      // Need to create a different regExString
      for(var j = 0; j < slotMatches.length; j++){
        var replacementString = _getReplacementRegExpStringForSlotType(_getSlotType(intents, currentIntent, slots[j]), config, slotFlags[j])
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
    reconstructedRegEx += "\\s*[.?!]?\\s*$";
    currentValue.regExString = reconstructedRegEx;

    // Now add the reg exp with all wildcards
    let wildcardRegExString = currentUtterance;
    let wildcardReplacementString = "((?:\\w|\\s|[0-9,'])+)";
    let addWildcardReplacementString = false;
    if(slots.length > 0){
      // Need to create a different regExString that has wildcards instead of slots
      for(var j = 0; j < slotMatches.length; j++){
        if(slotFlags[j].indexOf("INCLUDE_WILDCARD_MATCH") < 0){
          addWildcardReplacementString = true;
        }
        wildcardRegExString = wildcardRegExString.replace(slotMatches[j], wildcardReplacementString);
      }
    }
    if(addWildcardReplacementString == true){
      // Now split regExString into non-white space parts and reconstruct the
      // whole thing with any sequence of white spaces replaced with a white space
      // reg exp.
      let splitRegEx = wildcardRegExString.split(/\s+/);
      let reconstructedRegEx = "^\\s*";
      for(let j = 0; j < splitRegEx.length; j++){
        if(splitRegEx[j].length > 0){
          if(j > 0){
            reconstructedRegEx += "\\s+";
          }
          reconstructedRegEx += splitRegEx[j];
        }
      }
      reconstructedRegEx += "\\s*[.?!]?\\s*$";
      currentValue.wildcardRegExString = reconstructedRegEx;
    }

    currentValue.intent = currentIntent;
    recognizerSet.matchConfig.push(currentValue);
  }
  // Now process all the built in intents.  Note that their triggering
  // utterances will NOT be part of "utterances" arg, but instead will be in config.
  recognizerSet.builtInIntents = [];
  let intentConfig;

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.CancelIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.CancelIntent",
      "utterances": [
        "cancel", "never mind", "forget it"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.HelpIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.HelpIntent",
      "utterances": [
        "help", "help me", "can you help me"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.LoopOffIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.LoopOffIntent",
      "utterances": [
        "loop off"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.LoopOnIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.LoopOnIntent",
      "utterances": [
        "loop", "loop on", "keep repeating this song"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.NextIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.NextIntent",
      "utterances": [
        "next", "skip", "skip forward"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.NoIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.NoIntent",
      "utterances": [
        "no", "no thanks"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.PauseIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.PauseIntent",
      "utterances": [
        "pause", "pause that"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.PreviousIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.PreviousIntent",
      "utterances": [
        "go back", "skip back", "back up"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.RepeatIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.RepeatIntent",
      "utterances": [
        "repeat", "say that again", "repeat that"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.ResumeIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.ResumeIntent",
      "utterances": [
        "resume", "continue", "keep going"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.ShuffleOffIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.ShuffleOffIntent",
      "utterances": [
        "stop shuffling", "shuffle off", "turn off shuffle"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.ShuffleOnIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.ShuffleOnIntent",
      "utterances": [
        "shuffle", "shuffle on", "shuffle the music", "shuffle mode"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.StartOverIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.StartOverIntent",
      "utterances": [
        "start over", "restart", "start again"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.StopIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.StopIntent",
      "utterances": [
        "stop", "off", "shut up"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

  intentConfig = _getBuiltInIntentConfig(config, "AMAZON.YesIntent");
  if(_isBuiltInIntentEnabled(intentConfig)){
    let builtinIntent = {
      "name": "AMAZON.YesIntent",
      "utterances": [
        "yes", "yes please", "sure"
      ]
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
      builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
    }
    builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
    recognizerSet.builtInIntents.push(builtinIntent);
  }

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

var _getSlotTransformSrcFilenameFromRecognizer = function(recognizer, intent, slot){
  for(var i = 0; i < recognizer.matchConfig.length; i++){
    if(recognizer.matchConfig[i].intent == intent){
      for(var j = 0; j < recognizer.matchConfig[i].slots.length; j ++){
        if(recognizer.matchConfig[i].slots[j].name == slot){
          return recognizer.matchConfig[i].slots[j].transformSrcFilename;
        }
      }
      return;
    }
  }
}

var _removeAllInstancesFromArray = function(arrayToRemoveFrom, value){
  for(let i = arrayToRemoveFrom.length - 1; i >= 0; i--){
    if(arrayToRemoveFrom[i] == value){
      arrayToRemoveFrom.splice(i, 1);
    }
  }
}

var _getBuiltInSlotConfig = function(config, slotName){
  if(typeof config != "undefined" && Array.isArray(config.builtInSlots)){
    for(let i = 0; i < config.builtInSlots.length; i ++){
      let slotConfig = config.builtInSlots[i];
      if(slotConfig.name == slotName){
        return slotConfig;
      }
    }
  }
  // Nothing found - return undefined
  return;
}

var _getSlotTypeTransformSrcFilename = function(config, slotType){
  if(typeof config.builtInSlots != "undefined" && Array.isArray(config.builtInSlots)){
    for(let i = 0; i < config.builtInSlots.length; i++){
      let currentSlot = config.builtInSlots[i];
      if(currentSlot.name == slotType){
        return currentSlot.transformSrcFilename;
      }
    }
  }
  if(typeof config.customSlotTypes != "undefined" && Array.isArray(config.customSlotTypes)){
    for(let i = 0; i < config.customSlotTypes.length; i++){
      let currentSlot = config.customSlotTypes[i];
      if(currentSlot.name == slotType){
        return currentSlot.transformSrcFilename;
      }
    }
  }
  return;
};


var _getBuiltInSlotExtendedValues = function(slotConfig){
  let returnValue;
  if(typeof slotConfig != "undefined" && slotConfig != null){
    if(typeof slotConfig.extendedValues != "undefined"){
      returnValue = [].concat(slotConfig.extendedValues);
    }
    if(typeof slotConfig.extendedValuesFilename != "undefined"){
      let loadedFromFile = utilities.loadStringListFromFile(slotConfig.extendedValuesFilename);
      if(typeof loadedFromFile != "undefined" && Array.isArray(loadedFromFile)){
        if(typeof returnValue == "undefined"){
          returnValue = [];
        }
        returnValue = returnValue.concat(loadedFromFile);
      }
    }
  }
  return returnValue;
}

var _getBuiltInIntentConfig = function(config, intentName){
  if(typeof config != "undefined" && Array.isArray(config.builtInIntents)){
    for(let i = 0; i < config.builtInIntents.length; i ++){
      let intentConfig = config.builtInIntents[i];
      if(intentConfig.name == intentName){
        return intentConfig;
      }
    }
  }
  // Nothing found - return undefined
  return;
}

var _getBuiltInIntentExtendedUtterances = function(intentConfig){
  let returnValue;
  if(typeof intentConfig != "undefined" && intentConfig != null){
    if(typeof intentConfig.extendedUtterances != "undefined"){
      returnValue = [].concat(intentConfig.extendedUtterances);
    }
    if(typeof intentConfig.extendedUtterancesFilename != "undefined"){
      let loadedFromFile = utilities.loadStringListFromFile(intentConfig.extendedUtterancesFilename);
      if(typeof loadedFromFile != "undefined" && Array.isArray(loadedFromFile)){
        if(typeof returnValue == "undefined"){
          returnValue = [];
        }
        returnValue = returnValue.concat(loadedFromFile);
      }
    }
  }
  return returnValue;
}
var _isBuiltInIntentEnabled = function(intentConfig){
  if(typeof intentConfig != "undefined" && (typeof intentConfig.enabled != "undefined" && intentConfig.enabled == false)){
    return false;
  }
  return true;
}

module.exports = recognizer;
