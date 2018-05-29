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
let fs = require("fs");
let recognizer = require("./generatorsupport.js");
let utilities = require("./utilities.js");
let jsonutilities = require("./jsonutilities.js");
let path = require("path");

let resultJson;

let defaultCortanaConfig = {
  "AMAZON.HelpIntent": {
    "generate": true,
    "utterances": ["help", "help."]
  }
};

let usage = function(){
  console.log("Usage: node " + process.argv[1] + ":");
  console.log("  --sourcebase BaseSourceDirectory that is the base for the other file references on the command line or in the config file.  This will be used for both build and run time source base unless overridden by other command line arguments.");
  console.log("  --buildtimesourcebase BuildTimeBaseSourceDirectory that is the base for the other file references on the command line or in the config file at build time.  Will override --sourcebase value for build time directory, if both are supplied");
  console.log("  --runtimesourcebase RunTimeBaseSourceDirectory that is the base for the other file references (e.g. in the config file) at run time.  Will override --sourcebase value for run time directory, if both are supplied");
  console.log("  --vuibase BaseVuiDirectory that is the location of vui-ad-hoc-alexa-recognizer.  This will be used for both build and run time vui base unless overridden by other command line arguments. Defaults to ./node_modules/vui-ad-hoc-alexa-recognizer");
  console.log("  --buildtimevuibase BuildTimeBaseVuiDirectory that is the location of vui-ad-hoc-alexa-recornizer executable files at build time.  Will override --vuibase value for build time directory, if both are supplied");
  console.log("  --runtimevuibase RunTimeBaseVuiDirectory that is the location of vui-ad-hoc-alexa-recognizer executable files at run time.  Will override --vuibase value for run time directory, if both are supplied");
  console.log("  --runtimeexebase RunTimeBaseExeDirectory that is the location of javascript executable files at run time.");
  //console.log("  --interactionmodel InteractionModelFileName specify combined json file name of the file that has intents, utterances, custom slot values, prompts, and dialogs all in one.");
  console.log("  --config ConfigFileName specify configuration file name, optional.  If not specified default values are used.");
  console.log("  --intents IntentsFileName specify intents file name, required.  There is no point in using this without specifying this file.");
  console.log("  --utterances UtterancesFileName specify utterances file name, optional.  This is \"optional\" only in the sense that it CAN be omitted, but in practice it is required.  There only time you would invoke this function without an utterance file argument is if your skill generates only build in intents, which would make it rather useless.");
  console.log("  --optimizations [SINGLE-STAGE] optional. SINGLE-STAGE means no pre-matches using wildcards.  Depending on the recognizer, this may be slower or faster");
  console.log("  --suppressRecognizerDisplay does not send recognizer.json to console");
};

let optimizations = {"multistage": true};
let configFileName;
let intentsFileName;
let utterancesFileName;
let interactionModelFileName;

let baseSourceDirectory;
let resolvedBaseSourceDirectory;
let buildTimeSourceDirectory;
let resolvedBuildTimeSourceDirectory;
let runTimeSourceDirectory;

let baseVuiDirectory;
let resolvedBaseVuiDirectory;
let buildTimeVuiDirectory;
let resolvedBuildTimeVuiDirectory;
let runTimeVuiDirectory;

let runTimeExeDirectory;

let suppressRecognizerDisplay = false;

