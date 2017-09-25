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

var soundex = {};
soundex.simple = {};
soundex.simple.digits = ["1", "2", "3", "4", "5", "6"];
soundex.simple.toRemove = ["a", "e", "i", "o", "u", "y"];
soundex.simple.one = ["b", "f", "p", "v"];
soundex.simple.two = ["c", "g", "j", "k", "q", "s", "x", "z"];
soundex.simple.three = ["d", "t"];
soundex.simple.five = ["m", "n"];

soundex.simple.soundEx = function (stringToConvert, separator, numberOfDigits) {
  if(typeof stringToConvert != "undefined" && stringToConvert.trim().length > 0){
    // First check if this string contains multiple values, if so - split them
    // and return space delimeted concatenation
    let subPartsArray = stringToConvert.split(/\s+/);
    if(subPartsArray.length > 1){
      let separatorToUse = separator;
      if(typeof separatorToUse == "undefined"){
        separatorToUse = " ";
      }
      let result = "";
      for(let i = 0; i < subPartsArray.length; i++){
        result += soundex.simple.soundEx(subPartsArray[i]);
        if(i < subPartsArray.length - 1){
          result += separatorToUse;
        }
      }
      result = result.trim();
      //			console.log("soundEx, 0, returning concatenated result: " + result);
      return result;
    }
    //		console.log("soundEx, 1, stringToConvert: " + stringToConvert);
    var firstLetter = stringToConvert.substring(0,1).toUpperCase();
    //		console.log("soundEx, 2, firstLetter: " + firstLetter);
    var arrayToConvert = stringToConvert.toLowerCase().split("");
    //		console.log("soundEx, 3, arrayToConvert: " + JSON.stringify(arrayToConvert));
    for(let i = 1; i < arrayToConvert.length; i++){
      //			console.log("soundEx, 4, i: " + i);
      let currentLetter = arrayToConvert[i];
      if(currentLetter == "h" || currentLetter == "w"){
        arrayToConvert.splice(i, 1);
        i--;
      }
    }
    //		console.log("soundEx, 5, arrayToConvert: " + JSON.stringify(arrayToConvert));
    for(let i = 0; i < arrayToConvert.length; i++){
      let currentLetter = arrayToConvert[i];
      //			console.log("soundEx, 6, arrayToConvert[" + i + "]: " + currentLetter);
      if(soundex.simple.one.indexOf(currentLetter) >= 0){
        //				console.log("soundEx, 7");
        arrayToConvert[i] = "1";
        continue;
      }
      if(soundex.simple.two.indexOf(currentLetter) >= 0){
        //				console.log("soundEx, 8");
        arrayToConvert[i] = "2";
        continue;
      }
      if(soundex.simple.three.indexOf(currentLetter) >= 0){
        //				console.log("soundEx, 9");
        arrayToConvert[i] = "3";
        continue;
      }
      if(currentLetter == "l"){
        //				console.log("soundEx, 10");
        arrayToConvert[i] = "4";
        continue;
      }
      if(soundex.simple.five.indexOf(currentLetter) >= 0){
        //				console.log("soundEx, 11");
        arrayToConvert[i] = "5";
        continue;
      }
      if(currentLetter == "r"){
        //				console.log("soundEx, 12");
        arrayToConvert[i] = "6";
        continue;
      }
    }
    //		console.log("soundEx, 12, arrayToConvert: " + JSON.stringify(arrayToConvert));
    for(let i = 0; i < arrayToConvert.length - 1; i++){
      if(soundex.simple.digits.indexOf(arrayToConvert[i]) >= 0 && arrayToConvert[i] == arrayToConvert[i + 1]){
        arrayToConvert.splice(i, 1);
        i--;
      }
    }
    //		console.log("soundEx, 13, arrayToConvert: " + JSON.stringify(arrayToConvert));
    for(let i = 1; i < arrayToConvert.length; i++){
      let currentLetter = arrayToConvert[i];
      //			console.log("soundEx, 13.1, currentLetter: " + JSON.stringify(currentLetter));
      if(soundex.simple.toRemove.indexOf(currentLetter) >= 0){
        //				console.log("soundEx, 13.2");
        arrayToConvert.splice(i, 1);
        i--;
        //				console.log("soundEx, 13.3, arrayToConvert: " + JSON.stringify(arrayToConvert));
      }
    }
    //		console.log("soundEx, 14, arrayToConvert: " + JSON.stringify(arrayToConvert));
    if(soundex.simple.digits.indexOf(arrayToConvert[0]) >= 0){
      arrayToConvert[0] = firstLetter;
    }
    let result = "";
    if(typeof numberOfDigits == "undefined"){
      numberOfDigits = 3;
    }
    else if(isNaN(numberOfDigits) == false){
      numberOfDigits = parseInt(numberOfDigits);
    }
    else {
      numberOfDigits = 3;
    }
    if(arrayToConvert.length >= numberOfDigits + 1){
      for(let i = 0; i <= numberOfDigits; i++){
        result += arrayToConvert[i];
      }
      //			console.log("soundEx, 15, result: " + JSON.stringify(result));
    }
    else {
      for(let i = 0; i < arrayToConvert.length; i++){
        result += arrayToConvert[i];
      }
      for(let i = arrayToConvert.length; i < arrayToConvert.length + numberOfDigits + 1; i++){
        result += "0";
      }
      result = result.substring(0, numberOfDigits + 1);
      //			console.log("soundEx, 16, result: " + JSON.stringify(result));
    }
    result = result.toUpperCase();
    //		console.log("soundEx, 17, result: " + JSON.stringify(result));
    return result;
  }
  //
  //	console.log("soundEx, 18, result: " + JSON.stringify(result));
  return "0000";
};

module.exports = soundex;
