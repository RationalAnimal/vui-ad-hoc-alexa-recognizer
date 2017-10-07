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
var fs = require("fs");
var utilities = require("./utilities.js");
var parser = require("./parseutterance.js");

var usage = function(){
  console.log("Usage: node " + process.argv[1] + " <sampleutterance.txt>");
  console.log("  --interactionmodel InteractionModelFileName specify combined json file name of the file that has intents, utterances, custom slot values, prompts, and dialogs all in one.");
  console.log("  --utterances UtterancesFileName specify input utterances file name.");
  console.log("  --intents IntentsSchemaFileName specify intent schema file name used for slot name validation.");
  console.log("  --config ConfigFileName specify config file name used text equivalents loading.");
  console.log("  -o --output OutputFileName specify output utterances or interaction model file name.");
};
for(let i = 2; i < process.argv.length - 1; i += 2){
  let j = i + 1;
  if(process.argv[i] == "-i" || process.argv[i] == "--input" || process.argv[i] == "--utterances"){
    var inputFileName = process.argv[j];
  }
  else if(process.argv[i] == "-o" || process.argv[i] == "--output"){
    var outputFileName = process.argv[j];
  }
  else if(process.argv[i] == "--intents"){
    var intentsFileName = process.argv[j];
  }
  else if(process.argv[i] == "--config"){
    var configFileName = process.argv[j];
  }
  else if(process.argv[i] == "--interactionmodel"){
    var interactionModelFileName = process.argv[j];
  }
}
var interactionModel;
if(typeof interactionModelFileName != "undefined"){
  try {
    interactionModel = require(interactionModelFileName);
  }
  catch(e){
    try{
      interactionModel = require("./" + interactionModelFileName);
    }
    catch(e2){
      console.log("Unable to load InteractionModel file.");
      usage();
      process.exit(1);
    }
  }
}

if((typeof interactionModelFileName === "undefined" && (typeof inputFileName === "undefined" || typeof intentsFileName === "undefined")) || typeof outputFileName === "undefined" || typeof configFileName === "undefined"){
  usage();
  process.exit(1);
}

if(typeof interactionModelFileName !== "undefined" && (typeof inputFileName !== "undefined" || typeof intentsFileName !== "undefined")){
  console.log("Must use either --interactionmodel argument OR the pair of --intents and --input, but NOT both.");
  usage();
  process.exit(1);
}

var transformTranscendNativeType = function(nativeType){
  return nativeType.replace(/^TRANSCEND./, "TRANSCEND__");
};

