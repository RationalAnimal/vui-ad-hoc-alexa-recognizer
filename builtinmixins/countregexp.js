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
 module.exports = function(standardArgs, customArgs){ // eslint-disable-line no-unused-vars
   let intentName;
   let utterance;
   let priorResult;
   if(typeof standardArgs !== "undefined"){
     intentName = standardArgs.intentName;
     utterance = standardArgs.utterance;
     priorResult = standardArgs.priorResult;
   }
   if(typeof priorResult === "undefined" && priorResult === null){
     return;
   }
   console.log("standardArgs: ", JSON.stringify(standardArgs));
   console.log("customArgs: ", JSON.stringify(customArgs));
   if(typeof customArgs !== "undefined" && typeof customArgs.regExpString === "string"){
     console.log("customArgs.regExpString: " + customArgs.regExpString);
     let regExp = new RegExp(customArgs.regExpString, "ig");
     let matchResult;
     let matchCount = 0;
     while(matchResult = regExp.exec(utterance)) {// eslint-disable-line no-cond-assign;
       matchCount ++;
     }
     if(matchCount > 0){
       priorResult.regExpMatch = {"regExp": customArgs.regExpString, "matchCount": matchCount};
     }
   }
 };
