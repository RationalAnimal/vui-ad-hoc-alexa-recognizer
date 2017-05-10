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
var utilities = require('./utilities.js')

var usage = function(){
  console.log('Usage: node ' + process.argv[1] + ' <sampleutterance.txt>');
  console.log('  -i --input UtterancesFileName specify input utterances file name.');
	console.log('  -o --output OutputFileName specify output utterances file name.');
}
// Make sure we got all the arguments on the command line.
if (process.argv.length < 6) {
  usage();
  process.exit(1);
}
for(let i = 2; i < process.argv.length - 1; i += 2){
  let j = i + 1;
  if(process.argv[i] == "-i" || process.argv[i] == "--input"){
    var inputFileName = process.argv[j];
  }
  else if(process.argv[i] == "-o" || process.argv[i] == "--output"){
    var outputFileName = process.argv[j];
  }
}

var _done = function(){
  console.log("Was saved to " + outputFileName);
}

var values = utilities.loadStringListFromFile(inputFileName);


for(let i = 0; i < values.length; i++){
  let slotRegExp = /\{(\w+)(?:[:]{1}(.*)){0,1}\}/ig;

	let slotMatchExecResult;
//	console.log("values[i]: " + values[i]);
	while(slotMatchExecResult = slotRegExp.exec(values[i])){
//		console.log("slotMatchExecResult " + JSON.stringify(slotMatchExecResult));
		values[i] = values[i].replace(slotMatchExecResult[0], "{" + slotMatchExecResult[1] + "}");
	}
//	console.log("values[i]: " + values[i]);
}

var file = fs.createWriteStream(outputFileName);
file.on('error', function(error) { /* add error handling here */ });
values.forEach(function(value) { file.write(value + '\n'); });
file.end(function(){console.log("Result was saved to " + outputFileName);});
