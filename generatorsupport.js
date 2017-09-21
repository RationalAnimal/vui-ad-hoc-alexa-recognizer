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
'use strict';
var fs = require('fs');
var soundex = require('./soundex.js');
var utilities = require('./utilities.js');
var parser = require('./parseutterance.js');
var recognizer = {};
var constants = require('./constants.js');

var _makeReplacementRegExpString = function(arrayToConvert){
    let returnValue = "((?:";
    for(let i = 0; i < arrayToConvert.length; i++){
        if(i > 0){
            returnValue += "|";
        }
        returnValue += "" + arrayToConvert[i] + "\\s*";
    }
    returnValue += ")+)";
    return returnValue;
};

var _makeFullRegExpString = function(arrayToConvert){
    let regExString = _makeReplacementRegExpString(arrayToConvert);
    // Now split regExString into non-white space parts and reconstruct the
    // whole thing with any sequence of white spaces replaced with a white space
    // reg exp.
    let splitRegEx = regExString.split(/\s+/);
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
    return reconstructedRegEx;
};

recognizer.Recognizer = class {
};

// The sections below are for the built in slots support
recognizer.builtInValues = {};

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
        "twenty eighth|28th|twenty ninth|29th|thirtieth|30th|thirty first|31st){0,1}\\s*" +
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
        "\\s*(?:zero|oh|0|one|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|eleven|11|twelve|12|thirteen|13|fourteen|14|fifteen|15|sixteen|16|seventeen|17|eighteen|18|nineteen|19|twenty|20|twenty one|21|twenty two|22|twenty three|23){1}\\s*(?:o'clock|am|pm|a\\.m\\.|p\\.m\\.|in the morning|in the afternoon|in the evening|at night){0,1}\\s*";

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

recognizer.builtInValues.US_PRESIDENT = require("./builtinslottypes/uspresidents.json");

// have 3 sections - 3 digit area code, 3 digit exchange code, 4 digit subscriber number
recognizer.builtInValues.US_PHONE_NUMBER = {};
recognizer.builtInValues.US_PHONE_NUMBER.replacementRegExpString =
  "(" +
    // First, area code

  "(?:[(]{0,1}\\s*)" + // Area code opening parenthesis, if any
  "(?:"+
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){3}" +
    "|" +

    "(?:" +
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){1}" +
    "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
    ")" +
  ")" + // End of the numeric part of the area code
  "(?:[-).]{0,1}\\s*)" +
  // Second, the domain
  "(?:"+
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){3}" +
    "|" +

    "(?:" +
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){1}" +
    "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
    ")" +
  ")" + // End of the numeric part of the domain
  "(?:[-.]{0,1}\\s*)" +
  // Third, subscriber number
  "(?:"+

    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){4}" +
    "|" +

    "(?:" +
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){2}" +
    "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
    ")" +
    "|" +


    "(?:" +
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9,])\\s*){1}" +
    "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9])\\s*){1}" +
    ")" +
    "|" +

    "(?:" +
    "(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){1}\\s*(?:one|two|three|four|five|six|seven|eight|nine|[1-9]){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen){1}\\s*){1}\\s*" +
    "(?:(?:oh|o|zero|one|two|three|four|five|six|seven|eight|nine|[0-9])\\s*){2}" +
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

  ")" + // End of the subscriber portion
  ")\\s*";
//console.log("recognizer.builtInValues.US_PHONE_NUMBER.replacementRegExpString:" + recognizer.builtInValues.US_PHONE_NUMBER.replacementRegExpString);
recognizer.builtInValues.US_PHONE_NUMBER.replacementRegExp = new RegExp(recognizer.builtInValues.US_PHONE_NUMBER.replacementRegExpString, "ig");

recognizer.builtInValues.Airline = require("./builtinslottypes/airlines.json");

recognizer.builtInValues.SportsTeam = require("./builtinslottypes/sportsteams.json");

recognizer.builtInValues.US_FIRST_NAME = require("./builtinslottypes/usfirstnames.json");
recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.US_FIRST_NAME.values);
recognizer.builtInValues.US_FIRST_NAME.replacementRegExp = new RegExp(recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString, "ig");

recognizer.builtInValues.Actor = require("./builtinslottypes/actors.json");
recognizer.builtInValues.Actor.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Actor.values);

recognizer.builtInValues.Artist = require("./builtinslottypes/artists.json");
recognizer.builtInValues.Artist.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Artist.values);

recognizer.builtInValues.Comic = require("./builtinslottypes/comics.json");
recognizer.builtInValues.Comic.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Comic.values);

recognizer.builtInValues.Dessert = require("./builtinslottypes/desserts.json");
recognizer.builtInValues.Dessert.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Dessert.values);

recognizer.builtInValues.LandmarksOrHistoricalBuildings = require("./builtinslottypes/landmarksorhistoricalbuildings.json");
recognizer.builtInValues.LandmarksOrHistoricalBuildings.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.LandmarksOrHistoricalBuildings.values);

recognizer.builtInValues.Landform = require("./builtinslottypes/landforms.json");
recognizer.builtInValues.Landform.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Landform.values);

recognizer.builtInValues.MovieSeries = require("./builtinslottypes/movieseries.json");
recognizer.builtInValues.MovieSeries.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MovieSeries.values);

recognizer.builtInValues.MovieTheater = require("./builtinslottypes/movietheaters.json");
recognizer.builtInValues.MovieTheater.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MovieTheater.values);

recognizer.builtInValues.MusicAlbum = require("./builtinslottypes/musicalbums.json");
recognizer.builtInValues.MusicAlbum.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MusicAlbum.values);

recognizer.builtInValues.Musician = require("./builtinslottypes/musicians.json");
recognizer.builtInValues.Musician.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Musician.values);

recognizer.builtInValues.MusicRecording = require("./builtinslottypes/musicrecordings.json");
recognizer.builtInValues.MusicRecording.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MusicRecording.values);

recognizer.builtInValues.MusicVenue = require("./builtinslottypes/musicvenues.json");
recognizer.builtInValues.MusicVenue.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MusicVenue.values);

recognizer.builtInValues.MusicVideo = require("./builtinslottypes/musicvideos.json");
recognizer.builtInValues.MusicVideo.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MusicVideo.values);

// Make a concatenated list of all the other person types and add those to the separate "person" list
recognizer.builtInValues.Person = require("./builtinslottypes/persons.json");
let scratchPerson = require("./builtinslottypes/actors.json");
recognizer.builtInValues.Person.values = recognizer.builtInValues.Person.values.concat(scratchPerson.values);
scratchPerson = require("./builtinslottypes/artists.json");
recognizer.builtInValues.Person.values = recognizer.builtInValues.Person.values.concat(scratchPerson.values);
scratchPerson = require("./builtinslottypes/athletes.json");
recognizer.builtInValues.Person.values = recognizer.builtInValues.Person.values.concat(scratchPerson.values);
scratchPerson = require("./builtinslottypes/authors.json");
recognizer.builtInValues.Person.values = recognizer.builtInValues.Person.values.concat(scratchPerson.values);
scratchPerson = require("./builtinslottypes/directors.json");
recognizer.builtInValues.Person.values = recognizer.builtInValues.Person.values.concat(scratchPerson.values);
scratchPerson = require("./builtinslottypes/musicians.json");
recognizer.builtInValues.Person.values = recognizer.builtInValues.Person.values.concat(scratchPerson.values);
scratchPerson = require("./builtinslottypes/professionals.json");
recognizer.builtInValues.Person.values = recognizer.builtInValues.Person.values.concat(scratchPerson.values);
recognizer.builtInValues.Person.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Person.values);

recognizer.builtInValues.MusicGroup = require("./builtinslottypes/musicgroups.json");
recognizer.builtInValues.MusicGroup.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MusicGroup.values);