for(let i = 2; i < process.argv.length; i ++){
  let j = i + 1;
  if(process.argv[i] === "-c" || process.argv[i] === "--config"){
    if(j < process.argv.length){
      i ++;
      configFileName = process.argv[j];
    }
  }
  else if(process.argv[i] === "--sourcebase"){
    if(j < process.argv.length) {
      i++;
      baseSourceDirectory = process.argv[j];
      resolvedBaseSourceDirectory = fs.realpathSync(baseSourceDirectory);
    }
  }
  else if(process.argv[i] === "--buildtimesourcebase"){
    if(j < process.argv.length) {
      i++;
      buildTimeSourceDirectory = process.argv[j];
      resolvedBuildTimeSourceDirectory = fs.realpathSync(buildTimeSourceDirectory);
    }
  }
  else if(process.argv[i] === "--runtimesourcebase"){
    if(j < process.argv.length) {
      i++;
      runTimeSourceDirectory = process.argv[j];
    }
  }
  else if(process.argv[i] === "--vuibase"){
    if(j < process.argv.length) {
      i++;
      baseVuiDirectory = process.argv[j];
      resolvedBaseVuiDirectory = fs.realpathSync(baseVuiDirectory);
    }
  }
  else if(process.argv[i] === "--buildtimevuibase"){
    if(j < process.argv.length) {
      i++;
      buildTimeVuiDirectory = process.argv[j];
      resolvedBuildTimeVuiDirectory = fs.realpathSync(buildTimeVuiDirectory);
    }
  }
  else if(process.argv[i] === "--runtimevuibase"){
    if(j < process.argv.length) {
      i++;
      runTimeVuiDirectory = process.argv[j];
    }
  }
  else if(process.argv[i] === "--runtimeexebase"){
    if(j < process.argv.length) {
      i++;
      runTimeExeDirectory = process.argv[j];
      console.log("got runTimeExeDirectory: " + runTimeExeDirectory);
    }
  }
  else if(process.argv[i] === "-i" || process.argv[i] === "--intents"){
    if(j < process.argv.length) {
      i++;
      intentsFileName = process.argv[j];
    }
  }
  else if(process.argv[i] === "-u" || process.argv[i] === "--utterances"){
    if(j < process.argv.length) {
      i++;
      utterancesFileName = process.argv[j];
    }
  }
  else if(process.argv[i] === "--interactionmodel"){
    if(j < process.argv.length) {
      i++;
      interactionModelFileName = process.argv[j];
    }
  }
  else if(process.argv[i] === "--optimizations" && process.argv[j] === "SINGLE-STAGE"){
    if(j < process.argv.length) {
      i++;
      optimizations.multistage = false;
    }
  }
  else if(process.argv[i] === "--suppressRecognizerDisplay"){
    suppressRecognizerDisplay = true;
  }
}

