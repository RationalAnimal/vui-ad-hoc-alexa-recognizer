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
var parser = require('./parseutterance.js');
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

recognizer.builtInValues.US_PRESIDENT = require("./builtinslottypes/uspresidents.json");

recognizer.builtInValues.Airline = require("./builtinslottypes/airlines.json");

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

recognizer.builtInValues.Movie = require("./builtinslottypes/movies.json");
recognizer.builtInValues.Movie.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Movie.values);

recognizer.builtInValues.MedicalOrganization = require("./builtinslottypes/medicalorganizations.json");
recognizer.builtInValues.MedicalOrganization.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.MedicalOrganization.values);

recognizer.builtInValues.LocalBusinessType = require("./builtinslottypes/localbusinesstypes.json");
recognizer.builtInValues.LocalBusinessType.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.LocalBusinessType.values);

recognizer.builtInValues.LocalBusiness = require("./builtinslottypes/localbusinesses.json");
recognizer.builtInValues.LocalBusiness.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.LocalBusiness.values);

recognizer.builtInValues.Game = require("./builtinslottypes/games.json");
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
recognizer.builtInValues.Corporation.replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues.Corporation.values);

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
* Call this to translate the slot from whatever type it was actually reported into
* a "built in" equivalent
*/
var _getTranslatedSlotTypeForInternalLookup = function(slotType){
  let periodIndex = slotType.indexOf('.');
  if(periodIndex < 0){
    return slotType;
  }
  let sansPlatform = slotType.substring(periodIndex);

  let scratch = "TRANSCEND" + sansPlatform;
  return scratch;
}

var _getTranslatedSlotTypeForOutput = function(slotType, platformConfig){
  let periodIndex = slotType.indexOf('.');
  if(periodIndex < 0){
    return slotType;
  }
  let sansPlatform = slotType.substring(periodIndex);

  let scratch = platformConfig.output + sansPlatform;
  return scratch;
}

var _getTranslatedIntentForOutput = function(intent, platformConfig){
  let periodIndex = intent.indexOf('.');
  if(periodIndex < 0){
    return intent;
  }
  let sansPlatform = intent.substring(periodIndex);

  let scratch = platformConfig.output + sansPlatform;
  return scratch;
}

var _getBuiltInNameWithoutPlatform = function(name){
  let periodIndex = name.indexOf('.');
  if(periodIndex < 0){
    return name;
  }
  let sansPlatform = name.substring(periodIndex + 1);
  return sansPlatform;
}

var _hasFlag = function(flagName, flags){
  if(typeof flagName == "undefined" || typeof flags == "undefined" || Array.isArray(flags) == false){
    return false;
  }
  for(let i = 0; i < flags.length; i++){
    if(flags[i].name == flagName){
      return true;
    }
  }
  return false;
}