recognizer.builtInValues.MusicEvent = require("./builtinslottypes/musicevents.json");
recognizer.builtInValues.MusicEvent.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MusicEvent.values);

recognizer.builtInValues.Movie = require("./builtinslottypes/movies.json");
recognizer.builtInValues.Movie.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Movie.values);

recognizer.builtInValues.MedicalOrganization = require("./builtinslottypes/medicalorganizations.json");
recognizer.builtInValues.MedicalOrganization.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MedicalOrganization.values);

// Make a concatenated list of all the other organizations
recognizer.builtInValues.Organization = require("./builtinslottypes/medicalorganizations.json");
let scratchOrganization = require("./builtinslottypes/educationalorganizations.json");
recognizer.builtInValues.Organization.values = recognizer.builtInValues.Organization.values.concat(scratchOrganization.values);
recognizer.builtInValues.Organization.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Organization.values);

recognizer.builtInValues.LocalBusinessType = require("./builtinslottypes/localbusinesstypes.json");
recognizer.builtInValues.LocalBusinessType.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.LocalBusinessType.values);

recognizer.builtInValues.LocalBusiness = require("./builtinslottypes/localbusinesses.json");
recognizer.builtInValues.LocalBusiness.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.LocalBusiness.values);

let scratchGame = require("./builtinslottypes/videogames.json");
// Add video games to software games, but without adding duplicates
recognizer.builtInValues.SoftwareGame = require("./builtinslottypes/softwaregames.json");
for(let i = 0; i < scratchGame.length; i ++){
  if(recognizer.builtInValues.SoftwareGame.indexOf(scratchGame[i]) < 0){
    recognizer.builtInValues.SoftwareGame.push(scratchGame[i]);
  }
}
recognizer.builtInValues.SoftwareGame.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.SoftwareGame.values);

scratchGame = require("./builtinslottypes/softwaregames.json");
// Add software games to video games, but without adding duplicates
recognizer.builtInValues.VideoGame = require("./builtinslottypes/videogames.json");
for(let i = 0; i < scratchGame.length; i ++){
  if(recognizer.builtInValues.VideoGame.indexOf(scratchGame[i]) < 0){
    recognizer.builtInValues.VideoGame.push(scratchGame[i]);
  }
}
recognizer.builtInValues.VideoGame.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.VideoGame.values);

recognizer.builtInValues.Game = require("./builtinslottypes/games.json");
// Add software games to games, but without adding duplicates
scratchGame = require("./builtinslottypes/softwaregames.json");
for(let i = 0; i < scratchGame.length; i ++){
  if(recognizer.builtInValues.Game.indexOf(scratchGame[i]) < 0){
    recognizer.builtInValues.Game.push(scratchGame[i]);
  }
}
// Add video games to games, but without adding duplicates
scratchGame = require("./builtinslottypes/videogames.json");
for(let i = 0; i < scratchGame.length; i ++){
  if(recognizer.builtInValues.Game.indexOf(scratchGame[i]) < 0){
    recognizer.builtInValues.Game.push(scratchGame[i]);
  }
}
recognizer.builtInValues.Game.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Game.values);

recognizer.builtInValues.FoodEstablishment = require("./builtinslottypes/foodestablishments.json");
recognizer.builtInValues.FoodEstablishment.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.FoodEstablishment.values);

recognizer.builtInValues.FictionalCharacter = require("./builtinslottypes/fictionalcharacters.json");
recognizer.builtInValues.FictionalCharacter.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.FictionalCharacter.values);

recognizer.builtInValues.Festival = require("./builtinslottypes/festivals.json");
recognizer.builtInValues.Festival.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Festival.values);

recognizer.builtInValues.EducationalOrganization = require("./builtinslottypes/educationalorganizations.json");
recognizer.builtInValues.EducationalOrganization.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.EducationalOrganization.values);

recognizer.builtInValues.Director = require("./builtinslottypes/directors.json");
recognizer.builtInValues.Director.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Director.values);

recognizer.builtInValues.Corporation = require("./builtinslottypes/corporations.json");
let unusualCorporationCharacters = [];
for(let i = 0; i < recognizer.builtInValues.Corporation.values.length; i++){
  let unusualCharactersRegExp = /[^\0-~]/ig;
  let matchResult;
  while(matchResult = unusualCharactersRegExp.exec(recognizer.builtInValues.Corporation.values[i].name)){
//    console.log("unusualCorporationCharacters search, got matchResult: ", JSON.stringify(matchResult));
    for(let j = 0; j < matchResult.length; j++){
      if(matchResult[j] !== null && unusualCorporationCharacters.indexOf(matchResult[j]) < 0){
        unusualCorporationCharacters.push(matchResult[j]);
      }
    }
  }
  for(let k = 0; k < recognizer.builtInValues.Corporation.values[i].alternativeNames.length; k++){
    while(matchResult = unusualCharactersRegExp.exec(recognizer.builtInValues.Corporation.values[i].alternativeNames[k])){
//    console.log("unusualCorporationCharacters search, got matchResult: ", JSON.stringify(matchResult));
      for(let j = 0; j < matchResult.length; j++){
        if(matchResult[j] !== null && unusualCorporationCharacters.indexOf(matchResult[j]) < 0){
//          console.log("unusualCorporationCharacters search in alternativeNames, got matchResult: ", JSON.stringify(matchResult));
          unusualCorporationCharacters.push(matchResult[j]);
        }
      }
    }
  }
  for(let k = 0; k < recognizer.builtInValues.Corporation.values[i].priorNames.length; k++){
    while(matchResult = unusualCharactersRegExp.exec(recognizer.builtInValues.Corporation.values[i].priorNames[k])){
//    console.log("unusualCorporationCharacters search, got matchResult: ", JSON.stringify(matchResult));
      for(let j = 0; j < matchResult.length; j++){
        if(matchResult[j] !== null && unusualCorporationCharacters.indexOf(matchResult[j]) < 0){
//          console.log("unusualCorporationCharacters search in priorNames, got matchResult: ", JSON.stringify(matchResult));
          unusualCorporationCharacters.push(matchResult[j]);
        }
      }
    }
  }
}
recognizer.builtInValues.Corporation.presentUnusualCharacters = unusualCorporationCharacters;
//console.log("unusualCorporationCharacters: ", JSON.stringify(unusualCorporationCharacters));

recognizer.builtInValues.Airport = require("./builtinslottypes/airports.json");
let unusualAirportCharacters = [];
for(let i = 0; i < recognizer.builtInValues.Airport.values.length; i++){
  let unusualCharactersRegExp = /[^\0-~]/ig;
  let matchResult;
  while(matchResult = unusualCharactersRegExp.exec(recognizer.builtInValues.Airport.values[i].name)){
//    console.log("unusualAirportCharacters search, got matchResult: ", JSON.stringify(matchResult));
    for(let j = 0; j < matchResult.length; j++){
      if(matchResult[j] !== null && unusualAirportCharacters.indexOf(matchResult[j]) < 0){
          unusualAirportCharacters.push(matchResult[j]);
      }
    }
  }
  for(let k = 0; k < recognizer.builtInValues.Airport.values[i].alternativeNames.length; k++){
    while(matchResult = unusualCharactersRegExp.exec(recognizer.builtInValues.Airport.values[i].alternativeNames[k])){
//    console.log("unusualAirportCharacters search, got matchResult: ", JSON.stringify(matchResult));
      for(let j = 0; j < matchResult.length; j++){
        if(matchResult[j] !== null && unusualAirportCharacters.indexOf(matchResult[j]) < 0){
//          console.log("unusualAirportCharacters search in alternativeNames, got matchResult: ", JSON.stringify(matchResult));
          unusualAirportCharacters.push(matchResult[j]);
        }
      }
    }
  }
  for(let k = 0; k < recognizer.builtInValues.Airport.values[i].priorNames.length; k++){
    while(matchResult = unusualCharactersRegExp.exec(recognizer.builtInValues.Airport.values[i].priorNames[k])){
//    console.log("unusualAirportCharacters search, got matchResult: ", JSON.stringify(matchResult));
      for(let j = 0; j < matchResult.length; j++){
        if(matchResult[j] !== null && unusualAirportCharacters.indexOf(matchResult[j]) < 0){
//          console.log("unusualAirportCharacters search in priorNames, got matchResult: ", JSON.stringify(matchResult));
          unusualAirportCharacters.push(matchResult[j]);
        }
      }
    }
  }
}
recognizer.builtInValues.Airport.presentUnusualCharacters = unusualAirportCharacters;
//console.log("unusualAirportCharacters: ", JSON.stringify(unusualAirportCharacters));

