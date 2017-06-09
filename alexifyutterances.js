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
var parser = require('./parseutterance.js');

var usage = function(){
  console.log('Usage: node ' + process.argv[1] + ' <sampleutterance.txt>');
  console.log('  -i --input UtterancesFileName specify input utterances file name.');
  console.log('  --intents IntentsSchemaFileName specify intent schema file name used for slot name validation.');
	console.log('  -o --output OutputFileName specify output utterances or interaction model file name.');
//  console.log('  --interactionmodel combined json file that has intents, utterances, and custom slot values all in one.');
}
for(let i = 2; i < process.argv.length - 1; i += 2){
  let j = i + 1;
  if(process.argv[i] == "-i" || process.argv[i] == "--input"){
    var inputFileName = process.argv[j];
  }
  else if(process.argv[i] == "-o" || process.argv[i] == "--output"){
    var outputFileName = process.argv[j];
  }
  else if(process.argv[i] == "--intents"){
    var intentsFileName = process.argv[j];
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
    interactionModel = require("./" + interactionModelFileName);
  }

}

if((typeof interactionModelFileName == "undefined" && (typeof inputFileName == "undefined" || typeof intentsFileName == "undefined")) || typeof outputFileName == "undefined"){
  usage();
  process.exit(1);
}

if(typeof interactionModelFileName != "undefined" && (typeof inputFileName != "undefined" || typeof intentsFileName != "undefined")){
  console.log("Must use either --interactionmodel argument OR the pair of --intents and --input, but NOT both.");
  usage();
  process.exit(1);
}

var transformTranscendNativeType = function(nativeType){
  return nativeType.replace(/^TRANSCEND./, "TRANSCEND__");
}

var cleanupInteractionModel = function(interactionModel){
  // TODO finish this.
  let returnValue = {};
  returnValue.intents = [];
  let intents = interactionModel.intents;
  let transcendSlotTypesToAdd = [];
  for(let i = 0; i < intents.length; i ++){
    let inputIntent = intents[i];
    let outputIntent = {"name":inputIntent.name, "samples":[], "slots":[]};
    let oldStyleIntent = {"intent":inputIntent.name, "slots":[]};
//    console.log("inputIntent: ", JSON.stringify(inputIntent, null, 2));
    for(let j = 0; typeof inputIntent.slots != "undefined" && j < inputIntent.slots.length; j ++){
      oldStyleIntent.slots.push({"name":inputIntent.slots[j].name, "type":inputIntent.slots[j].type});
    }
    let oldStyleIntentSchema = {"intents":[oldStyleIntent]};
    // Now that we've constructed the old style schema for use in the parser functions, unfold all the samples (i.e. utterances)
    for(let j = 0; j < inputIntent.samples.length; j ++){
//      console.log("before parseUtteranceIntoJson, inputIntent.samples[j]: " + inputIntent.samples[j]);
      let result = parser.parseUtteranceIntoJson(inputIntent.name + " " + inputIntent.samples[j], oldStyleIntentSchema);
//      console.log("before cleanupParsedUtteranceJson, inputIntent.samples[j]: " + inputIntent.samples[j]);
      parser.cleanupParsedUtteranceJson(result, oldStyleIntentSchema);
//      console.log("before unfoldParsedJson, inputIntent.samples[j]: " + inputIntent.samples[j] + ", result: ", JSON.stringify(result, null, 2));
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
    }
    returnValue.intents.push(outputIntent);
    // TODO finish this.

  }
  // Now add any custom types
  returnValue.types = [];
  if(transcendSlotTypesToAdd.indexOf("TRANSCEND.US_PRESIDENT") >= 0){
    let scratchType = {"name":transformTranscendNativeType("TRANSCEND.US_PRESIDENT"), "values":[]}
    let presidents = require('./builtinslottypes/uspresidents.json');
    for(let i = 0; i < presidents.values.length; i ++){
      scratchType.values.push({"name": {"value": presidents.values[i].name}});
    }
    returnValue.types.push(scratchType);
  }
  // Copy the rest of the custom types from the input to output.
  let inputTypes = interactionModel.types;
  for(let i = 0; i < inputTypes.length; i ++){
    let scratchType = JSON.parse(JSON.stringify(inputTypes[i]));
    returnValue.types.push(scratchType);
  }

  console.log("returnValue: ", JSON.stringify(returnValue, null, 2));
};

if(typeof interactionModel != "undefined"){
  cleanupInteractionModel(interactionModel);
  // TODO for now just exit, but remove this when done
  return;
}

var _done = function(){
  console.log("Was saved to " + outputFileName);
}

var values = utilities.loadStringListFromFile(inputFileName);
var parsedUtterances = [];

try{
  var intentSchema = require(intentsFileName);
}
catch(e){
  try{
    var intentSchema = require("./" + intentsFileName);
  }
  catch(e2){
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
file.on('error', function(error) { /* add error handling here */ });
for(let i = 0; i < parsedUtterances.length; i++){
  file.write(parsedUtterances[i] + '\n');
}
file.end(function(){console.log("Result was saved to " + outputFileName);});