let directories = {};
if(typeof baseSourceDirectory !== "undefined" && baseSourceDirectory !== null){
  // We have undifferentiated - build vs run time - directory for source.  Set it first, then overwrite with specific ones.
  directories.buildTimeSourceDirectory = baseSourceDirectory;
  directories.runTimeSourceDirectory = baseSourceDirectory;
  directories.resolvedBuildTimeSourceDirectory = resolvedBaseSourceDirectory;
}
if(typeof buildTimeSourceDirectory !== "undefined" && buildTimeSourceDirectory !== null){
  // We have actual build time directory for source, set it.
  directories.buildTimeSourceDirectory = buildTimeSourceDirectory;
  directories.resolvedBuildTimeSourceDirectory = resolvedBuildTimeSourceDirectory;
}
if(typeof runTimeSourceDirectory !== "undefined" && runTimeSourceDirectory !== null){
  // We have actual run time directory for source, set it.
  directories.runTimeSourceDirectory = runTimeSourceDirectory;
}
if(typeof baseVuiDirectory !== "undefined" && baseVuiDirectory !== null){
  // We have undifferentiated - build vs run time - directory for vui-ad-hoc-alexa-recognizer.  Set it first, then overwrite with specific ones.
  directories.buildTimeVuiDirectory = baseVuiDirectory;
  directories.runTimeVuiDirectory = baseVuiDirectory;
  directories.resolvedBuildTimeVuiDirectory = resolvedBaseVuiDirectory;
}
if(typeof buildTimeVuiDirectory !== "undefined" && buildTimeVuiDirectory !== null){
  // We have actual build time directory for vui-ad-hoc-alexa-recognizer, set it.
  directories.buildTimeVuiDirectory = buildTimeVuiDirectory;
  directories.resolvedBuildTimeVuiDirectory = resolvedBuildTimeVuiDirectory;
}
if(typeof runTimeVuiDirectory !== "undefined" && runTimeVuiDirectory !== null){
  // We have actual run time directory for vui-ad-hoc-alexa-recognizer, set it.
  directories.runTimeVuiDirectory = runTimeVuiDirectory;
}
if(typeof runTimeExeDirectory !== "undefined" && runTimeExeDirectory !== null){
  // We have run time exe directory - where the original script to be run will be located, set it
  directories.runTimeExeDirectory = runTimeExeDirectory;
}
{
  let scratchDirectories = {};
  // First, ensure that all essential directories are set, either via command line args or defaults
  if(typeof directories.buildTimeSourceDirectory !== "undefined" && directories.buildTimeSourceDirectory !== null){
    scratchDirectories.buildTimeSourceDirectory = directories.buildTimeSourceDirectory;
  }
  else {
    scratchDirectories.buildTimeSourceDirectory = ".";
  }
  if(typeof directories.buildTimeVuiDirectory !== "undefined" && directories.buildTimeVuiDirectory !== null){
    scratchDirectories.buildTimeVuiDirectory = directories.buildTimeVuiDirectory;
  }
  else {
    scratchDirectories.buildTimeVuiDirectory = "./node_modules/vui-ad-hoc-alex-recognizer/";
  }
  // Here we have all the build time "bits", now do the same for run time.
  if(typeof directories.runTimeSourceDirectory !== "undefined" && directories.runTimeSourceDirectory !== null){
    scratchDirectories.runTimeSourceDirectory = directories.runTimeSourceDirectory;
  }
  else {
    scratchDirectories.runTimeSourceDirectory = ".";
  }
  if(typeof directories.runTimeVuiDirectory !== "undefined" && directories.runTimeVuiDirectory !== null){
    scratchDirectories.runTimeVuiDirectory = directories.runTimeVuiDirectory;
  }
  else {
    scratchDirectories.runTimeVuiDirectory = "./node_modules/vui-ad-hoc-alexa-recognizer/";
  }
  if(typeof directories.runTimeExeDirectory !== "undefined" && directories.runTimeExeDirectory !== null){
    scratchDirectories.runTimeExeDirectory = directories.runTimeExeDirectory;
  }
  else {
    scratchDirectories.runTimeExeDirectory = ".";
  }

  if(path.isAbsolute(scratchDirectories.buildTimeSourceDirectory) === true && path.isAbsolute(scratchDirectories.buildTimeVuiDirectory) === true){
    scratchDirectories.buildTimeSourceToVuiDelta = path.relative(scratchDirectories.buildTimeSourceDirectory, scratchDirectories.buildTimeVuiDirectory);
    scratchDirectories.buildTimeVuiToSourceDelta = path.relative(scratchDirectories.buildTimeVuiDirectory, scratchDirectories.buildTimeSourceDirectory);
  }
  else if(path.isAbsolute(scratchDirectories.buildTimeSourceDirectory) === false && path.isAbsolute(scratchDirectories.buildTimeVuiDirectory) === false){
    scratchDirectories.buildTimeSourceToVuiDelta = path.relative(path.resolve(scratchDirectories.buildTimeSourceDirectory), path.resolve(scratchDirectories.buildTimeVuiDirectory));
    scratchDirectories.buildTimeVuiToSourceDelta = path.relative(path.resolve(scratchDirectories.buildTimeVuiDirectory), path.resolve(scratchDirectories.buildTimeSourceDirectory));
  }
  else if(path.isAbsolute(scratchDirectories.buildTimeSourceDirectory) === true && path.isAbsolute(scratchDirectories.buildTimeVuiDirectory) === false){
    // build time vui directory is relative, source is absolute.  Assume that vui is relative to source and compute deltas.  vui to source delta is just the vui path.
    scratchDirectories.buildTimeVuiToSourceDelta = scratchDirectories.buildTimeVuiDirectory;
    // To "reverse" the vui, simply compute relative path from it to .
    scratchDirectories.buildTimeSourceToVuiDelta = path.relative(scratchDirectories.buildTimeVuiDirectory, ".");
  }
  else if(path.isAbsolute(scratchDirectories.buildTimeSourceDirectory) === false && path.isAbsolute(scratchDirectories.buildTimeVuiDirectory) === true){
    // build time vui directory is absolute, source is relative.  Assume that source is relative to vui and compute deltas.  vui to source delta is just the source path.
    scratchDirectories.buildTimeVuiToSourceDelta = scratchDirectories.buildTimeSourceDirectory;
    // To "reverse" the source, simply compute relative path from it to .
    scratchDirectories.buildTimeSourceToVuiDelta = path.relative(scratchDirectories.buildTimeSourceDirectory, ".");
  }

  // Computing exe to source directory deltas (both ways)
  if(path.isAbsolute(scratchDirectories.runTimeSourceDirectory) === true && path.isAbsolute(scratchDirectories.runTimeExeDirectory) === true){
    // Two absolute paths - deltas are computable
    scratchDirectories.runTimeSourceToExeDelta = path.relative(path.resolve(scratchDirectories.runTimeSourceDirectory), path.resolve(scratchDirectories.runTimeExeDirectory));
    scratchDirectories.runTimeExeToSourceDelta = path.relative(path.resolve(scratchDirectories.runTimeExeDirectory), path.resolve(scratchDirectories.runTimeSourceDirectory));
  }
  else if(path.isAbsolute(scratchDirectories.runTimeSourceDirectory) === false && path.isAbsolute(scratchDirectories.runTimeExeDirectory) === false){
    // Two relative paths - assume that they are relative to the same reference path, thus deltas are computable
    scratchDirectories.runTimeSourceToExeDelta = path.relative(scratchDirectories.runTimeSourceDirectory, scratchDirectories.runTimeExeDirectory);
    scratchDirectories.runTimeExeToSourceDelta = path.relative(scratchDirectories.runTimeExeDirectory, scratchDirectories.runTimeSourceDirectory);
  }
  else if(path.isAbsolute(scratchDirectories.runTimeSourceDirectory) === true && path.isAbsolute(scratchDirectories.runTimeExeDirectory) === false){
    // run time source directory is absolute, exe is relative.  Assume that exe is relative to source and compute deltas.  exe to source delta is just the exe path.
    scratchDirectories.runTimeExeToSourceDelta = scratchDirectories.runTimeExeDirectory;
    // To "reverse" the exe, simply compute relative path from it to .
    scratchDirectories.runTimeSourceToExeDelta = path.relative(scratchDirectories.runTimeExeDirectory, ".");
  }
  else if(path.isAbsolute(scratchDirectories.runTimeSourceDirectory) === false && path.isAbsolute(scratchDirectories.runTimeExeDirectory) === true){
    // run time exe directory is absolute, source is relative.  Assume that source is relative to exe and compute deltas.  exe to source delta is just the source path.
    scratchDirectories.runTimeExeToSourceDelta = scratchDirectories.runTimeSourceDirectory;
    // To "reverse" the source, simply compute relative path from it to .
    scratchDirectories.runTimeSourceToExeDelta = path.relative(scratchDirectories.runTimeSourceDirectory, ".");
  }

  // Computing exe to vui-ad-hoc-alex-recognizer directory deltas (both ways)
  if(path.isAbsolute(scratchDirectories.runTimeExeDirectory) === true && path.isAbsolute(scratchDirectories.runTimeVuiDirectory) === true){
    // Two absolute paths - deltas are computable
    scratchDirectories.runTimeExeToVuiDelta = path.relative(path.resolve(scratchDirectories.runTimeExeDirectory), path.resolve(scratchDirectories.runTimeVuiDirectory));
    scratchDirectories.runTimeVuiToExeDelta = path.relative(path.resolve(scratchDirectories.runTimeVuiDirectory), path.resolve(scratchDirectories.runTimeExeDirectory));
  }
  else if(path.isAbsolute(scratchDirectories.runTimeExeDirectory) === false && path.isAbsolute(scratchDirectories.runTimeVuiDirectory) === false){
    // Two relative paths - assume that they are relative to the same reference path, thus deltas are computable
    scratchDirectories.runTimeExeToVuiDelta = path.relative(scratchDirectories.runTimeExeDirectory, scratchDirectories.runTimeVuiDirectory);
    scratchDirectories.runTimeVuiToExeDelta = path.relative(scratchDirectories.runTimeVuiDirectory, scratchDirectories.runTimeExeDirectory);
  }
  else if(path.isAbsolute(scratchDirectories.runTimeExeDirectory) === true && path.isAbsolute(scratchDirectories.runTimeVuiDirectory) === false){
    // run time exe directory is absolute, vui is relative.  Assume that vui is relative to exe and compute deltas.  vui to exe delta is just the vui path.
    scratchDirectories.runTimeVuiToExeDelta = scratchDirectories.runTimeVuiDirectory;
    // To "reverse" the vui, simply compute relative path from it to .
    scratchDirectories.runTimeExeToVuiDelta = path.relative(scratchDirectories.runTimeVuiDirectory, ".");
  }
  else if(path.isAbsolute(scratchDirectories.runTimeExeDirectory) === false && path.isAbsolute(scratchDirectories.runTimeVuiDirectory) === true){
    // run time vui directory is absolute, exe is relative.  Assume that exe is relative to vui and compute deltas.  vui to exe delta is just the exe path.
    scratchDirectories.runTimeVuiToExeDelta = scratchDirectories.runTimeExeDirectory;
    // To "reverse" the exe, simply compute relative path from it to .
    scratchDirectories.runTimeExeToVuiDelta = path.relative(scratchDirectories.runTimeExeDirectory, ".");
  }

  // Now copy some of these values to the "real" directories object
  directories.runTimeExeToSourceDelta = scratchDirectories.runTimeExeToSourceDelta;
  directories.runTimeExeToVuiDelta = scratchDirectories.runTimeExeToVuiDelta;
}