recognizer.builtInValues.CivicStructure = require("./builtinslottypes/civicstructures.json");
recognizer.builtInValues.CivicStructure.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.CivicStructure.values);

recognizer.builtInValues.BroadcastChannel = require("./builtinslottypes/broadcastchannels.json");
recognizer.builtInValues.BroadcastChannel.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.BroadcastChannel.values);

recognizer.builtInValues.BookSeries = require("./builtinslottypes/bookseries.json");
recognizer.builtInValues.BookSeries.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.BookSeries.values);

recognizer.builtInValues.Book = require("./builtinslottypes/books.json");
recognizer.builtInValues.Book.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Book.values);

recognizer.builtInValues.Author = require("./builtinslottypes/authors.json");
recognizer.builtInValues.Author.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Author.values);

recognizer.builtInValues.Professional = require("./builtinslottypes/professionals.json");
recognizer.builtInValues.Professional.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Professional.values);

recognizer.builtInValues.Residence = require("./builtinslottypes/residences.json");
recognizer.builtInValues.Residence.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Residence.values);

recognizer.builtInValues.ScreeningEvent = require("./builtinslottypes/screeningevents.json");
recognizer.builtInValues.ScreeningEvent.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.ScreeningEvent.values);

recognizer.builtInValues.Service = require("./builtinslottypes/services.json");
recognizer.builtInValues.Service.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Service.values);

recognizer.builtInValues.SoftwareApplication = require("./builtinslottypes/softwareapplications.json");
recognizer.builtInValues.SoftwareApplication.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.SoftwareApplication.values);

recognizer.builtInValues.SportsEvent = require("./builtinslottypes/sportsevents.json");
recognizer.builtInValues.SportsEvent.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.SportsEvent.values);

recognizer.builtInValues.SocialMediaPlatform = require("./builtinslottypes/socialmediaplatforms.json");
recognizer.builtInValues.SocialMediaPlatform.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.SocialMediaPlatform.values);

recognizer.builtInValues.TVEpisode = require("./builtinslottypes/tvepisodes.json");
recognizer.builtInValues.TVEpisode.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.TVEpisode.values);

recognizer.builtInValues.TVSeason = require("./builtinslottypes/tvseasons.json");
recognizer.builtInValues.TVSeason.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.TVSeason.values);

recognizer.builtInValues.TVSeries = require("./builtinslottypes/tvseries.json");
recognizer.builtInValues.TVSeries.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.TVSeries.values);


recognizer.builtInValues.Athlete = require("./builtinslottypes/athletes.json");
recognizer.builtInValues.Athlete.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Athlete.values);

recognizer.builtInValues.AdministrativeArea = require("./builtinslottypes/administrativeareas.json");
recognizer.builtInValues.AdministrativeArea.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.AdministrativeArea.values);

recognizer.builtInValues.Month = {};
recognizer.builtInValues.Month.values = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
recognizer.builtInValues.Month.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Month.values);

recognizer.builtInValues.DayOfWeek = {};
recognizer.builtInValues.DayOfWeek.values = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
recognizer.builtInValues.DayOfWeek.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.DayOfWeek.values);

recognizer.builtInValues.Country = require("./builtinslottypes/countries.json");
recognizer.builtInValues.Country.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Country.values);

recognizer.builtInValues.Color = require("./builtinslottypes/colors.json");
recognizer.builtInValues.Color.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Color.values);

recognizer.builtInValues.Room = require("./builtinslottypes/rooms.json");
recognizer.builtInValues.Room.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Room.values);

/**
 * This is the new version meant to be used with the parseutterance.js
 */