var cleanupInteractionModel = function(interactionModel){
  let returnValue = {};
  returnValue.intents = [];
  let intents = interactionModel.intents;
  let transcendSlotTypesToAdd = [];
  for(let i = 0; i < intents.length; i ++){
    let inputIntent = intents[i];
    let outputIntent = {"name":inputIntent.name, "samples":[], "slots":[]};
    let oldStyleIntent = {"intent":inputIntent.name, "slots":[]};
    for(let j = 0; typeof inputIntent.slots !== "undefined" && j < inputIntent.slots.length; j ++){
      oldStyleIntent.slots.push({"name":inputIntent.slots[j].name, "type":inputIntent.slots[j].type});
    }
    let oldStyleIntentSchema = {"intents":[oldStyleIntent]};
    // Now that we've constructed the old style schema for use in the parser functions, unfold all the samples (i.e. utterances)
    for(let j = 0; j < inputIntent.samples.length; j ++){
      let result = parser.parseUtteranceIntoJson(inputIntent.name + " " + inputIntent.samples[j], oldStyleIntentSchema);
      parser.cleanupParsedUtteranceJson(result, oldStyleIntentSchema);
      let unfoldedResultArray = parser.unfoldParsedJson(result, false);

      for(let k = 0; k < unfoldedResultArray.length; k++){
        outputIntent.samples.push(unfoldedResultArray[k]);
      }
    }
    // Scan all slot types and see if there are any TRANSCEND native types (e.g. President).  If so,
    // add them as "custom" types to the end.  Else if there are TRANSCEND equivalents to AMAZON change them to AMAZON.
    for(let j = 0; typeof inputIntent.slots != "undefined" && j < inputIntent.slots.length; j ++){
      if(inputIntent.slots[j].type === "TRANSCEND.US_PRESIDENT"){
        if(transcendSlotTypesToAdd.indexOf(inputIntent.slots[j].type) < 0) {
          transcendSlotTypesToAdd.push(inputIntent.slots[j].type);
        }
        outputIntent.slots.push({"name": inputIntent.slots[j].name, "type": transformTranscendNativeType(inputIntent.slots[j].type), "samples": []});
      }
      else {
        let scratchSlotType = inputIntent.slots[j].type.replace(/^TRANSCEND./, "AMAZON.");
        outputIntent.slots.push({"name": inputIntent.slots[j].name, "type": scratchSlotType, "samples": []});
      }
      // Now process all slot specific "samples"
      if(typeof inputIntent.slots[j].samples != "undefined"){
        for(let k = 0; k < inputIntent.slots[j].samples.length; k ++){
          let result = parser.parseUtteranceIntoJson(inputIntent.name + " " + inputIntent.slots[j].samples[k], oldStyleIntentSchema);
          parser.cleanupParsedUtteranceJson(result, oldStyleIntentSchema);
          let unfoldedResultArray = parser.unfoldParsedJson(result, false);

          for(let l = 0; l < unfoldedResultArray.length; l++){
            outputIntent.slots[outputIntent.slots.length - 1].samples.push(unfoldedResultArray[l]);
          }
        }
      }
    }
    returnValue.intents.push(outputIntent);
  }
  // Now add any custom types
  returnValue.types = [];
  if(transcendSlotTypesToAdd.indexOf("TRANSCEND.US_PRESIDENT") >= 0){
    let scratchType = {"name":transformTranscendNativeType("TRANSCEND.US_PRESIDENT"), "values":[]};
    let presidents = require("./builtinslottypes/uspresidents.json");
    for(let i = 0; i < presidents.values.length; i ++){
      scratchType.values.push({"name": {"value": presidents.values[i].name}});
    }
    returnValue.types.push(scratchType);
  }
  // Copy the rest of the custom types from the input to output.
  let inputTypes = interactionModel.types;
  if(typeof inputTypes != "undefined" && Array.isArray(inputTypes)){
    for(let i = 0; i < inputTypes.length; i ++){
      let scratchType = JSON.parse(JSON.stringify(inputTypes[i]));
      returnValue.types.push(scratchType);
    }
  }
  // Copy prompts from input to output without processing
  let prompts = interactionModel.prompts;
  if(typeof prompts != "undefined" && Array.isArray(prompts)){
    returnValue.prompts = JSON.parse(JSON.stringify(prompts));
  }
  // Copy dialog from input to output without processing
  let dialog = interactionModel.dialog;
  if(typeof dialog != "undefined"){
    returnValue.dialog = JSON.parse(JSON.stringify(dialog));
  }
  //  console.log("returnValue: ", JSON.stringify(returnValue, null, 2));
  return returnValue;
};

if(typeof interactionModel != "undefined"){
  let cleanedUpModel = cleanupInteractionModel(interactionModel);
  let file = fs.createWriteStream(outputFileName);
  file.on("error", function(error) { console.log("Encountered an error trying to alexify interaction model: ", error);});
  file.write(JSON.stringify(cleanedUpModel, null, 2));
  file.end(function(){console.log("Result was saved to " + outputFileName);});
}
else {
  var values = utilities.loadStringListFromFile(inputFileName);
  var parsedUtterances = [];

  let intentSchema;
  try{
    intentSchema = require(intentsFileName);
  }
  catch(e){
    try{
      intentSchema = require("./" + intentsFileName);
    }
    catch(e2){
      console.log("Unable to load IntentsSchema file.");
      usage();
      process.exit(1);
    }
  }


  for(let i = 0; i < values.length; i ++){
    let result = parser.parseUtteranceIntoJson(values[i], intentSchema);
    parser.cleanupParsedUtteranceJson(result, intentSchema);
    let unfoldedResultArray = parser.unfoldParsedJson(result, true);

    for(let j = 0; j < unfoldedResultArray.length; j++){
      parsedUtterances.push(unfoldedResultArray[j]);
    }
  }

  var file = fs.createWriteStream(outputFileName);
  file.on("error", function(error) { console.log("Encountered an error trying to write out alexified output: ", error);});
  for(let i = 0; i < parsedUtterances.length; i++){
    file.write(parsedUtterances[i] + "\n");
  }
  file.end(function(){console.log("Result was saved to " + outputFileName);});
}


