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

let _responderFunction = function(match, stateAccessor, selectorArray){
//  console.log("START of logging from customresponderfunction.js");
//  console.log("intent:", JSON.stringify(intent));
//  console.log("stateAccessor:", JSON.stringify(stateAccessor));
//  console.log("selectorArray:", JSON.stringify(selectorArray));
//  console.log("END of logging from customresponderfunction.js");
  let intent = match.name;
  if(intent === "GreetingIntent"){
    try{
      stateAccessor.mergeReplaceState(selectorArray, {"customfunctionmodulewasrun": "true"});
    }
    catch(e){
      console.log("caught e: ", e);
    }
    return {
      "text": "Hi from the custom function module"
    };
  }
};

module.exports = _responderFunction;