var _getReplacementRegExpStringGivenSlotType = function(slotType, config, slotFlags, matchStage){
    if(typeof matchStage === "undefined"){
        matchStage = "FINAL";
    }
    slotType = _getTranslatedSlotTypeForInternalLookup(slotType);
    let simpleSlots = [
        "TRANSCEND.US_FIRST_NAME", "TRANSCEND.Actor", "TRANSCEND.Artist", "TRANSCEND.Comic", "TRANSCEND.Dessert",
        "TRANSCEND.LandmarksOrHistoricalBuildings", "TRANSCEND.Landform", "TRANSCEND.MovieSeries", "TRANSCEND.MovieTheater",
        "TRANSCEND.MusicAlbum", "TRANSCEND.Musician", "TRANSCEND.MusicGroup", "TRANSCEND.MusicEvent", "TRANSCEND.Movie",
        "TRANSCEND.MedicalOrganization", "TRANSCEND.LocalBusinessType", "TRANSCEND.LocalBusiness", "TRANSCEND.Game",
        "TRANSCEND.FoodEstablishment", "TRANSCEND.FictionalCharacter", "TRANSCEND.Festival", "TRANSCEND.EducationalOrganization",
        "TRANSCEND.Director", "TRANSCEND.CivicStructure", "TRANSCEND.BroadcastChannel",
        "TRANSCEND.BookSeries", "TRANSCEND.Book", "TRANSCEND.Author", "TRANSCEND.Athlete",
        "TRANSCEND.AdministrativeArea", "TRANSCEND.Country", "TRANSCEND.Color", "TRANSCEND.Room", "TRANSCEND.MusicRecording",
        "TRANSCEND.MusicVenue", "TRANSCEND.MusicVideo", "TRANSCEND.Organization", "TRANSCEND.Person", "TRANSCEND.Professional",
        "TRANSCEND.Residence", "TRANSCEND.ScreeningEvent", "TRANSCEND.Service", "TRANSCEND.SoftwareApplication", "TRANSCEND.SoftwareGame",
        "TRANSCEND.SportsEvent", "TRANSCEND.SocialMediaPlatform", "TRANSCEND.TVEpisode", "TRANSCEND.TVSeason", "TRANSCEND.TVSeries", "TRANSCEND.VideoGame"
    ];
    if(slotType === "TRANSCEND.NUMBER"){
      // Ignore flags for now
      if(matchStage === "FINAL"){
        return recognizer.builtInValues.NUMBER.replacementRegExpString;
      }
      else {
        return "((?:[-0-9a-zA-Z,.]|\\s)+)";
      }
    }
    else if(slotType === "TRANSCEND.FOUR_DIGIT_NUMBER"){
        // Ignore flags for now
      if(matchStage === "FINAL"){
        return recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString;
      }
      else {
        return "((?:[0-9a-zA-Z,.]|\\s)+)";
      }
    }
    else if(slotType === "TRANSCEND.US_PHONE_NUMBER"){
      // Ignore flags for now
      if(matchStage === "FINAL"){
        return recognizer.builtInValues.US_PHONE_NUMBER.replacementRegExpString;
      }
      else {
        return "((?:[0-9a-zA-Z,.]|\\s)+)";
      }
    }
    else if(slotType === "TRANSCEND.US_STATE"){
      if(matchStage === "FINAL"){
        if(_hasFlag("EXCLUDE_NON_STATES", slotFlags)){
          let states = [];
          for(let i = 0; i < recognizer.builtInValues.US_STATE.values.length; i ++){
            if(recognizer.builtInValues.US_STATE.values[i].isState){
              states.push(recognizer.builtInValues.US_STATE.values[i].name);
            }
          }
          let statesOnlyRegExpString = _makeReplacementRegExpString(states);
          return statesOnlyRegExpString;
        }
        else {
          let statesAndTerritories = [];
          for(let i = 0; i < recognizer.builtInValues.US_STATE.values.length; i ++){
            statesAndTerritories.push(recognizer.builtInValues.US_STATE.values[i].name);
          }
          let statesAndTerritoriesRegExpString = _makeReplacementRegExpString(statesAndTerritories);
          return statesAndTerritoriesRegExpString;
        }
      }
      else {
        return "((?:[a-zA-Z.]|\\s)+)";
      }
    }
    else if(slotType === "TRANSCEND.US_PRESIDENT"){
      if(matchStage === "FINAL"){
        let matchingStrings = [];
        for(let i = 0; i < recognizer.builtInValues.US_PRESIDENT.values.length; i ++){
          for(let j = 0; j < recognizer.builtInValues.US_PRESIDENT.values[i].matchingStrings.length; j ++){
            matchingStrings.push(recognizer.builtInValues.US_PRESIDENT.values[i].matchingStrings[j]);
          }
          for(let j = 0; j < recognizer.builtInValues.US_PRESIDENT.values[i].ordinalMatchingStrings.length; j ++){
            matchingStrings.push(recognizer.builtInValues.US_PRESIDENT.values[i].ordinalMatchingStrings[j]);
          }
        }
        return _makeReplacementRegExpString(matchingStrings);
      }
      else {
        return "((?:[0-9a-zA-Z.]|\\s)+)";
      }
    }
    else if(slotType === "TRANSCEND.Airline"){
      if(matchStage === "FINAL"){
        // Ignore SOUNDEX_MATCH flag for now
        let hasWildCardMatch = false;
        let hasCountryFlag = false;
        let countries = [];
        let hasContinentFlag = false;
        let continents = [];
        let hasTypeFlag = false;
        let types = [];
        for(let i = 0; i < slotFlags.length; i++){
          if(slotFlags[i].name === "COUNTRY"){
            hasCountryFlag = true;
            countries = slotFlags[i].parameters;
          }
          else if(slotFlags[i].name === "CONTINENT"){
            hasContinentFlag = true;
            continents = slotFlags[i].parameters;
          }
          else if(slotFlags[i].name === "TYPE"){
            hasTypeFlag = true;
            types = slotFlags[i].parameters;
          }
          else if(slotFlags[i].name === "INCLUDE_WILDCARD_MATCH"){
            hasWildCardMatch = true;
          }
        }
        if(hasWildCardMatch){
          // numbers are used in cases of some names
          return "((?:\\w|\\s|[0-9,_']|\-)+)";
//          return "((?:\\w|\\s|[0-9]|\-)+)";
        }
        else {
          let allAirlines = [];
          for(let i = 0; i < recognizer.builtInValues.Airline.values.length; i ++){
            if(hasCountryFlag && countries.indexOf(recognizer.builtInValues.Airline.values[i].country) < 0){
              continue;
            }
            if(hasContinentFlag && continents.indexOf(recognizer.builtInValues.Airline.values[i].continent) < 0){
              continue;
            }
            if(hasTypeFlag && types.indexOf(recognizer.builtInValues.Airline.values[i].type) < 0){
              continue;
            }
            allAirlines.push(recognizer.builtInValues.Airline.values[i].name);
          }
          let replacementRegExpString = _makeReplacementRegExpString(allAirlines);
          return replacementRegExpString;
        }
      }
      else {
        return "((?:\\w|\\s|[0-9,_']|\-)+)";
//        return "(.+)";
      }
    }
    else if(slotType === "TRANSCEND.SportsTeam"){
      if(matchStage === "FINAL"){
        // Ignore SOUNDEX_MATCH flag for now
        let hasWildCardMatch = false;
        let hasSportFlag = false;
        let sports = [];
        let hasLeagueFlag = false;
        let leagues = [];
        let hasIncludePriorNamesFlag = false;
        for(let i = 0; i < slotFlags.length; i++){
          if(slotFlags[i].name === "SPORT"){
            hasSportFlag = true;
            sports = slotFlags[i].parameters;
          }
          else if(slotFlags[i].name === "LEAGUE"){
            hasLeagueFlag = true;
            leagues = slotFlags[i].parameters;
          }
          else if(slotFlags[i].name === "INCLUDE_WILDCARD_MATCH"){
            hasWildCardMatch = true;
          }
          else if(slotFlags[i].name === "INCLUDE_PRIOR_NAMES"){
            hasWildCardMatch = true;
          }
        }
        if(hasWildCardMatch){
          // numbers are used in cases of some names
          return "((?:\\w|\\s|[0-9,_']|\-)+)";
//          return "((?:\\w|\\s|[0-9]|\-)+)";
        }
        else {
          let allSportsTeams = [];
          for(let i = 0; i < recognizer.builtInValues.SportsTeam.values.length; i ++){
            if(hasSportFlag && sports.indexOf(recognizer.builtInValues.SportsTeam.values[i].sport) < 0){
              continue;
            }
            if(hasLeagueFlag && leagues.indexOf(recognizer.builtInValues.SportsTeam.values[i].league) < 0){
              continue;
            }
            allSportsTeams.push(recognizer.builtInValues.SportsTeam.values[i].name);
            if(typeof recognizer.builtInValues.SportsTeam.values[i].alternativeNames !== "undefined" && Array.isArray(recognizer.builtInValues.SportsTeam.values[i].alternativeNames)){
              for(let j = 0; j < recognizer.builtInValues.SportsTeam.values[i].alternativeNames.length; j++){
                allSportsTeams.push(recognizer.builtInValues.SportsTeam.values[i].alternativeNames[j]);
              }
            }
            if(hasIncludePriorNamesFlag){
              for(let j = 0; j < recognizer.builtInValues.SportsTeam.priorNames.length; j++){
                allSportsTeams.push(recognizer.builtInValues.SportsTeam.values[i].priorNames[j]);
              }
            }
          }
          let replacementRegExpString = _makeReplacementRegExpString(allSportsTeams);
          return replacementRegExpString;
        }      }
      else {
        return "((?:\\w|\\s|[0-9,_']|\-)+)";
//        return "((?:\\w|\\s|[0-9]|\-)+)";
      }

    }
    else if(slotType === "TRANSCEND.Corporation"){
      if(matchStage === "FINAL"){
        // Ignore SOUNDEX_MATCH flag for now
        let hasWildCardMatch = false;
        let hasIncludePriorNamesFlag = false;
        for(let i = 0; i < slotFlags.length; i++){
          if(slotFlags[i].name === "INCLUDE_WILDCARD_MATCH"){
            hasWildCardMatch = true;
          }
          else if(slotFlags[i].name === "INCLUDE_PRIOR_NAMES"){
            hasWildCardMatch = true;
          }
        }
        if(hasWildCardMatch){
          // numbers are used in cases of some names
          return "((?:\\s|[-0-9a-zA-Z_',.&]|[^\0-~])+)";
        }
        else {
          let allCorporations = [];
          for(let i = 0; i < recognizer.builtInValues.Corporation.values.length; i ++){
            allCorporations.push(recognizer.builtInValues.Corporation.values[i].name);
            if(typeof recognizer.builtInValues.Corporation.values[i].alternativeNames !== "undefined" && Array.isArray(recognizer.builtInValues.Corporation.values[i].alternativeNames)){
              for(let j = 0; j < recognizer.builtInValues.Corporation.values[i].alternativeNames.length; j++){
                allCorporations.push(recognizer.builtInValues.Corporation.values[i].alternativeNames[j]);
              }
            }
            if(hasIncludePriorNamesFlag){
              for(let j = 0; j < recognizer.builtInValues.Corporation.priorNames.length; j++){
                allCorporations.push(recognizer.builtInValues.Corporation.values[i].priorNames[j]);
              }
            }
          }
          let replacementRegExpString = _makeReplacementRegExpString(allCorporations);
          return replacementRegExpString;
        }
      }
      else {
        if(recognizer.builtInValues.Corporation.presentUnusualCharacters.length > 0){
          let returnValue = "((?:\\s|[-0-9a-zA-Z,_,.&'";
          for(let i = 0; i < recognizer.builtInValues.Corporation.presentUnusualCharacters.length; i ++){
//            console.log("special character: " + recognizer.builtInValues.Corporation.presentUnusualCharacters[i] + ", code: ", recognizer.builtInValues.Corporation.presentUnusualCharacters[i].charCodeAt(0));
            returnValue += recognizer.builtInValues.Corporation.presentUnusualCharacters[i];
          }
          returnValue += "])+)";
          return returnValue;
        }
        else {
          return "((?:[-0-9a-zA-Z_',.&]|\\s)+)";
        }
      }
    }
    else if(slotType === "TRANSCEND.Airport"){
      if(matchStage === "FINAL"){
        // Ignore SOUNDEX_MATCH flag for now
        let hasWildCardMatch = false;
        let hasIncludePriorNamesFlag = false;
        let hasCountryFlag = false;
        let countries = [];
        let hasStateFlag = false;
        let states = [];
        for(let i = 0; i < slotFlags.length; i++){
          if(slotFlags[i].name === "COUNTRY"){
            hasCountryFlag = true;
            countries = slotFlags[i].parameters;
          }
          else if(slotFlags[i].name === "STATE"){
            hasStateFlag = true;
            states = slotFlags[i].parameters;
          }
          else if(slotFlags[i].name === "INCLUDE_WILDCARD_MATCH"){
            hasWildCardMatch = true;
          }
          else if(slotFlags[i].name === "INCLUDE_PRIOR_NAMES"){
            hasWildCardMatch = true;
          }
        }
        if(hasWildCardMatch){
          // TODO Need further refinements to limit the matches to international alphanumer characters, but at this time this will do
          return "((?:\\s|[-0-9a-zA-Z,_'/]|[^\0-~])+)";
        }
        else {
          let allAirports = [];
          for(let i = 0; i < recognizer.builtInValues.Airport.values.length; i ++){
            if(hasCountryFlag && countries.indexOf(recognizer.builtInValues.Airport.values[i].country) < 0){
              continue;
            }
            if(hasStateFlag && states.indexOf(recognizer.builtInValues.Airport.values[i].state) < 0){
              continue;
            }
            allAirports.push(recognizer.builtInValues.Airport.values[i].name);
            if(typeof recognizer.builtInValues.Airport.values[i].alternativeNames !== "undefined" && Array.isArray(recognizer.builtInValues.Airport.values[i].alternativeNames)){
              for(let j = 0; j < recognizer.builtInValues.Airport.values[i].alternativeNames.length; j++){
                allAirports.push(recognizer.builtInValues.Airport.values[i].alternativeNames[j]);
              }
            }
            if(hasIncludePriorNamesFlag && typeof recognizer.builtInValues.Airport.priorNames !== "undefined" && Array.isArray(recognizer.builtInValues.Airport.priorNames)){
              for(let j = 0; j < recognizer.builtInValues.Airport.priorNames.length; j++){
                allAirports.push(recognizer.builtInValues.Airport.values[i].priorNames[j]);
              }
            }
          }
          let replacementRegExpString = _makeReplacementRegExpString(allAirports);
          return replacementRegExpString;
        }
      }
      else {
        if(recognizer.builtInValues.Airport.presentUnusualCharacters.length > 0){
          let returnValue = "((?:\\s|[-0-9a-zA-Z,_'/";
          for(let i = 0; i < recognizer.builtInValues.Airport.presentUnusualCharacters.length; i ++){
//            console.log("special character: " + recognizer.builtInValues.Airport.presentUnusualCharacters[i] + ", code: ", recognizer.builtInValues.Airport.presentUnusualCharacters[i].charCodeAt(0));
            returnValue += recognizer.builtInValues.Airport.presentUnusualCharacters[i];
          }
          returnValue += "])+)";
          return returnValue;
        }
        else {
          return "((?:\\s|[-0-9a-zA-Z,_'/])+)";
        }
      }
    }
    else if(simpleSlots.indexOf(slotType) >= 0){
      if(matchStage === "FINAL"){
        return getSimpleRegExpForBuiltInSlotType(slotType, slotFlags);
      }
      else {
        return "((?:\\w|\\s|[0-9,_']|\-)+)";
//        return "((?:\\w|\\s|[0-9]|\-)+)";
      }
    }
    else if(slotType === "TRANSCEND.DATE"){
      if(matchStage === "FINAL"){
        // Ignore flags for now
        return recognizer.builtInValues.DATE.replacementRegExpString;
      }
      else {
        return "((?:\\s|[-0-9a-zA-Z,_'])+)";
      }
    }
    else if(slotType === "TRANSCEND.TIME"){
      if(matchStage === "FINAL"){
        // Ignore flags for now
        return recognizer.builtInValues.TIME.replacementRegExpString;
      }
      else {
        return "((?:\\s|[-0-9a-zA-Z,_'])+)";
      }
    }
    else if(slotType === "TRANSCEND.DURATION"){
      if(matchStage === "FINAL"){
        // Ignore flags for now
        return recognizer.builtInValues.DURATION.replacementRegExpString;
      }
      else {
        return "((?:\\s|[-0-9a-zA-Z,_':])+)";
      }
    }
    else if(slotType === "TRANSCEND.Month"){
      if(matchStage === "FINAL"){
        // Ignore flags for now
        return recognizer.builtInValues.Month.replacementRegExpString;
      }
      else {
        return "((?:\\s|[0-9a-zA-Z.])+)";
      }
    }
    else if(slotType === "TRANSCEND.DayOfWeek"){
      if(matchStage === "FINAL"){
        // Ignore flags for now
        return recognizer.builtInValues.DayOfWeek.replacementRegExpString;
      }
      else {
        return "((?:\\s|[0-9a-zA-Z.])+)";
      }
    }

//  else if(slotType.startsWith("TRANSCEND.")){
//    // TODO add handling of other built in TRANSCEND/Amazon slot types, for now just return the value
//    return "((?:\\w|\\s|[0-9]|\-)+)";
//  }
    // Here we are dealing with custom slots.
    if(typeof config !== "undefined" && Array.isArray(config.customSlotTypes)){
        for(let i = 0; i < config.customSlotTypes.length; i++){
            let customSlotType = config.customSlotTypes[i];
            if(customSlotType.name === slotType){
                if(typeof customSlotType.customRegExpString === "string" && customSlotType.customRegExpString.length > 0){
                  // RegEx based custom slots
                  if(matchStage === "FINAL"){
                    customSlotType.replacementRegExp = customSlotType.customRegExpString;
                    return customSlotType.replacementRegExp;
                  }
                  else {
                    if(typeof customSlotType.customWildCardRegExpString === "string" && customSlotType.customWildCardRegExpString.length > 0){
                        return customSlotType.customWildCardRegExpString;
                    }
                    else {
                      customSlotType.replacementRegExp = customSlotType.customRegExpString;
                      return customSlotType.replacementRegExp;
                    }
                  }
                }
                else {
                  // List based custom slots
                  if(matchStage === "FINAL"){
                    if(_hasFlag("SOUNDEX_MATCH", slotFlags)){
                      if(typeof customSlotType.replacementSoundExpRegExp === "undefined"){
                        customSlotType.replacementSoundExpRegExp = _makeReplacementRegExpString(customSlotType.soundExValues);
                      }
                      // Returning wildcard match because the first pass will be on matching on anything, THEN matching on soundex values
                      return "((?:\\w|\\s|[0-9,_']|\-)+)";
                    }
                    else if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
                      // numbers are used in cases of names like John the 1st
                      return "((?:\\w|\\s|[0-9,_']|\-)+)";
                    }
                    else {
                      if(typeof customSlotType.replacementRegExp === "undefined"){
                        customSlotType.replacementRegExp = _makeReplacementRegExpString(customSlotType.values);
                      }
                      return customSlotType.replacementRegExp;
                    }
                  }
                  else {
                    return "((?:\\w|\\s|[0-9,_']|\-)+)";
                  }

                }
            }
        }
    }
    // Default fallback
    return "((?:\\s|[-0-9a-zA-Z_])+)";
};

