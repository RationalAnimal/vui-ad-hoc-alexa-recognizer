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

var usage = function(){
  console.log('Usage: node ' + process.argv[1] + ' --domain <path to a domain> --state <path to state json');
  console.log('To exit type "EXIT"');
};

if (process.argv.length < 5) {
  usage();
  process.exit(1);
}

// Make sure we got all the arguments on the command line.
let domainPath;
let statePath;

for(let i = 2; i < process.argv.length; i += 2){
  let argSpecifier = process.argv[i];
  switch(argSpecifier){
    case "--domain":
      domainPath = process.argv[i + 1];
      break;
    case "--state":
      statePath = process.argv[i + 1];
      break;
    default:
      usage();
      process.exit(1);
  }
}

if(typeof domainPath === "undefined" || typeof statePath === "undefined"){
  usage();
  process.exit(1);
}

let domain;

try{
  domain = require(domainPath);
}
catch(e){
  try{
    domain = require("./" + domainPath);
  }
  catch(e2){
    console.log("Unable to load specified domain, error: " + e);
    usage();
    process.exit(1);
  }
}

let state;

try{
  state = require(statePath);
}
catch(e){
  try{
    state = require("./" + statePath);
  }
  catch(e2){
    console.log("Unable to load specified state, error: " + e);
    usage();
    process.exit(1);
  }
}

let stateAccessor;

try{
  stateAccessor = require("./builtinstateaccessors/basicstateaccessor.js");
}
catch(e){
  console.log("Unable to load basicstateaccessor.js, error: " + e);
  usage();
  process.exit(1);
}

let recognizer = require("./index.js");

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let recursiveUserInput = function (){
  rl.question('Please type user text: ', function (answer) {
    if (answer === 'EXIT'){
      return rl.close();
    }
    console.log('Your text was: "', answer, '"');
    let result = recognizer.Recognizer.matchDomain(answer, domain, stateAccessor, state);
    console.log('Domain response: ', JSON.stringify(result, null, 2));
    recursiveUserInput(); //Calling this function again to ask new question
  });
};

recursiveUserInput();