if(typeof interactionModelFileName !== "undefined" && (typeof utterancesFileName !== "undefined" || typeof intentsFileName !== "undefined")){
  console.log("Must use either --interactionmodel argument OR the pair of --intents and --utterances, but NOT both.");
  usage();
  process.exit(1);
}

if(typeof interactionModelFileName === "undefined" && typeof intentsFileName === "undefined"){
  console.log("Must use either --interactionmodel argument or --intents argument.");
  usage();
  process.exit(1);
}

let interactionModel;
if(typeof interactionModelFileName !== "undefined"){
  // TODO update this code and other "interaction model" code to use directories object
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

let config;
if(typeof configFileName === "undefined"){
  config = defaultCortanaConfig;
}
else {
  // compute actual config file name when combined with base source directory
  let resolvedConfigFileName = utilities.resolveFileName(configFileName, directories.resolvedBuildTimeSourceDirectory);

  try {
    config = require(resolvedConfigFileName);
  }
  catch(e){
    console.log("Unable to load Configuration file.");
    usage();
    process.exit(1);
  }
}

let intents = [];
if(typeof intentsFileName !== "undefined"){
  // compute actual intents file name when combined with base source directory
  let resolvedIntentsFileName = utilities.resolveFileName(intentsFileName, directories.resolvedBuildTimeSourceDirectory);

  try {
    intents = require(resolvedIntentsFileName);
  }
  catch(e){
    console.log("Unable to load Intents file.");
    usage();
    process.exit(1);
  }
}

let utterances = [];

let doTheProcessing = function(){
  return recognizer.Recognizer.generateRunTimeJson(config, interactionModel, intents, utterances, optimizations, directories);
};
let _done = function(json){
  if(suppressRecognizerDisplay === false){
    console.log(JSON.stringify(json, null, 2));
  }
  console.log("Was saved to recognizer.json");
};

// Now crawl over the config and load any custom slot values where they have
// been specified via file name rather than directly.
if(Array.isArray(config.customSlotTypes)){
  for(let i = 0; i < config.customSlotTypes.length; i++){
    let customSlotType = config.customSlotTypes[i];
    if(typeof customSlotType.filename !== "undefined"){
      // Load either an array of simple strings OR an array of JSON objects.
      // If the file name ends in (case insensitive) .json then assume JSON, else text.
      // If it's an array of JSON objects, then each object MUST contain a "value" field that will contain the
      // actual value.  May also contain other fields, such as "alternativeValues", "priorValues", etc.
      if(customSlotType.filename.toLowerCase().endsWith(".json") === true){
        let resolvedFileName = utilities.resolveFileName(customSlotType.filename, directories.resolvedBuildTimeSourceDirectory);
        let values = require(resolvedFileName);
        for(let j = 0; j < values.length; j ++){
          if(customSlotType.values.length === 0){
            customSlotType.values.push(values[j]);
          }
          else {
            let needToAdd = true;
            for(let k = 0; k < customSlotType.values.length; k++){
              if(jsonutilities.compareCustomSlotValues(values[j], customSlotType.values[k])){
                // Value is there - skip
                needToAdd = false;
                break;
              }
            }
            if(needToAdd){
              customSlotType.values.push(values[j]);
            }
          }
        }
      }
      else {
        let values = utilities.loadStringListFromFile(customSlotType.filename, directories.resolvedBuildTimeSourceDirectory);
        if(typeof values !== "undefined"){
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
    }
    else if(typeof customSlotType.customRegExpFile === "string"){
      // Parse the customRegExpString from a file and add it to the customSlotType
      customSlotType.customRegExpString = utilities.loadStringFromFile(customSlotType.customRegExpFile, directories.resolvedBuildTimeSourceDirectory);
    }
  }
}

if(typeof utterancesFileName !== "undefined"){
  utterances = utilities.loadStringListFromFile(utterancesFileName, directories.resolvedBuildTimeSourceDirectory);
}
if(typeof interactionModel !== "undefined"){
  // Get the info from interactionModel
  if(typeof interactionModel.intents !== "undefined"){
    for(let i = 0; i < interactionModel.intents.length; i ++){
      let intent = interactionModel.intents[i];
      let currentUtterances = [];
      // Add all the intent level utterances
      for(let j = 0; j < intent.samples.length; j ++){
        currentUtterances.push(intent.name + " " + intent.samples[j]);
      }
      let oldStyleIntent = {"intent":intent.name, "slots":[]};
      if(typeof intent.slots !== "undefined"){
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
  if(typeof interactionModel.types !== "undefined"){
    for(let i = 0; i < interactionModel.types.length; i++){
      let currentSlotType = interactionModel.types[i];
      if(typeof config.customSlotTypes === "undefined"){
        config.customSlotTypes = [];
      }
      let customSlotType = undefined;
      // Find the custom slot type within the config
      for(let j = 0; j < config.customSlotTypes.length; j ++){
        if(config.customSlotTypes[j].name === currentSlotType.name){
          customSlotType = config.customSlotTypes[i];
          break;
        }
      }
      if(typeof customSlotType === "undefined"){
        customSlotType = {"name":currentSlotType.name, "values":[]};
        config.customSlotTypes.push(customSlotType);
      }
      if(typeof customSlotType.values === "undefined"){
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
fs.writeFile("recognizer.json", JSON.stringify(resultJson), "utf8", (err) => {
  if (err) throw err;
  _done(resultJson);
  console.log("The file has been saved!");
});