var allPlatforms = ["TRANSCEND", "AMAZON"];

var _scanIntentsAndSlotsForPlatform = function(config, intents, utterances){
    // If the config file specifies the input and output platform type(s) then
    // skip the parsing.
    let acceptedInputPlatforms = allPlatforms.concat(["ALL"]);
    let acceptedOutputPlatforms = allPlatforms.concat([]);
    if(typeof config === "undefined" || config === null){
        // TODO Add a separate constants file containing all the constants, including error messages.
        throw {"error": "MISSING_CONFIG", "message": "Programmer error - no config passed in."};
    }
    if(typeof intents === "undefined" || config === null){
        // TODO Add a separate constants file containing all the constants, including error messages.
        throw {"error": "MISSING_INTENTS", "message": "Programmer error - no utterances passed in."};
    }
    if(typeof utterances === "undefined" || config === null){
        // TODO Add a separate constants file containing all the constants, including error messages.
        throw {"error": "MISSING_UTTERANCES", "message": "Programmer error - no utterances passed in."};
    }

    let outputSpecified = false;
    let inputsSpecified = false;
    if(typeof config.platform !== "undefined" && config.platform !== null){
        if(Array.isArray(config.platform.input) && config.platform.input.length > 0 && typeof config.platform.output === "string"){
            let scannedInputs = [];
            for(let i = 0; i < config.platform.input.length; i ++){
                if(acceptedInputPlatforms.indexOf(config.platform.input[i]) >= 0){
                    inputsSpecified = true;
                    scannedInputs.push(config.platform.input[i]);
                }
            }
            config.platform.input = scannedInputs;
        }
        if(acceptedOutputPlatforms.indexOf(config.platform.output) >= 0){
            outputSpecified = true;
        }
        else {
            config.platform.output = undefined;
        }
        if(inputsSpecified && outputSpecified){
            // nothing to do - exit
            return;
        }
    }

    if(inputsSpecified === false){
        // Scan through intents looking for "platform" intents or slot types.
        let scannedInputs = [];

        if(typeof config.builtInIntents !== "undefined" && config.builtInIntents !== null){
            for(let i = 0; i < config.builtInIntents.length; i ++){
                let builtInIntent = config.builtInIntents[i];
                if(builtInIntent.enabled){
                    let platform = _getBuiltinIntentPlatform(builtInIntent.name, acceptedInputPlatforms);
                    if(typeof platform !== "undefined" && platform !== null && scannedInputs.indexOf(platform) < 0){
                        scannedInputs.push(platform);
                        inputsSpecified = true;
                    }
                }
            }
        }

        if(typeof config.builtInSlots !== "undefined" && config.builtInSlots !== null){
            for(let i = 0; i < config.builtInSlots.length; i ++){
                let builtInSlot = config.builtInSlots[i];
                let platform = _getBuiltinSlotPlatform(builtInSlot.name, acceptedInputPlatforms);
                if(typeof platform !== "undefined" && platform !== null && scannedInputs.indexOf(platform) < 0){
                    scannedInputs.push(platform);
                    inputsSpecified = true;
                }
            }
        }
        if(typeof config.platform === "undefined" || config.platform === null){
            config.platform = {"input": []};
        }
        if(typeof config.platform.input === "undefined" || config.platform.input === null || Array.isArray(config.platform.input) ===  false){
            config.platform.input = [];
        }
        for(let i = 0; i < scannedInputs.length; i++){
            if(config.platform.input.indexOf(scannedInputs[i]) < 0){
                config.platform.input.push(scannedInputs[i]);
            }
        }
    }
    // Finally set the output if not already set.
    if(outputSpecified === false){
        config.platform.output = "AMAZON";
    }
    if(inputsSpecified === false){
        config.platform.input.push(config.platform.output);
    }
};

