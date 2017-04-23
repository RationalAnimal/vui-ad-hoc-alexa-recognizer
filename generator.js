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
var readline = require('readline');
var recognizer = require('./index.js');
var utilities = require('./utilities.js')

var defaultCortanaConfig = {
  "AMAZON.HelpIntent": {
    "generate": true,
    "utterances": ["help", "help."]
  }
};

var usage = function(){
  console.log('Usage: node ' + process.argv[1] + ':');
  console.log('  -c --config ConfigFileName specify configuration file name, optional.  If not specified default values are used.');
  console.log('  -i --intents IntentsFileName specify intents file name, required.  There is no point in using this without specifying this file.');
  console.log('  -u --utterances UtterancesFileName specify utterances file name, optional.  This is "optional" only in the sense that it CAN be omitted, but in practice it is required.  There only time you would invoke this function without an utterance file argument is if your skill generates only build in intents, which would make it rather useless.');
}
// Make sure we got all the arguments on the command line.
if (process.argv.length < 4) {
  usage();
  process.exit(1);
}
for(var i = 2; i < process.argv.length - 1; i += 2){
  var j = i + 1;
  if(process.argv[i] == "-c" || process.argv[i] == "--config"){
    var configFileName = process.argv[j];
  }
  else if(process.argv[i] == "-i" || process.argv[i] == "--intents"){
    var intentsFileName = process.argv[j];
  }
  else if(process.argv[i] == "-u" || process.argv[i] == "--utterances"){
    var utterancesFileName = process.argv[j];
  }
}
var config;
if(typeof configFileName == "undefined"){
  config = defaultCortanaConfig;
}
else {
  try {
    config = require(configFileName);
  }
  catch(e){
    config = require("./" + configFileName);
  }
}
// Now crawl over the config and load any custom slot values where they have
// been specified via file name rather than directly.
if(Array.isArray(config.customSlotTypes)){
  for(var i = 0; i < config.customSlotTypes.length; i++){
    var customSlotType = config.customSlotTypes[i];
    if(typeof customSlotType.filename != "undefined"){
      var values = utilities.loadStringListFromFile(customSlotType.filename);
      if(typeof values != "undefined"){
        customSlotType.values = values;
      }
    }
  }
}
if(typeof intentsFileName == "undefined"){
  usage();
  process.exit(1);
}
try {
  var intents = require(intentsFileName);
}
catch(e){
  var intents = require("./" + intentsFileName);
}
var utterances = [];
var doTheProcessing = function(){
  return recognizer.Recognizer.generateRunTimeJson(config, intents, utterances);
}
var resultJson;
if(typeof utterancesFileName != "undefined"){
  var utterancesExist = false;
  if (fs.existsSync(utterancesFileName)) {
    // The file name exists and is complete
    utterancesExist = true;
  }
  else if(fs.existsSync("./" + utterancesFileName)){
    // Need to prepend "./"
    utterancesFileName = "./" + utterancesFileName;
    utterancesExist = true;
  }
  if(utterancesExist == true){
    var rd = readline.createInterface({
        input: fs.createReadStream(utterancesFileName),
//        output: process.stdout,
        console: false
    });

    rd.on('line', function(line) {
      utterances.push(line);
    });
    rd.on('close', function(line) {
      resultJson = doTheProcessing();
      fs.writeFile('recognizer.json', JSON.stringify(resultJson), 'utf8', _done(resultJson));
//      fs.writeFile('recognizer.json', JSON.stringify(resultJson, null, 2), 'utf8', _done(resultJson));
    });
  }
}
else {
  resultJson = doTheProcessing();
  fs.writeFile('recognizer.json', JSON.stringify(resultJson), 'utf8', _done(resultJson));
//  fs.writeFile('recognizer.json', JSON.stringify(resultJson, null, 2), 'utf8', _done(resultJson));
}
var _done = function(json){
  console.log(JSON.stringify(resultJson, null, 2));
  console.log("Was saved to recognizer.json");
}
