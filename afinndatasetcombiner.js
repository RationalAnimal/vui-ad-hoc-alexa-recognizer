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
let fs = require("fs");// eslint-disable-line no-unused-vars

let usage = function(){
  console.log("Usage: node " + process.argv[1] + " <sampleutterance.txt>");
  console.log("  -i --input InputFileNames - specify a list of input file names.");
  console.log("  -o --output OutputFileName specify output combined file name.");
  console.log("  --suppressResultDisplay does not send the output file contents to console");
};

let parsingFiles = "none";
let inputFileNames = [];
let outputFileName;
let continueProcessing = true;
let suppressResultDisplay = false;
for(let i = 2; i < process.argv.length; i ++){
  if(process.argv[i] === "-i" || process.argv[i] === "--input"){
    parsingFiles = "input";
  }
  else if(process.argv[i] === "-o" || process.argv[i] === "--output"){
    parsingFiles = "output";
  }
  else if(process.argv[i] === "--suppressResultDisplay"){
    suppressResultDisplay = true;
  }
  else {
    switch(parsingFiles){
    case "input":
      inputFileNames.push(process.argv[i]);
      break;
    case "output":
      outputFileName = process.argv[i];
      break;
    default:
      console.log("Please confirm the arguments");
      usage();
      continueProcessing = false;
      break;
    }
  }
}

if(typeof outputFileName === "undefined" || inputFileNames.length === 0){
  console.log("You need to specify the output file name");
  usage();
  continueProcessing = false;
}
let dataSet = {"scoredWords": []};
if(continueProcessing){
  for(let i = 0; i < inputFileNames.length; i++){
    let scratchDataSet = require(inputFileNames[i]);
    dataSet.scoredWords = dataSet.scoredWords.concat(scratchDataSet.scoredWords);
  }

  // Pre-compute word count to improve performance
  for(let i = 0; i < dataSet.scoredWords.length; i++){
    let split = dataSet.scoredWords[i].word.split(/\s+/);
    dataSet.scoredWords[i].wordCount = split.length;
  }

  // Sort the array by how many words are in a "word", then the "word" itself, in descending order
  dataSet.scoredWords.sort(
    function(a,b){
      if(a.wordCount === b.wordCount){
        if (a.word < b.word){
          return 1;
        }
        else if (a.word > b.word){
          return -1;
        }
        else {
          // This should never happen here, but technically is possible.
          return 0;
        }
      }
      if(a.word.startsWith(b.word)){
        return -1;
      }
      if(b.word.startsWith(a.word)){
        return 1;
      }
      return (b.wordCount - a.wordCount);
    }
  );

  // Remove duplicated words
  for(let i = 0; i < dataSet.scoredWords.length - 1; i++){
    if(dataSet.scoredWords[i].word === dataSet.scoredWords[i+1].word){
      dataSet.scoredWords.splice(i, 1);
      i--;
    }
  }

  let _done = function(json){
    if(suppressResultDisplay === false){
      console.log(JSON.stringify(json, null, 2));
    }
    console.log("Was saved to " + outputFileName);
  };

  fs.writeFile(outputFileName, JSON.stringify(dataSet), "utf8", _done(dataSet));
}