/**
* This is the new version meant to be used with the parseutterance.js
*/
var _getReplacementRegExpStringGivenSlotType = function(slotType, config, slotFlags){
  slotType = _getTranslatedSlotTypeForInternalLookup(slotType);
  if(slotType == "TRANSCEND.NUMBER"){
    // Ignore flags for now
    return recognizer.builtInValues.NUMBER.replacementRegExpString;
  }
  else if(slotType == "TRANSCEND.FOUR_DIGIT_NUMBER"){
    // Ignore flags for now
    return recognizer.builtInValues.FOUR_DIGIT_NUMBER.replacementRegExpString;
  }
  else if(slotType == "TRANSCEND.US_STATE"){
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
  else if(slotType == "TRANSCEND.US_PRESIDENT"){
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
  else if(slotType == "TRANSCEND.Airline"){
    // Ignore SOUNDEX_MATCH flag for now
    let hasWildCardMatch = false;
    let hasCountryFlag = false;
    let countries = [];
    let hasContinentFlag = false;
    let continents = [];
    let hasTypeFlag = false;
    let types = [];
    for(let i = 0; i < slotFlags.length; i++){
      if(slotFlags[i].name == "COUNTRY"){
        hasCountryFlag = true;
        countries = slotFlags[i].parameters;
      }
      else if(slotFlags[i].name == "CONTINENT"){
        hasContinentFlag = true;
        continents = slotFlags[i].parameters;
      }
      else if(slotFlags[i].name == "TYPE"){
        hasTypeFlag = true;
        types = slotFlags[i].parameters;
      }
      else if(slotFlags[i].name == "INCLUDE_WILDCARD_MATCH"){
        hasWildCardMatch = true;
      }
    }
    if(hasWildCardMatch){
      // numbers are used in cases of some names
      return "((?:\\w|\\s|[0-9])+)";
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
  else if(slotType == "TRANSCEND.US_FIRST_NAME"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // numbers are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.US_FIRST_NAME.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Actor"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Actor.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Artist"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Artist.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Comic"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Comic.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Dessert"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Dessert.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.LandmarksOrHistoricalBuildings"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.LandmarksOrHistoricalBuildings.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Landform"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Landform.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.MovieSeries"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.MovieSeries.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Movie"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Movie.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.MedicalOrganization"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.MedicalOrganization.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.LocalBusinessType"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.LocalBusinessType.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.LocalBusiness"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.LocalBusiness.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Game"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Game.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.FoodEstablishment"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.FoodEstablishment.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.FictionalCharacter"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.FictionalCharacter.replacementRegExpString;
    }
  }

  else if(slotType == "TRANSCEND.Festival"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Festival.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.EducationalOrganization"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.EducationalOrganization.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Director"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Director.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Corporation"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9]|\-)+)";
    }
    else {
      return recognizer.builtInValues.Corporation.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.CivicStructure"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.CivicStructure.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.BroadcastChannel"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.BroadcastChannel.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.BookSeries"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.BookSeries.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Book"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Book.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Author"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Author.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Athlete"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like John the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Athlete.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.AdministrativeArea"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      // number are used in cases of names like the 1st
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.AdministrativeArea.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.DATE"){
    return recognizer.builtInValues.DATE.replacementRegExpString;
  }
  else if(slotType == "TRANSCEND.TIME"){
    // Ignore flags for now
    return recognizer.builtInValues.TIME.replacementRegExpString;
  }
  else if(slotType == "TRANSCEND.DURATION"){
    // Ignore flags for now
    return recognizer.builtInValues.DURATION.replacementRegExpString;
  }
  else if(slotType == "TRANSCEND.Month"){
    // Ignore flags for now
    return recognizer.builtInValues.Month.replacementRegExpString;
  }
  else if(slotType == "TRANSCEND.DayOfWeek"){
    // Ignore flags for now
    return recognizer.builtInValues.DayOfWeek.replacementRegExpString;
  }
  else if(slotType == "TRANSCEND.Country"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Country.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Color"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      return "((?:\\w|\\s|[0-9])+)";
    }
    else {
      return recognizer.builtInValues.Color.replacementRegExpString;
    }
  }
  else if(slotType == "TRANSCEND.Room"){
    // Ignore SOUNDEX_MATCH flag for now
    if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
      return "((?:\\w|\\s|[0-9]|')+)";
    }
    else {
      return recognizer.builtInValues.Room.replacementRegExpString;
    }
  }

//  else if(slotType.startsWith("TRANSCEND.")){
//    // TODO add handling of other built in TRANSCEND/Amazon slot types, for now just return the value
//    return "((?:\\w|\\s|[0-9])+)";
//  }
  // Here we are dealing with custom slots.
  if(typeof config != "undefined" && Array.isArray(config.customSlotTypes)){
    for(var i = 0; i < config.customSlotTypes.length; i++){
      var customSlotType = config.customSlotTypes[i];
      if(customSlotType.name == slotType){
        if(_hasFlag("SOUNDEX_MATCH", slotFlags)){
          if(typeof customSlotType.replacementSoundExpRegExp == "undefined"){
            customSlotType.replacementSoundExpRegExp = _makeReplacementRegExpString(customSlotType.soundExValues);
          }
          // Returning wildcard match because the first pass will be on matching on anything, THEN matching on soundex values
          return "((?:\\w|\\s|[0-9])+)";
        }
        else if(_hasFlag("INCLUDE_WILDCARD_MATCH", slotFlags)){
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
    if(_hasFlag("SOUNDEX_MATCH", flags)){
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
      if(_hasFlag("EXCLUDE_YEAR_ONLY_DATES", flags)){
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

var _findExactCaseBuiltInValue = function(value, slotType, recognizerSet){
  let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, slotType);
  let scratchValue = value.toUpperCase();
  for(let i = 0; i < builtInSlotValues.length; i ++){
    if(builtInSlotValues[i].toUpperCase() == scratchValue){
      return builtInSlotValues[i];
    }
  }
  return value;
}

var _processMatchedSlotValueByType = function(value, slotType, flags, slot, intent, recognizerSet){
//  console.log("_processMatchedSlotValueByType, entered");
  slotType = _getTranslatedSlotTypeForInternalLookup(slotType);
//  console.log("_processMatchedSlotValueByType, 1, slotType: " + slotType + ", value: " + value);
  let returnValue = value;
  if(slotType == "TRANSCEND.NUMBER" || slotType == "TRANSCEND.FOUR_DIGIT_NUMBER"){
    returnValue = _processMatchedNumericSlotValue(value);
  }
  else if(slotType == "TRANSCEND.DATE"){
    returnValue =  _processMatchedDateSlotValue(value, flags);
  }
  else if(slotType == "TRANSCEND.TIME"){
    returnValue =  _processMatchedTimeSlotValue(value);
  }
  else if(slotType == "TRANSCEND.DURATION"){
    returnValue =  _processMatchedDurationSlotValue(value);
  }
  else if(slotType.startsWith("TRANSCEND.")){
    // already did returnValue = value;
    // Now need to match the capitalization
    if(slotType == "TRANSCEND.Airline"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.Airline");
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toUpperCase() == scratchValue){
          returnValue = builtInSlotValues[i].name;
          break;
        }
      }
    }
    else if(slotType == "TRANSCEND.US_STATE"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.US_STATE");
      let scratchValue = returnValue.toUpperCase();
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toUpperCase() == scratchValue){
          returnValue = builtInSlotValues[i].name;
          break;
        }
      }
    }
    else if(slotType == "TRANSCEND.US_PRESIDENT"){
      let builtInSlotValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.US_PRESIDENT");
      let scratchValue = returnValue.toLowerCase();
      for(let i = 0; i < builtInSlotValues.length; i ++){
        if(builtInSlotValues[i].name.toLowerCase() == scratchValue ||
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

var _matchText = function(stringToMatch, intentsSequence, excludeIntents, recognizerToUse){
  //  console.log("_matchText, 1");
    var recognizerSet;
    if(typeof recognizerToUse != "undefined" && recognizerToUse != null){
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
    if(typeof recognizerSet == "undefined"){
      throw {"error": recognizer.errorCodes.MISSING_RECOGNIZER, "message": "Unable to load recognizer.json"};
    }

  // First, correct some of Microsoft's "deviations"
  // Do this only if the number slot type is used
  let numberValues = _getBuiltInSlotValuesFromRecognizer(recognizerSet, "TRANSCEND.NUMBER");
  if(typeof numberValues != "undefined" && Array.isArray(numberValues)){
    // look for a $ followed by a number and replace it with the number followed by the word "dollars".
    let regExpString = "(\\$\\s*(?:\\s*";
    for(let i = 0; i < numberValues.length; i++){
      regExpString += "|" + numberValues[i];
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
    if(typeof scratch.regExpStrings != "undefined" && Array.isArray(scratch.regExpStrings)){
      for(let k = 0; k < scratch.regExpStrings.length; k ++){
        let scratchRegExpString = scratch.regExpStrings[k];
        let scratchRegExp = new RegExp(scratchRegExpString, "ig");
        if(k == (scratch.regExpStrings.length - 1)){
          // This is the final reg exp
          let matchResult;
          let slotValues = [];
          while(matchResult = scratchRegExp.exec(stringToMatch)){
            multistage: {
              if(matchResult != null){
                var returnValue = {};
                returnValue.name = scratch.intent;
                returnValue.slots = {};
                for(var j = 1; j < matchResult.length; j++){
                  var processedMatchResult = _processMatchedSlotValueByType(matchResult[j], scratch.slots[j - 1].type, scratch.slots[j - 1].flags, scratch.slots[j - 1].name, scratch.intent, recognizerSet);
                  if(typeof processedMatchResult == "undefined"){
                    // This means a multi-stage match, such as SOUNDEX_MATCH, has failed to match on a follow up stage.
                    // Treat it as a no match
                    break multistage;
                  }
                  returnValue.slots[scratch.slots[j - 1].name] = {"name": scratch.slots[j - 1].name, "value": processedMatchResult};
                }
                return returnValue;
              }
            }
          }

        }
        else {
          // This is a preliminary reg exp
          let scratchMatchResult = scratchRegExp.test(stringToMatch);
          if(scratchMatchResult){
            // we are good to try the real one.
          }
          else {
            // This is definitely not a match - continue
            break;
          }
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
      let outputName = _getTranslatedIntentForOutput(scratch.name, recognizerSet.platform);
//      returnValue.name = scratch.name;
      returnValue.name = outputName;
      returnValue.slots = {};
      return returnValue;
    }
  }

};

var allPlatforms = ["TRANSCEND", "AMAZON"];

var _scanIntentsAndSlotsForPlatform = function(config, intents, utterances){
  // If the config file specifies the input and output platform type(s) then
  // skip the parsing.
  let acceptedInputPlatforms = allPlatforms.concat(["ALL"]);
  let acceptedOutputPlatforms = allPlatforms.concat([]);
  if(typeof config == "undefined" || config == null){
    // TODO Add a separate constants file containing all the constants, including
    // error messages.
    throw {"error": "MISSING_CONFIG", "message": "Programmer error - no config passed in."};
  }
  if(typeof intents == "undefined" || config == null){
    // TODO Add a separate constants file containing all the constants, including
    // error messages.
    throw {"error": "MISSING_INTENTS", "message": "Programmer error - no utterances passed in."};
  }
  if(typeof utterances == "undefined" || config == null){
    // TODO Add a separate constants file containing all the constants, including
    // error messages.
    throw {"error": "MISSING_UTTERANCES", "message": "Programmer error - no utterances passed in."};
  }

  let outputSpecified = false;
  let inputsSpecified = false;
  if(typeof config.platform != "undefined" && config.platform != null){
    if(Array.isArray(config.platform.input) && config.platform.input.length > 0 && typeof config.platform.output == "string"){
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

  if(inputsSpecified == false){
    // Scan through intents looking for "platform" intents or slot types.
    let scannedInputs = [];

    if(typeof config.builtInIntents != "undefined" && config.builtInIntents != null){
      for(let i = 0; i < config.builtInIntents.length; i ++){
        let builtInIntent = config.builtInIntents[i];
        if(builtInIntent.enabled){
          let platform = _getBuiltinIntentPlatform(builtInIntent.name, acceptedInputPlatforms);
          if(typeof platform != "undefined" && platform != null && scannedInputs.indexOf(platform) < 0){
            scannedInputs.push(platform);
            inputsSpecified = true;
          }
        }
      }
    }

    if(typeof config.builtInSlots != "undefined" && config.builtInSlots != null){
      for(let i = 0; i < config.builtInSlots.length; i ++){
        let builtInSlot = config.builtInSlots[i];
        let platform = _getBuiltinSlotPlatform(builtInSlot.name, acceptedInputPlatforms);
        if(typeof platform != "undefined" && platform != null && scannedInputs.indexOf(platform) < 0){
          scannedInputs.push(platform);
          inputsSpecified = true;
        }
      }
    }
    if(typeof config.platform == "undefined" || config.platform == null){
      config.platform = {"input": []};
    }
    if(typeof config.platform.input == "undefined" || config.platform.input == null || Array.isArray(config.platform.input) ==  false){
      config.platform.input = [];
    }
    for(let i = 0; i < scannedInputs.length; i++){
      if(config.platform.input.indexOf(scannedInputs[i]) < 0){
        config.platform.input.push(scannedInputs[i]);
      }
    }
  }
  // Finally set the output if not already set.
  if(outputSpecified == false){
    config.platform.output = "AMAZON";
  }
  if(inputsSpecified == false){
    config.platform.input.push(config.platform.output);
  }
}

/**
Current implementation is indistiguishable from the intent version, so simply call it here.
*/
var _getBuiltinSlotPlatform = function(slotName, platforms){
  return _getBuiltinIntentPlatform(slotName, platforms);
}

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
  return;
}
var _updateBuiltInSlotTypeValuesFromConfig = function(slotType, slotTypeVar, config, skipExtendedValues, skipRegeneratingRegExp, skipTransformFunctions){
  let slotConfig = _getBuiltInSlotConfig(config, slotType);
  if(typeof skipExtendedValues == "undefined" || skipExtendedValues != true){
    let extendedValues = _getBuiltInSlotExtendedValues(slotConfig);
    if(typeof extendedValues != "undefined"){
      recognizer.builtInValues[slotTypeVar].values = recognizer.builtInValues[slotTypeVar].values.concat(extendedValues);
    }
  }
  if(typeof skipRegeneratingRegExp == "undefined" || skipRegeneratingRegExp != true){
    recognizer.builtInValues[slotTypeVar].replacementRegExpString = _makeReplacementRegExpString(recognizer.builtInValues[slotTypeVar].values);
    recognizer.builtInValues[slotTypeVar].replacementRegExp = new RegExp(recognizer.builtInValues[slotTypeVar].replacementRegExpString, "ig");
  }
  if(typeof skipTransformFunctions == "undefined" || skipTransformFunctions != true){
    if(typeof slotConfig != "undefined" && slotConfig != null){
      recognizer.builtInValues.US_FIRST_NAME.transformSrcFilename = slotConfig.transformSrcFilename;
    }
  }
}

//TODO remove duplicate copies of this and move them to a commont js file later
var _getBuiltInSlotTypeSuffix = function(slotType){
	return slotType.replace(/^AMAZON\./, '').replace(/^TRANSCEND\./, '');
}

//TODO remove duplicate copies of this and move them to a commont js file later
var _isBuiltInSlotType = function(slotType){
	if(slotType.startsWith("AMAZON.") || slotType.startsWith("TRANSCEND.")){
		return true;
	}
	return false;
}


var _generateRunTimeJson = function(config, intents, utterances){
  if(typeof config == "undefined" || config == null){
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
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Movie", "Movie", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.MedicalOrganization", "MedicalOrganization", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.LocalBusinessType", "LocalBusinessType", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.LocalBusiness", "LocalBusiness", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Game", "Game", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.FoodEstablishment", "FoodEstablishment", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.FictionalCharacter", "FictionalCharacter", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Festival", "Festival", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.EducationalOrganization", "EducationalOrganization", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Director", "Director", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Corporation", "Corporation", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.CivicStructure", "CivicStructure", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.BroadcastChannel", "BroadcastChannel", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.BookSeries", "BookSeries", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Book", "Book", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Author", "Author", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Athlete", "Athlete", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.AdministrativeArea", "AdministrativeArea", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Room", "Room", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Color", "Color", config);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Country", "Country", config);
  // Don't update the values from the config files for these slot types and don't regenerate the regexp
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.US_PRESIDENT", "US_PRESIDENT", config, true, true);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.US_STATE", "US_STATE", config, true, true);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Airline", "Airline", config, true, true);
  // Don't update the values from the config files for these slot types
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.Month", "Month", config, true);
  _updateBuiltInSlotTypeValuesFromConfig("TRANSCEND.DayOfWeek", "DayOfWeek", config, true);

  var recognizerSet = {};
  recognizerSet.platform = config.platform;

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
  
  let passThrougFunc = function(slotType, flags){
    return _getReplacementRegExpStringGivenSlotType(slotType, config, flags);
  }

  // First process all the utterances
  // keep track of all the built in slot types used by utterances so that they can be added to the recognizerSet
  let builtInSlotTypesUsedByUtterances = [];
  for(var i = 0; i < utterances.length; i ++){
    if(utterances[i].trim() == ""){
      continue;
    }
    let result = parser.parseUtteranceIntoJson(utterances[i], intents);
    parser.cleanupParsedUtteranceJson(result, intents);

    parser.addRegExps(result, intents, passThrougFunc);
    
    var currentValue = {};
    currentValue.slots = [];

    for(let j = 0; j < result.parsedUtterance.length; j ++){
      if(result.parsedUtterance[j].type != "slot"){
        continue;
      }
      let parsedSlot = result.parsedUtterance[j];
      let translatedSlotType = _getTranslatedSlotTypeForInternalLookup(parsedSlot.slotType);
      if(_isBuiltInSlotType(translatedSlotType) && builtInSlotTypesUsedByUtterances.indexOf(translatedSlotType) < 0){
        builtInSlotTypesUsedByUtterances.push(translatedSlotType);
      }
      let slotToPush = {"name": parsedSlot.name, "type": parsedSlot.slotType, "flags": parsedSlot.flags};
      let slotTypeTransformSrcFilename = _getSlotTypeTransformSrcFilename(config, parsedSlot.slotType);
      if(typeof slotTypeTransformSrcFilename != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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
    }
    let extendedUtterances = _getBuiltInIntentExtendedUtterances(intentConfig);
    if(typeof extendedUtterances != "undefined"){
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

recognizer.Recognizer.getReplacementRegExpStringGivenSlotType = _getReplacementRegExpStringGivenSlotType;
recognizer.Recognizer.prototype.getReplacementRegExpStringGivenSlotType = _getReplacementRegExpStringGivenSlotType;

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

var _getBuiltInSlotValuesFromRecognizer = function(recognizer, builtInSlotType){
  for(let i = 0; i < recognizer.builtInSlotTypes.length; i ++){
    if(recognizer.builtInSlotTypes[i].name == builtInSlotType){
      return recognizer.builtInSlotTypes[i].values;
    }
  }
  return;
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

var _getBuiltInSlotConfig = function(config, slotName){
  let scratchSlotName = _getBuiltInNameWithoutPlatform(slotName);
  if(typeof config != "undefined" && Array.isArray(config.builtInSlots)){
    for(let i = 0; i < config.builtInSlots.length; i ++){
      let slotConfig = config.builtInSlots[i];
      if(_getBuiltInNameWithoutPlatform(slotConfig.name) == scratchSlotName){
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
  let scratchIntentName = _getBuiltInNameWithoutPlatform(intentName);

  if(typeof config != "undefined" && Array.isArray(config.builtInIntents)){
    for(let i = 0; i < config.builtInIntents.length; i ++){
      let intentConfig = config.builtInIntents[i];
      if(_getBuiltInNameWithoutPlatform(intentConfig.name) == scratchIntentName){
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
