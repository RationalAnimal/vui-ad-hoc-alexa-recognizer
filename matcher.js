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
let recognizer = require("./index.js");

let usage = function(){
  console.log("Usage: node " + process.argv[1] + " string to match" + " path_to_a_non-standard_recognizer");
};

// Make sure we got all the arguments on the command line.
if (process.argv.length < 3) {
  usage();
  process.exit(1);
}
let stringToMatch = process.argv[2];
let recognizerToUse;
let recognizerToUseFileName = process.argv[3];
if(typeof recognizerToUseFileName !== "undefined" && recognizerToUseFileName !== null){
  try{
    recognizerToUse = require(recognizerToUseFileName);
  }
  catch(e){
    console.log("failed to load a custom recognizer with this error: ", e);
  }
}
let doTheProcessing = function(){
  return recognizer.Recognizer.matchText(stringToMatch, undefined, undefined, recognizerToUse);
};
let result = doTheProcessing();
console.log(JSON.stringify(result, null, 2));