/**
 Current implementation is indistiguishable from the intent version, so simply call it here.
 */
var _getBuiltinSlotPlatform = function(slotName, platforms){
    return _getBuiltinIntentPlatform(slotName, platforms);
};

var _updateBuiltInSlotTypeValuesFromConfig = function(slotType, slotTypeVar, config, skipExtendedValues, skipRegeneratingRegExp, skipTransformFunctions){
    let slotConfig = _getBuiltInSlotConfig(config, slotType);
    if(typeof skipExtendedValues === "undefined" || skipExtendedValues !== true){
        let extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
        if(typeof extendedValues !== "undefined"){
            recognizer.builtInValues[slotTypeVar].values = recognizer.builtInValues[slotTypeVar].values.concat(extendedValues);
        }
    }
    if(typeof skipRegeneratingRegExp === "undefined" || skipRegeneratingRegExp !== true){
        recognizer.builtInValues[slotTypeVar].replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues[slotTypeVar].values);
        recognizer.builtInValues[slotTypeVar].replacementRegExp = new RegExp(recognizer.builtInValues[slotTypeVar].replacementRegExpString, "ig");
    }
    if(typeof skipTransformFunctions === "undefined" || skipTransformFunctions !== true){
        if(typeof slotConfig !== "undefined" && slotConfig !== null){
            recognizer.builtInValues.US_FIRST_NAME.transformSrcFilename = slotConfig.transformSrcFilename;
        }
    }
};

//TODO remove duplicate copies of this and move them to a common js file later
// NOT IN MATCH
// USED IN GENERATE
// USED IN EXPORTED
var _getBuiltInSlotTypeSuffix = function(slotType){
    return slotType.replace(/^AMAZON\./, '').replace(/^TRANSCEND\./, '');
};

//TODO remove duplicate copies of this and move them to a common js file later
// NOT IN MATCH
// USED IN GENERATE
// USED IN EXPORTED
var _isBuiltInSlotType = function(slotType){
    if(slotType.startsWith("AMAZON.") || slotType.startsWith("TRANSCEND.")){
        return true;
    }
    return false;
};

var getSimpleRegExpForBuiltInSlotType = function(slotType, slotFlags){
    if(_isBuiltInSlotType(slotType) === false){
        return;
    }
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
        // number are used in cases of names like John the 1st
        return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    let suffix = _getBuiltInSlotTypeSuffix(slotType);
//    console.log("getSimpleRegExpForBuiltInSlotType, suffix: <" + suffix + ">");
//    console.log("getSimpleRegExpForBuiltInSlotType, returning: " + recognizer.builtInValues[suffix].replacementRegExpString);
    return recognizer.builtInValues[suffix].replacementRegExpString;
};

