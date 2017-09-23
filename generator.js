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
var recognizer = require('./generatorsupport.js');
var utilities = require('./utilities.js')

var defaultCortanaConfig = {
  "AMAZON.HelpIntent": {
    "generate": true,
    "utterances": ["help", "help."]
  }
};

var usage = function(){
  console.log('Usage: node ' + process.argv[1] + ':');
  console.log('  --sourcebase BaseSourceDirectory that is the base for the other file references on the command line or in the config file');
  console.log('  --interactionmodel InteractionModelFileName specify combined json file name of the file that has intents, utterances, custom slot values, prompts, and dialogs all in one.');
  console.log('  --config ConfigFileName specify configuration file name, optional.  If not specified default values are used.');
  console.log('  --intents IntentsFileName specify intents file name, required.  There is no point in using this without specifying this file.');
  console.log('  --utterances UtterancesFileName specify utterances file name, optional.  This is "optional" only in the sense that it CAN be omitted, but in practice it is required.  There only time you would invoke this function without an utterance file argument is if your skill generates only build in intents, which would make it rather useless.');
  console.log('  --optimizations [SINGLE-STAGE] optional. SINGLE-STAGE means no pre-matches using wildcards.  Depending on the recognizer, this may be slower or faster');
};

var optimizations = {"multistage": true};
for(var i = 2; i < process.argv.length - 1; i += 2){
  var j = i + 1;
  if(process.argv[i] == "-c" || process.argv[i] == "--config"){
    var configFileName = process.argv[j];
  }
  else if(process.argv[i] == "-s" || process.argv[i] == "--sourcebase"){
    var baseSourceDirectory = process.argv[j];
  }
  else if(process.argv[i] == "-i" || process.argv[i] == "--intents"){
    var intentsFileName = process.argv[j];
  }
  else if(process.argv[i] == "-u" || process.argv[i] == "--utterances"){
    var utterancesFileName = process.argv[j];
  }
  else if(process.argv[i] == "--interactionmodel"){
    var interactionModelFileName = process.argv[j];
  }
  else if(process.argv[i] === "--optimizations" && process.argv[j] === 'SINGLE-STAGE'){
    optimizations.multistage = false;
  }
}

if(typeof interactionModelFileName != "undefined" && (typeof utterancesFileName != "undefined" || typeof intentsFileName != "undefined")){
  console.log("Must use either --interactionmodel argument OR the pair of --intents and --utterances, but NOT both.");
  usage();
  process.exit(1);
}

if(typeof interactionModelFileName == "undefined" && typeof intentsFileName == "undefined"){
  console.log("Must use either --interactionmodel argument or --intents argument.");
  usage();
  process.exit(1);
}

var interactionModel;
if(typeof interactionModelFileName != "undefined"){
  try {
    interactionModel = require(interactionModelFileName);
  }
  catch(e){
    try {
      interactionModel = require("./" + interactionModelFileName);
    }
    catch(e2){
      console.log("Unable to load InteractionModel file.");
      usage();
      process.exit(1);
    }
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
    try{
      config = require("./" + configFileName);
    }
    catch(e2){
      console.log("Unable to load Configuration file.");
      usage();
      process.exit(1);
    }
  }
}
var intents = [];
if(typeof intentsFileName != "undefined"){
  try {
    var intents = require(intentsFileName);
  }
  catch(e){
    try{
      var intents = require("./" + intentsFileName);
    }
    catch(e2){
      console.log("Unable to load Intents file.");
      usage();
      process.exit(1);
    }
  }
}

var utterances = [];
var doTheProcessing = function(){
  return recognizer.Recognizer.generateRunTimeJson(config, interactionModel, intents, utterances, optimizations);
}
var _done = function(json){
  console.log(JSON.stringify(resultJson, null, 2));
  console.log("Was saved to recognizer.json");
}

// Now crawl over the config and load any custom slot values where they have
// been specified via file name rather than directly.
if(Array.isArray(config.customSlotTypes)){
  for(let i = 0; i < config.customSlotTypes.length; i++){
    let customSlotType = config.customSlotTypes[i];
    if(typeof customSlotType.filename != "undefined"){
      let values = utilities.loadStringListFromFile(customSlotType.filename);
      if(typeof values != "undefined"){
        if(typeof customSlotType.values !== "undefined"){
          for(let j = 0; j < values.length; j++){
            if(customSlotType.values.indexOf(values[j]) < 0){
              customSlotType.values.push(values[j]);
            }
          }
        }
        else {
          customSlotType.values = values;
        }
      }
    }
    else if(typeof customSlotType.customRegExpString !== "undefined"){
      // Add the code to parse the customRegExpString and add it to the customSlotType
      // TODO add customRegExp handling
    }
  }
}

var resultJson;
if(typeof utterancesFileName != "undefined"){
  utterances = utilities.loadStringListFromFile(utterancesFileName);
}
if(typeof interactionModel !== "undefined"){
  // Get the info from interactionModel
  if(typeof interactionModel.intents != "undefined"){
    for(let i = 0; i < interactionModel.intents.length; i ++){
      let intent = interactionModel.intents[i];
      let currentUtterances = [];
      // Add all the intent level utterances
      for(let j = 0; j < intent.samples.length; j ++){
        currentUtterances.push(intent.name + " " + intent.samples[j]);
      }
      let oldStyleIntent = {"intent":intent.name, "slots":[]};
      if(typeof intent.slots != "undefined"){
        for(let j = 0; j < intent.slots.length; j ++){
          // Add intent slot level utterance
          for(let k = 0; k < intent.slots[j].samples.length; k++){
            currentUtterances.push(intent.name + " " + intent.slots[j].samples[k]);
          }
          oldStyleIntent.slots.push({"name":intent.slots[j].name,"type":intent.slots[j].type});
        }
      }
      intents.push(oldStyleIntent);
    }
  }
  if(typeof interactionModel.types != "undefined"){
    for(let i = 0; i < interactionModel.types.length; i++){
      let currentSlotType = interactionModel.types[i];
      if(typeof config.customSlotTypes == "undefined"){
        config.customSlotTypes = [];
      }
      let customSlotType = undefined;
      // Find the custom slot type within the config
      for(let j = 0; j < config.customSlotTypes.length; j ++){
        if(config.customSlotTypes[j].name == currentSlotType.name){
          customSlotType = config.customSlotTypes[i];
          break;
        }
      }
      if(typeof customSlotType == "undefined"){
        customSlotType = {"name":currentSlotType.name, "values":[]};
        config.customSlotTypes.push(customSlotType);
      }
      if(typeof customSlotType.values == "undefined"){
        customSlotType.values = [];
      }
      // Now add all the missing values from the interactionModel's custom type to config's custom types
      for(let j = 0; j < currentSlotType.values.length; j ++){
        if(customSlotType.values.indexOf(currentSlotType.values[j] < 0)){
          customSlotType.values.push(currentSlotType.values[j].name.value);
        }
      }
    }
  }
}

resultJson = doTheProcessing();
fs.writeFile('recognizer.json', JSON.stringify(resultJson), 'utf8', _done(resultJson));