var _generateRunTimeJson = function(config, interactionModel, intents, utterances, optimizations){
    if(typeof config === "undefined" || config === null){
        config = {};
    }
    _scanIntentsAndSlotsForPlatform(config, intents, utterances);

//  console.log("_generateRunTimeJson, config: ", JSON.stringify(config));
//  console.log("_generateRunTimeJson, intents: ", JSON.stringify(intents));
//  console.log("_generateRunTimeJson, utterances: ", JSON.stringify(utterances));
    // First, extend the built in slot values with values from config
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.US_FIRST_NAME", "US_FIRST_NAME", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Actor", "Actor", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Comic", "Comic", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Dessert", "Dessert", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.LandmarksOrHistoricalBuildings", "LandmarksOrHistoricalBuildings", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Landform", "Landform", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MovieSeries", "MovieSeries", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MovieTheater", "MovieTheater", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MusicAlbum", "MusicAlbum", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Musician", "Musician", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MusicRecording", "MusicRecording", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MusicVenue", "MusicVenue", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MusicVideo", "MusicVideo", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Person", "Person", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MusicGroup", "MusicGroup", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MusicEvent", "MusicEvent", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Movie", "Movie", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MedicalOrganization", "MedicalOrganization", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Organization", "Organization", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.LocalBusinessType", "LocalBusinessType", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.LocalBusiness", "LocalBusiness", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Game", "Game", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.FoodEstablishment", "FoodEstablishment", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.FictionalCharacter", "FictionalCharacter", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Festival", "Festival", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.EducationalOrganization", "EducationalOrganization", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Director", "Director", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.CivicStructure", "CivicStructure", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.BroadcastChannel", "BroadcastChannel", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.BookSeries", "BookSeries", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Book", "Book", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Author", "Author", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Professional", "Professional", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Residence", "Residence", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.ScreeningEvent", "ScreeningEvent", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Service", "Service", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.SoftwareApplication", "SoftwareApplication", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.SoftwareGame", "SoftwareGame", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.SocialMediaPlatform", "SocialMediaPlatform", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.SportsEvent", "SportsEvent", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.TVEpisode", "TVEpisode", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.TVSeason", "TVSeason", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.TVSeries", "TVSeries", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.VideoGame", "VideoGame", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Athlete", "Athlete", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.AdministrativeArea", "AdministrativeArea", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Room", "Room", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Color", "Color", config);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Country", "Country", config);
    // Don't update the values from the config files for these slot types and don't regenerate the regexp
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.US_PRESIDENT", "US_PRESIDENT", config, true, true);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.US_STATE", "US_STATE", config, true, true);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Airline", "Airline", config, true, true);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.SportsTeam", "SportsTeam", config, true, true);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Corporation", "Corporation", config, true, true);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Airport", "Airport", config, true, true);
    // Don't update the values from the config files for these slot types
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Month", "Month", config, true);
    _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.DayOfWeek", "DayOfWeek", config, true);

    let recognizerSet = {};
    recognizerSet.platform = config.platform;

    if(typeof config !== "undefined" && typeof config.customSlotTypes !== "undefined"){
        recognizerSet.customSlotTypes = config.customSlotTypes;
        // Iterate over all the values and create a corresponding array of match
        // regular expressions so that the exact value is returned rather than what
        // was passed in, say from Cortana.  This is needed because Alexa respects
        // capitalization, etc, while Cortana gratuitously capitalizes first letters
        // and adds periods and other punctuations at the end.
        for(let i = 0; i < recognizerSet.customSlotTypes.length; i++){
            let scratchCustomSlotType = recognizerSet.customSlotTypes[i];
            scratchCustomSlotType.regExpStrings = [];
            if(typeof scratchCustomSlotType.customRegExpString === "string" && scratchCustomSlotType.customRegExpString.length > 0){
              // TODO add customRegExp handling
              scratchCustomSlotType.regExpStrings.push("(?:^\\s*" +  scratchCustomSlotType.customRegExpString + "\\s*$){1}");
            }
            else {
              for(let j = 0; j < scratchCustomSlotType.values.length; j++){
                scratchCustomSlotType.regExpStrings.push("(?:^\\s*(" +  scratchCustomSlotType.values[j] + ")\\s*$){1}");
              }
            }
        }
        // Now generate soundex equivalents so that we can match on soundex if the
        // regular match fails
        for(let i = 0; i < recognizerSet.customSlotTypes.length; i++){
            let scratchCustomSlotType = recognizerSet.customSlotTypes[i];
            scratchCustomSlotType.soundExValues = [];
            scratchCustomSlotType.soundExRegExpStrings = [];
            if(typeof scratchCustomSlotType.customRegExpString === "string" && scratchCustomSlotType.customRegExpString.length > 0){
              // TODO add customRegExp handling
            }
            else {
              for(let j = 0; j < scratchCustomSlotType.values.length; j++){
                let soundexValue = soundex.simple.soundEx(scratchCustomSlotType.values[j], " ");
                scratchCustomSlotType.soundExValues.push(soundexValue);
                let soundexRegExpString = soundex.simple.soundEx(scratchCustomSlotType.values[j], "\\s+");
                scratchCustomSlotType.soundExRegExpStrings.push("(?:^\\s*(" +  soundexRegExpString + ")\\s*){1}");
              }
            }
        }
    }
    recognizerSet.matchConfig = [];

    let passThrougFunc = function(slotType, flags, stage){
        return _getReplacementRegExpStringGivenSlotType(slotType, config, flags, stage);
    };

    // First process all the utterances
    // keep track of all the built in slot types used by utterances so that they can be added to the recognizerSet
    let builtInSlotTypesUsedByUtterances = [];
    for(let i = 0; i < utterances.length; i ++){
        if(utterances[i].trim() === ""){
            continue;
        }
        let result = parser.parseUtteranceIntoJson(utterances[i], intents);
        parser.cleanupParsedUtteranceJson(result, intents);

        parser.addRegExps(result, intents, passThrougFunc, optimizations);

        let currentValue = {};
        currentValue.slots = [];

        for(let j = 0; j < result.parsedUtterance.length; j ++){
            if(result.parsedUtterance[j].type !== "slot"){
                continue;
            }
            let parsedSlot = result.parsedUtterance[j];
            let translatedSlotType = _getTranslatedSlotTypeForInternalLookup(parsedSlot.slotType);
            if(_isBuiltInSlotType(translatedSlotType) && builtInSlotTypesUsedByUtterances.indexOf(translatedSlotType) < 0){
                builtInSlotTypesUsedByUtterances.push(translatedSlotType);
            }
            let slotToPush = {"name": parsedSlot.name, "type": parsedSlot.slotType, "flags": parsedSlot.flags};
            let slotTypeTransformSrcFilename = _getSlotTypeTransformSrcFilename(config, parsedSlot.slotType);
            if(typeof slotTypeTransformSrcFilename !== "undefined"){
                slotToPush.transformSrcFilename = slotTypeTransformSrcFilename;
            }
            currentValue.slots.push(slotToPush);
        }

        currentValue.intent = result.intentName;
        currentValue.regExpStrings = result.regExpStrings;
        recognizerSet.matchConfig.push(currentValue);
    }
    // Now add builtin slot type info to the recognizerSet
    // Add number slot because it's needed even if it's not used directly
    if(builtInSlotTypesUsedByUtterances.indexOf("TRANSCEND.NUMBER") < 0){
        builtInSlotTypesUsedByUtterances.push("TRANSCEND.NUMBER");
    }
    recognizerSet.builtInSlotTypes = [];
    for(let i = 0; i < builtInSlotTypesUsedByUtterances.length; i++){
        let builtInSlotTypeSuffix = _getBuiltInSlotTypeSuffix(builtInSlotTypesUsedByUtterances[i]);
        let builtInSlotTypeValues = recognizer.builtInValues[builtInSlotTypeSuffix].values;
        let builtInSlotType = {
            "name": builtInSlotTypesUsedByUtterances[i],
            "values": builtInSlotTypeValues
        };
        recognizerSet.builtInSlotTypes.push(builtInSlotType);
    }
    // Now process all the built in intents.  Note that their triggering
    // utterances will NOT be part of "utterances" arg, but instead will be in config.
    recognizerSet.builtInIntents = [];
    let intentConfig;

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.CancelIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.CancelIntent",
            "utterances": [
                "cancel", "never mind", "forget it"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.HelpIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.HelpIntent",
            "utterances": [
                "help", "help me", "can you help me"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.LoopOffIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.LoopOffIntent",
            "utterances": [
                "loop off"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.LoopOnIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.LoopOnIntent",
            "utterances": [
                "loop", "loop on", "keep repeating this song"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.NextIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.NextIntent",
            "utterances": [
                "next", "skip", "skip forward"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.NoIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.NoIntent",
            "utterances": [
                "no", "no thanks"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.PauseIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.PauseIntent",
            "utterances": [
                "pause", "pause that"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.PreviousIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.PreviousIntent",
            "utterances": [
                "go back", "skip back", "back up"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.RepeatIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.RepeatIntent",
            "utterances": [
                "repeat", "say that again", "repeat that"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.ResumeIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.ResumeIntent",
            "utterances": [
                "resume", "continue", "keep going"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.ShuffleOffIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.ShuffleOffIntent",
            "utterances": [
                "stop shuffling", "shuffle off", "turn off shuffle"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.ShuffleOnIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.ShuffleOnIntent",
            "utterances": [
                "shuffle", "shuffle on", "shuffle the music", "shuffle mode"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.StartOverIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.StartOverIntent",
            "utterances": [
                "start over", "restart", "start again"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.StopIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.StopIntent",
            "utterances": [
                "stop", "off", "shut up"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    intentConfig = _getBuiltInIntentConfig(config, "TRANSCEND.YesIntent");
    if(_isBuiltInIntentEnabled(intentConfig)){
        let builtinIntent = {
            "name": "TRANSCEND.YesIntent",
            "utterances": [
                "yes", "yes please", "sure"
            ]
        };
        let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
        if(typeof extendedUtterances !== "undefined"){
            builtinIntent.utterances = builtinIntent.utterances.concat(extendedUtterances);
        }
        builtinIntent.regExpString = _makeFullRegExpString(builtinIntent.utterances);
        recognizerSet.builtInIntents.push(builtinIntent);
    }

    return recognizerSet;
};

recognizer.Recognizer.generateRunTimeJson = _generateRunTimeJson;
recognizer.Recognizer.prototype.generateRunTimeJson = _generateRunTimeJson;

recognizer.Recognizer.getReplacementRegExpStringGivenSlotType = _getReplacementRegExpStringGivenSlotType;
recognizer.Recognizer.prototype.getReplacementRegExpStringGivenSlotType = _getReplacementRegExpStringGivenSlotType;

var _getBuiltInSlotConfig = function(config, slotName){
    let scratchSlotName = _getBuiltInNameWithoutPlatform(slotName);
    if(typeof config !== "undefined" && Array.isArray(config.builtInSlots)){
        for(let i = 0; i < config.builtInSlots.length; i ++){
            let slotConfig = config.builtInSlots[i];
            if(_getBuiltInNameWithoutPlatform(slotConfig.name) === scratchSlotName){
                return slotConfig;
            }
        }
    }
    // Nothing found - return undefined
};

var _getSlotTypeTransformSrcFilename = function(config, slotType){
    if(typeof config.builtInSlots !== "undefined" && Array.isArray(config.builtInSlots)){
        for(let i = 0; i < config.builtInSlots.length; i++){
            let currentSlot = config.builtInSlots[i];
            if(currentSlot.name === slotType){
                return currentSlot.transformSrcFilename;
            }
        }
    }
    if(typeof config.customSlotTypes !== "undefined" && Array.isArray(config.customSlotTypes)){
        for(let i = 0; i < config.customSlotTypes.length; i++){
            let currentSlot = config.customSlotTypes[i];
            if(currentSlot.name === slotType){
                return currentSlot.transformSrcFilename;
            }
        }
    }
};

var _getBuiltInSlotExtendedValues = function(slotConfig){
    let returnValue;
    if(typeof slotConfig !== "undefined" && slotConfig !== null){
        if(typeof slotConfig.extendedValues !== "undefined"){
            returnValue = [].concat(slotConfig.extendedValues);
        }
        if(typeof slotConfig.extendedValuesFilename !== "undefined"){
            let loadedFromFile = utilities.loadStringListFromFile(slotConfig.extendedValuesFilename);
            if(typeof loadedFromFile !== "undefined" && Array.isArray(loadedFromFile)){
                if(typeof returnValue === "undefined"){
                    returnValue = [];
                }
                returnValue = returnValue.concat(loadedFromFile);
            }
        }
    }
    return returnValue;
};

var _getBuiltInIntentConfig = function(config, intentName){
    let scratchIntentName = _getBuiltInNameWithoutPlatform(intentName);

    if(typeof config !== "undefined" && Array.isArray(config.builtInIntents)){
        for(let i = 0; i < config.builtInIntents.length; i ++){
            let intentConfig = config.builtInIntents[i];
            if(_getBuiltInNameWithoutPlatform(intentConfig.name) === scratchIntentName){
                return intentConfig;
            }
        }
    }
    // Nothing found - return undefined
};

var _getBuiltInIntentExtendedUtterances = function(intentConfig){
    let returnValue;
    if(typeof intentConfig !== "undefined" && intentConfig !== null){
        if(typeof intentConfig.extendedUtterances !== "undefined"){
            returnValue = [].concat(intentConfig.extendedUtterances);
        }
        if(typeof intentConfig.extendedUtterancesFilename !== "undefined"){
            let loadedFromFile = utilities.loadStringListFromFile(intentConfig.extendedUtterancesFilename);
            if(typeof loadedFromFile !== "undefined" && Array.isArray(loadedFromFile)){
                if(typeof returnValue === "undefined"){
                    returnValue = [];
                }
                returnValue = returnValue.concat(loadedFromFile);
            }
        }
    }
    return returnValue;
};

var _isBuiltInIntentEnabled = function(intentConfig){
    if(typeof intentConfig !== "undefined" && (typeof intentConfig.enabled !== "undefined" && intentConfig.enabled === false)){
        return false;
    }
    return true;
};

var _getTranslatedSlotTypeForOutput = function(slotType, platformConfig){
    let periodIndex = slotType.indexOf('.');
    if(periodIndex < 0){
        return slotType;
    }
    let sansPlatform = slotType.substring(periodIndex);

    let scratch = platformConfig.output + sansPlatform;
    return scratch;
};

var _getBuiltInNameWithoutPlatform = function(name){
    let periodIndex = name.indexOf('.');
    if(periodIndex < 0){
        return name;
    }
    let sansPlatform = name.substring(periodIndex + 1);
    return sansPlatform;
};

/**
 * Call to determine whether a particular intent is a built in intent of the platform.
 * @param {string} intentName the name of the intent to check
 * @param {string[]} platforms for wich to perform the check
 * @return {string} returns the matching platform, if any, or undefined.  Note that
 * if the platforms parameter includes "ANY" and the intentName is for a platform
 * that is understood by this module, then it will be returned.  Also note that
 * only the platforms currently understood by this module will be returned.
 */
var _getBuiltinIntentPlatform = function(intentName, platforms){
    let periodIndex = intentName.indexOf('.');
    if(periodIndex < 0){
        return;
    }
    let platformPrefix = intentName.substring(0, periodIndex);
    if(allPlatforms.indexOf(platformPrefix) < 0){
        return;
    }
    // Here we have an acceptable platform.  Return it if it's in "platforms"
    // parameter or if platforms parameter contains "ANY"
    if(platforms.indexOf("ANY") > 0){
        return platformPrefix;
    }

    let scratch = platformPrefix + ".";
    if(intentName.startsWith(scratch)){
        return platformPrefix;
    }
};

/**
 * Call this to translate the slot from whatever type it was actually reported into
 * a "built in" equivalent
 */
// USED IN MATCH
// USED IN GENERATE
// TODO refactor out - currently in two places
var _getTranslatedSlotTypeForInternalLookup = function(slotType){
    let periodIndex = slotType.indexOf('.');
    if(periodIndex < 0){
        return slotType;
    }
    let sansPlatform = slotType.substring(periodIndex);

    let scratch = "TRANSCEND" + sansPlatform;
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

module.exports = recognizer;
