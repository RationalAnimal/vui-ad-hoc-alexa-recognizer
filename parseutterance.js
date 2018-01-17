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

var parser = {};
var regexputilities = require("./regexputils.js");
var utilities = require("./utilities.js");
var defaultEquivalents = require("./equivalents/default.json");
var misspellingEquivalents = require("./equivalents/misspellings.json");

var _parseUtteranceIntoJson = function(utterance, intentSchema, config, resolvedBaseDir){
  let returnValue = {};
  // First get the intent name
  let parsedIntent = _splitIntentName(utterance);
  let utteranceString;
  if(typeof parsedIntent !== "undefined"){
    if(typeof parsedIntent.intentName === "undefined"){
      return returnValue;
    }
    returnValue.intentName = parsedIntent.intentName;
    if(typeof parsedIntent.utteranceString === "undefined"){
      returnValue.parsedUtterance = [];
      return returnValue;
    }
    utteranceString = parsedIntent.utteranceString;
  }
  else {
    return returnValue;
  }

  let utteranceArray = utteranceString.split("");
  let parsingRange = {"start": 0, "end": -1};
  returnValue.parsedUtterance = _parseUtteranceString(utteranceArray, parsingRange, returnValue.intentName, intentSchema, config, resolvedBaseDir);
  return returnValue;
};

let allowedSlotFlags = ["INCLUDE_VALUES_MATCH", "EXCLUDE_VALUES_MATCH", "INCLUDE_WILDCARD_MATCH", "EXCLUDE_WILDCARD_MATCH", "INCLUDE_SYNONYMS_MATCH", "EXCLUDE_SYNONYMS_MATCH", "SOUNDEX_MATCH", "EXCLUDE_YEAR_ONLY_DATES", "EXCLUDE_NON_STATES", "STATE", "COUNTRY", "CONTINENT", "TYPE", "LEAGUE", "SPORT", "INCLUDE_PRIOR_NAMES", "EXCLUDE_PRIOR_NAMES"];
var _cleanupParsedUtteranceJson = function(parsedJson, intentSchema){
  // First get rid of invalid flags.
  for(let i = 0; i < parsedJson.parsedUtterance.length; i ++){
    if(parsedJson.parsedUtterance[i].type === "slot"){
      if(typeof parsedJson.parsedUtterance[i].flags !== "undefined"){
        for(let j = parsedJson.parsedUtterance[i].flags.length - 1; j >= 0; j --){
          if(allowedSlotFlags.indexOf(parsedJson.parsedUtterance[i].flags[j].name) < 0){
            parsedJson.parsedUtterance[i].flags.splice(j, 1);
          }
        }
      }
    }
  }

  // Now remove flags that are inappropriate for slot types
  for(let i = 0; i < parsedJson.parsedUtterance.length; i ++){
    if(parsedJson.parsedUtterance[i].type === "slot"){
      // Remove EXCLUDE_YEAR_ONLY_DATES if this is NOT a built in date type.
      if(_hasFlag("EXCLUDE_YEAR_ONLY_DATES", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "DATE" ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("EXCLUDE_YEAR_ONLY_DATES", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove SOUNDEX_MATCH flag if this is a built in slot
      if(_hasFlag("SOUNDEX_MATCH", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_isBuiltInSlot(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema) === true){
          // Remove it
          _removeFlag("SOUNDEX_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove INCLUDE_SYNONYMS_MATCH flag if this is a built in slot
      if(_hasFlag("INCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_isBuiltInSlot(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema) === true){
          // Remove it
          _removeFlag("INCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove EXCLUDE_SYNONYMS_MATCH flag if this is a built in slot
      if(_hasFlag("EXCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_isBuiltInSlot(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema) === true){
          // Remove it
          _removeFlag("EXCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove EXCLUDE_NON_STATES if this is NOT a built in US_STATE type.
      if(_hasFlag("EXCLUDE_NON_STATES", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "US_STATE" ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("EXCLUDE_NON_STATES", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove SPORT if this is NOT a built in SportsTeam type.
      if(_hasFlag("SPORT", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "SportsTeam" ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("SPORT", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove LEAGUE if this is NOT a built in SportsTeam type.
      if(_hasFlag("LEAGUE", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "SportsTeam" ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("LEAGUE", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove INCLUDE_PRIOR_NAMES if this is NOT a built in SportsTeam or Corporation or Airport type.
      if(_hasFlag("INCLUDE_PRIOR_NAMES", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "SportsTeam" ||
          _getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Corporation" ||
          _getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Airport"
        ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("INCLUDE_PRIOR_NAMES", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove EXCLUDE_PRIOR_NAMES if this is NOT a built in SportsTeam or Corporation or Airport type.
      if(_hasFlag("EXCLUDE_PRIOR_NAMES", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "SportsTeam" ||
          _getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Corporation" ||
          _getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Airport")
        {
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("EXCLUDE_PRIOR_NAMES", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove COUNTRY if this is NOT a built in Airline or Airport type.
      if(_hasFlag("COUNTRY", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Airline" ||
          _getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Airport"
        ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("COUNTRY", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove STATE if this is NOT a built in Airport type.
      if(_hasFlag("STATE", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Airport") {
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("STATE", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove CONTINENT if this is NOT a built in Airline type.
      if(_hasFlag("CONTINENT", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Airline" ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("CONTINENT", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }
      // Remove TYPE if this is NOT a built in Airline type.
      if(_hasFlag("TYPE", parsedJson.parsedUtterance[i].name, parsedJson)){
        if(_getBuiltInSlotTypeSuffix(_getSlotType(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema)) === "Airline" ){
          // We are all set, this is allowed
        }
        else {
          // Remove it
          _removeFlag("TYPE", parsedJson.parsedUtterance[i].name, parsedJson);
        }
      }

    }
  }


  for(let i = 0; i < parsedJson.parsedUtterance.length; i ++){
    if(parsedJson.parsedUtterance[i].type === "slot"){
      if(typeof parsedJson.parsedUtterance[i].flags === "undefined" || parsedJson.parsedUtterance[i].flags.length === 0){
        // Now, add default flags to any slot that doesn't have any at all.
        parsedJson.parsedUtterance[i].flags = [];
        parsedJson.parsedUtterance[i].flags.push({"name":"INCLUDE_VALUES_MATCH"});
        parsedJson.parsedUtterance[i].flags.push({"name":"EXCLUDE_WILDCARD_MATCH"});
      }
      else {
        // Here we DO have some flags.  All the fictitious ones have already been removed.
        // But we may still have either invalid combinations or missing flags
        if(_hasFlag("SOUNDEX_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === true){
          _removeFlag("INCLUDE_VALUES_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
          _removeFlag("INCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
          _removeFlag("EXCLUDE_VALUES_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
          _removeFlag("EXCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
          _addFlag({"name": "EXCLUDE_WILDCARD_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
          _addFlag({"name": "EXCLUDE_VALUES_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
        }
        else {
          // We are not doing SOUNDEX_MATCH here
          if(_hasFlag("INCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === true){
            _removeFlag("INCLUDE_VALUES_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _removeFlag("EXCLUDE_VALUES_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _removeFlag("EXCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _removeFlag("INCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _removeFlag("EXCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _addFlag({"name": "EXCLUDE_VALUES_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
          }
          else if(_hasFlag("INCLUDE_VALUES_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === true){
            _removeFlag("INCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _removeFlag("EXCLUDE_VALUES_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _removeFlag("EXCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _addFlag({"name": "EXCLUDE_WILDCARD_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
            if(_isBuiltInSlot(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema) === true){
              if(_hasFlag("INCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === true){
                _removeFlag("INCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
              }
              else if(_hasFlag("EXCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === false){
                _addFlag({"name": "INCLUDE_SYNONYMS_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
              }
            }
          }
          else {
            _removeFlag("EXCLUDE_VALUES_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _removeFlag("EXCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
            _addFlag({"name": "INCLUDE_VALUES_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
            _addFlag({"name": "EXCLUDE_WILDCARD_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
            if(_isBuiltInSlot(parsedJson.parsedUtterance[i].name, parsedJson.intentName, intentSchema) === true){
              if(_hasFlag("INCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === true){
                _removeFlag("INCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson);
              }
              else if(_hasFlag("EXCLUDE_SYNONYMS_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === false){
                _addFlag({"name": "INCLUDE_SYNONYMS_MATCH"}, parsedJson.parsedUtterance[i].name, parsedJson);
              }
            }
          }
        }
      }
    }
  }
};

var _addRegExps = function(parsedJson, intentSchema, getReplacementFunc, optimizations) {
  let wildcardReplacementString = "((?:\\w|\\s|[0-9,_']|-)+)";
  parsedJson.regExpStrings = [];

  // First add "complete" wildcard regexp - one that replaces slots and options lists with wildcards
  let regExpString = "";
  let shouldAdd = false;
  let addZeroOccurrence = false;
  for (let i = 0; i < parsedJson.parsedUtterance.length; i++) {
    if (typeof parsedJson.parsedUtterance[i] === "string") {
      regExpString += (parsedJson.parsedUtterance[i]);
    }
    else if (parsedJson.parsedUtterance[i].type === "slot") {
      //      regExpString += (wildcardReplacementString);
      let scratchRegExpString  = getReplacementFunc(parsedJson.parsedUtterance[i].slotType, parsedJson.parsedUtterance[i].flags, "WILDCARD");
      regExpString += scratchRegExpString;

      if (_hasFlag("INCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === false) {
        shouldAdd = true;
      }
    }
    else if (parsedJson.parsedUtterance[i].type === "optionsList") {
      // TODO add only if the number of options exceeds a threshold
      regExpString += (wildcardReplacementString);
      for (let l = 0; l < parsedJson.parsedUtterance[i].options.length; l++) {
        if (parsedJson.parsedUtterance[i].options[l] === "") {
          regExpString += "{0,1}";
        }
      }
      shouldAdd = true;
    }
    else if (parsedJson.parsedUtterance[i].type === "equivalentsSet") {
      regExpString += (wildcardReplacementString);
      // Logic - go through all the individual entries in the set,
      // for each, check if it's a string then it's an empty string (or all spaces) and if it's
      // an equivalents object, then it has an empty string among its equivalents.
      let scratch = true;
      for(let l = 0; l < parsedJson.parsedUtterance[i].equivalentsSet.length; l ++){
        if(typeof parsedJson.parsedUtterance[i].equivalentsSet[l] === "string" && parsedJson.parsedUtterance[i].equivalentsSet[l].trim() !== ""){
          scratch = false;
          break;
        }
        else if(parsedJson.parsedUtterance[i].equivalentsSet[l].type === "equivalents" && parsedJson.parsedUtterance[i].equivalentsSet[l].equivalents.indexOf("") < 0){
          scratch = false;
          break;
        }
      }
      if(scratch){
        regExpString += "{0,1}";
      }
      shouldAdd = true;
    }
    // TODO once equivalentsSet is working, remove equivalents
    else if (parsedJson.parsedUtterance[i].type === "equivalents") {
      regExpString += (wildcardReplacementString);
      for (let l = 0; l < parsedJson.parsedUtterance[i].equivalents.length; l++) {
        if (parsedJson.parsedUtterance[i].equivalents[l] === "") {
          regExpString += "{0,1}";
        }
      }
      shouldAdd = true;
    }
  }

  if (typeof optimizations !== "undefined" && optimizations.multistage === false){
    shouldAdd = false;
  }
  if (shouldAdd) {
    regExpString = regexputilities.reconstructRegExpWithWhiteSpaces(regExpString, true);
    parsedJson.regExpStrings.push(regExpString);
  }
  regExpString = "";
  shouldAdd = false;
  // Now add wildcard matching for slots only
  for (let i = 0; i < parsedJson.parsedUtterance.length; i++) {
    if (typeof parsedJson.parsedUtterance[i] === "string") {
      regExpString += (parsedJson.parsedUtterance[i]);
    }
    else if (parsedJson.parsedUtterance[i].type === "slot") {
      //      regExpString += (wildcardReplacementString);
      let scratchRegExpString  = getReplacementFunc(parsedJson.parsedUtterance[i].slotType, parsedJson.parsedUtterance[i].flags, "WILDCARD");
      regExpString += scratchRegExpString;
      if (_hasFlag("INCLUDE_WILDCARD_MATCH", parsedJson.parsedUtterance[i].name, parsedJson) === false) {
        shouldAdd = true;
      }
    }
    else if (parsedJson.parsedUtterance[i].type === "optionsList") {
      regExpString += "(?:";
      for (let j = 0; j < parsedJson.parsedUtterance[i].options.length; j++) {
        if (j > 0) {
          regExpString += "|";
        }
        if (parsedJson.parsedUtterance[i].options[j].length > 0) {
          regExpString += parsedJson.parsedUtterance[i].options[j];
        }
        else {
          regExpString += "\\s??";
          addZeroOccurrence = true;
        }
      }
      regExpString += ")";
      if (addZeroOccurrence) {
        regExpString += "{0,1}";
      }
    }
    else if (parsedJson.parsedUtterance[i].type === "equivalentsSet") {
      regExpString += _makeRegExpForEquivalentsSet(parsedJson.parsedUtterance[i]);
    }
    // TODO once equivalentsSet is working, remove equivalents
    else if (parsedJson.parsedUtterance[i].type === "equivalents") {
      regExpString += "(?:";
      for (let j = 0; j < parsedJson.parsedUtterance[i].equivalents.length; j++) {
        if (j > 0) {
          regExpString += "|";
        }
        if (parsedJson.parsedUtterance[i].equivalents[j].length > 0) {
          regExpString += parsedJson.parsedUtterance[i].equivalents[j];
        }
        else {
          regExpString += "\\s??";
          addZeroOccurrence = true;
        }
      }
      regExpString += ")";
      if (addZeroOccurrence) {
        regExpString += "{0,1}";
      }
    }
  }
  if (typeof optimizations !== "undefined" && optimizations.multistage == false){
    shouldAdd = false;
  }
  if (shouldAdd) {
    regExpString = regexputilities.reconstructRegExpWithWhiteSpaces(regExpString, true);
    if (parsedJson.regExpStrings.length > 0 && regExpString === parsedJson.regExpStrings[parsedJson.regExpStrings.length - 1]) {
      // String is already in there
    }
    else {
      parsedJson.regExpStrings.push(regExpString);
    }
  }
  regExpString = "";
  // Finally add the full match
  for (let i = 0; i < parsedJson.parsedUtterance.length; i++) {
    if (typeof parsedJson.parsedUtterance[i] === "string") {
      regExpString += (parsedJson.parsedUtterance[i]);
    }
    else if (parsedJson.parsedUtterance[i].type === "slot") {
      regExpString += getReplacementFunc(parsedJson.parsedUtterance[i].slotType, parsedJson.parsedUtterance[i].flags, "FINAL");
    }
    else if (parsedJson.parsedUtterance[i].type === "optionsList") {
      regExpString += "(?:";
      for (let j = 0; j < parsedJson.parsedUtterance[i].options.length; j++) {
        if (j > 0) {
          regExpString += "|";
        }
        if (parsedJson.parsedUtterance[i].options[j].length > 0) {
          regExpString += parsedJson.parsedUtterance[i].options[j];
        }
        else {
          regExpString += "\\s??";
          addZeroOccurrence = true;
        }
      }
      regExpString += ")";
      if (addZeroOccurrence) {
        regExpString += "{0,1}";
      }
    }
    else if (parsedJson.parsedUtterance[i].type === "equivalentsSet") {
      regExpString += _makeRegExpForEquivalentsSet(parsedJson.parsedUtterance[i]);
    }
    // TODO once equivalentsSet is working, remove equivalents
    else if (parsedJson.parsedUtterance[i].type === "equivalents") {
      regExpString += "(?:";
      for (let j = 0; j < parsedJson.parsedUtterance[i].equivalents.length; j++) {
        if (j > 0) {
          regExpString += "|";
        }
        if (parsedJson.parsedUtterance[i].equivalents[j].length > 0) {
          regExpString += parsedJson.parsedUtterance[i].equivalents[j];
        }
        else {
          regExpString += "\\s??";
          addZeroOccurrence = true;
        }
      }
      regExpString += ")";
      if (addZeroOccurrence) {
        regExpString += "{0,1}";
      }
    }
  }
  regExpString = regexputilities.reconstructRegExpWithWhiteSpaces(regExpString, true);
  parsedJson.regExpStrings.push(regExpString);
};

var _makeRegExpForEquivalentsSet = function(equivalentsSet){
//  console.log("makeRegExpForEquivalentsSet: ", JSON.stringify(equivalentsSet, null, 2));
  if(typeof equivalentsSet === "undefined" || equivalentsSet === null || equivalentsSet.type !== "equivalentsSet" || typeof equivalentsSet.equivalentsSet === "undefined" || Array.isArray(equivalentsSet.equivalentsSet) === false){
    return;
  }
  let regExpString = "(?:";
  for(let i = 0; i < equivalentsSet.equivalentsSet.length; i ++){
    if(i > 0){
      regExpString += "|";
    }
    regExpString += "(?:";
    let currentEquivalents = equivalentsSet.equivalentsSet[i];
    for(let j = 0; j < currentEquivalents.length; j ++){
      if(j > 0){
        regExpString += "\\s?";
      }
      if(typeof currentEquivalents[j] === "string"){
        regExpString += currentEquivalents[j];
      }
      else if(currentEquivalents[j].type === "equivalents"){
        let options = currentEquivalents[j].equivalents;
        regExpString += "(?:";
        for(let k = 0; k < options.length; k++){
          if(k > 0){
            regExpString += "|";
          }
          regExpString += options[k];
        }
        regExpString += ")";
      }
    }
    regExpString += ")";
  }
  regExpString += ")";
  //  console.log("makeRegExpForEquivalentsSet: " + regExpString);
  return regExpString;
};

var _unfoldParsedJson = function(parsedJson, prependIntentNameOnOutput){
  let resultArray = [];
  if(parsedJson.parsedUtterance.length >= 1){
    if(typeof parsedJson.parsedUtterance[0] === "string"){
      resultArray.push(parsedJson.parsedUtterance[0]);
    }
    else if(parsedJson.parsedUtterance[0].type === "slot"){
      resultArray.push("{" + parsedJson.parsedUtterance[0].name + "}");
    }
    else if(parsedJson.parsedUtterance[0].type === "optionsList"){
      for(let i = 0; i < parsedJson.parsedUtterance[0].options.length; i++){
        resultArray.push(parsedJson.parsedUtterance[0].options[i]);
      }
    }
    else if(parsedJson.parsedUtterance[0].type === "equivalentsSet"){
      let scratchUnfolded = _unfoldEquivalentsSet(parsedJson.parsedUtterance[0]);
      for(let i = 0; i < scratchUnfolded.length; i++){
        resultArray.push(scratchUnfolded[i]);
      }
    }
    else if(parsedJson.parsedUtterance[0].type === "equivalents"){
      for(let i = 0; i < parsedJson.parsedUtterance[0].equivalents.length; i++){
        resultArray.push(parsedJson.parsedUtterance[0].equivalents[i]);
      }
    }
  }
  for(let i = 1; i < parsedJson.parsedUtterance.length; i ++){
    if(parsedJson.parsedUtterance.length >= 1){
      if(typeof parsedJson.parsedUtterance[i] === "string"){
        for(let j = 0; j < resultArray.length; j++){
          resultArray[j] += parsedJson.parsedUtterance[i];
        }
      }
      else if(parsedJson.parsedUtterance[i].type === "slot"){
        for(let j = 0; j < resultArray.length; j++){
          resultArray[j] += ("{" + parsedJson.parsedUtterance[i].name + "}");
        }
      }
      else if(parsedJson.parsedUtterance[i].type === "optionsList"){
        let currentArraySize = resultArray.length;
        let optionsListSize = parsedJson.parsedUtterance[i].options.length;
        let newResultArray = [];
        for(let j = 0; j < currentArraySize; j++){
          for(let k = 0; k < optionsListSize; k++){
            newResultArray.push(resultArray[j] + parsedJson.parsedUtterance[i].options[k]);
          }
        }
        resultArray = newResultArray;
      }
      else if(parsedJson.parsedUtterance[i].type === "equivalentsSet"){
        let scratchUnfolded = _unfoldEquivalentsSet(parsedJson.parsedUtterance[i]);
        let currentArraySize = resultArray.length;
        let equivalentsSize = scratchUnfolded.length;
        let newResultArray = [];
        for(let j = 0; j < currentArraySize; j++){
          for(let k = 0; k < equivalentsSize; k++){
            newResultArray.push(resultArray[j] + scratchUnfolded[k]);
          }
        }
        resultArray = newResultArray;
      }
      else if(parsedJson.parsedUtterance[i].type === "equivalents"){
        let currentArraySize = resultArray.length;
        let equivalentsSize = parsedJson.parsedUtterance[i].equivalents.length;
        let newResultArray = [];
        for(let j = 0; j < currentArraySize; j++){
          for(let k = 0; k < equivalentsSize; k++){
            newResultArray.push(resultArray[j] + parsedJson.parsedUtterance[i].equivalents[k]);
          }
        }
        resultArray = newResultArray;
      }
    }
  }
  if(prependIntentNameOnOutput === true){
    for(let i = 0; i < resultArray.length; i++){
      resultArray[i] = parsedJson.intentName + " " + resultArray[i];

    }
  }
  return resultArray;
};

var _unfoldEquivalentsSet = function(parsedEquivalentsSetJson) {
  let equivalentsSet = parsedEquivalentsSetJson.equivalentsSet;
  let returnValue = [];
  for(let i = 0; i < equivalentsSet.length; i++){
    let currentEquivalents = [""];
    for(let j = 0; j < equivalentsSet[i].length; j ++){
      if(typeof equivalentsSet[i][j] === "string"){
        _multiplyArrays(currentEquivalents, [equivalentsSet[i][j]]);
      }
      else if(equivalentsSet[i][j].type === "equivalents") {
        _multiplyArrays(currentEquivalents, equivalentsSet[i][j].equivalents);
      }
    }
    returnValue = returnValue.concat(currentEquivalents);
  }
  return returnValue;
};

//TODO remove duplicate copies of this and move them to a common js file later
var _getBuiltInSlotTypeSuffix = function(slotType){
  return slotType.replace(/^AMAZON\./, "").replace(/^TRANSCEND\./, "");
};

var _isBuiltInSlot = function(slotName, intentName, intentSchema){
  let slotType = _getSlotType(slotName, intentName, intentSchema);
  if(slotType.startsWith("AMAZON.") || slotType.startsWith("TRANSCEND.")){
    return true;
  }
  return false;
};

var _getSlotType = function(slotName, intentName, intentSchema){
  for(let i = 0; i < intentSchema.intents.length; i++){
    if(intentSchema.intents[i].intent === intentName){
      for(let j = 0; j < intentSchema.intents[i].slots.length; j ++){
        if(intentSchema.intents[i].slots[j].name === slotName){
          return intentSchema.intents[i].slots[j].type;
        }
      }
      return;
    }
  }
};

var _addFlag = function(flagObject, slotName, parsedJson){
  if(typeof parsedJson !== "undefined" && typeof parsedJson.parsedUtterance !== "undefined" && Array.isArray(parsedJson.parsedUtterance)){
    for (let i = 0; i < parsedJson.parsedUtterance.length; i++){
      if(parsedJson.parsedUtterance[i].type === "slot" && parsedJson.parsedUtterance[i].name === slotName){
        if(typeof parsedJson.parsedUtterance[i].flags === "undefined"){
          parsedJson.parsedUtterance[i].flags = [];
        }
        parsedJson.parsedUtterance[i].flags.push(flagObject);
      }
    }
  }
};

var _removeFlag = function(flagName, slotName, parsedJson){
  if(typeof parsedJson !== "undefined" && typeof parsedJson.parsedUtterance !== "undefined" && Array.isArray(parsedJson.parsedUtterance)){
    for (let i = 0; i < parsedJson.parsedUtterance.length; i++){
      if(parsedJson.parsedUtterance[i].type === "slot" && parsedJson.parsedUtterance[i].name === slotName){
        if(typeof parsedJson.parsedUtterance[i].flags !== "undefined"){
          for(let j = parsedJson.parsedUtterance[i].flags.length - 1; j >= 0; j --){
            if(parsedJson.parsedUtterance[i].flags[j].name === flagName){
              parsedJson.parsedUtterance[i].flags.splice(j, 1);
            }
          }
        }
      }
    }
  }
};

var _hasFlag = function(flagName, slotName, parsedJson) {
  if (typeof parsedJson !== "undefined" && typeof parsedJson.parsedUtterance !== "undefined" && Array.isArray(parsedJson.parsedUtterance)) {
    for (let i = 0; i < parsedJson.parsedUtterance.length; i++) {
      if (parsedJson.parsedUtterance[i].type === "slot" && parsedJson.parsedUtterance[i].name === slotName) {
        if (typeof parsedJson.parsedUtterance[i].flags !== "undefined") {
          for (let j = parsedJson.parsedUtterance[i].flags.length - 1; j >= 0; j--) {
            if (parsedJson.parsedUtterance[i].flags[j].name === flagName) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

/**
 * Call to "multiply" two string arrays (matrix cartesian product) where the arrays contain strings and the strings should be concatenated
 * @param {string[]} sourceTarget - both the first array and the "target" array (contains the result)
 * @param {string[]} additional -
 * @returns {*}
 * @private
 */

var _multiplyArrays = function(sourceTarget, additional){
  let originalSourceLength = sourceTarget.length;
  // Create additional rows that will later be updated so that the total number of rows = length1 * length2
  for(let i = 1; i < additional.length; i++){
    for(let j = 0; j < originalSourceLength; j++){
      sourceTarget.push(sourceTarget[j]);
    }
  }
  // Now we have the right number of rows in the sourceTarget array.  We need to loop over all the entries concatenating
  // them with additional array elements
  for(let i = 0; i < originalSourceLength; i++){
    for(let j = 0; j < additional.length; j++){
      sourceTarget[j * originalSourceLength + i] = sourceTarget[j * originalSourceLength + i] + " " + additional[j];
    }
  }
  return sourceTarget;
};

let escapeRegExp = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
};

let isPotentialEmoticon = function(utteranceArray, startingIndex, endingIndex){
  if(typeof utteranceArray === "undefined" || utteranceArray === null || Array.isArray(utteranceArray) === false){
    return false;
  }
  if(startingIndex < 0 || startingIndex >= utteranceArray.length){
    return false;
  }
  if(endingIndex < 0 || endingIndex >= utteranceArray.length || endingIndex <= startingIndex){
    return false;
  }
  if((startingIndex === 0 || /\s/.test(utteranceArray[startingIndex - 1])) && (endingIndex === utteranceArray.length - 1 || /\s/.test(utteranceArray[endingIndex + 1]))){
    // Potential emoticon is surrounded by white space or start/end.
    return true;
  }
  return false;
};

/**
* Call to parse a portion of utteranceArray specified by parsingRange
start and end, inclusively of both.
*/
var _parseUtteranceString = function(utteranceArray, parsingRange, intentName, intentSchema, config, resolvedBaseDir){
  let scratch = "";
  let returnValue = [];
  for(let i = parsingRange.start; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i++){
    let currentLetter = utteranceArray[i];
    switch(currentLetter){
    case "{":{
      // First verify whether this might be an emoticon.  Currently only following emoticons contain {
      // :{
      // :-{
      // Remember that the preceding and the following character (if present) must be white space.
      // Process :{ here
      if(isPotentialEmoticon(utteranceArray, i - 1, i) && utteranceArray[i-1] === ":"){
        // This is emoticon :{
        // Treat it as normal text
        scratch += escapeRegExp(currentLetter);
        break;
      }
      // Process {: here
      if(isPotentialEmoticon(utteranceArray, i, i + 1) && utteranceArray[i+1] === ":"){
        // This is emoticon }:
        // Treat it as normal text
        scratch += escapeRegExp(currentLetter);
        break;
      }
      // Process :-{ here
      else if(isPotentialEmoticon(utteranceArray, i - 2, i) && utteranceArray[i-1] === "-" && utteranceArray[i-2] === ":"){
        // This is emoticon :-{
        // Treat it as normal text
        scratch += escapeRegExp(currentLetter);
        break;
      }

      if(scratch.length > 0){
        returnValue.push(scratch);
      }
      scratch = "";
      // Handle anything that starts with a curly bracket - slot, options list, etc
      let curlyRange = {"start": i, "end": -1};
      let curlyResult = _parseCurlyBrackets(utteranceArray, curlyRange, intentName, intentSchema, config, resolvedBaseDir);
      //				console.log("curlyResult: ", curlyResult);
      if(typeof curlyResult !== "undefined" && Array.isArray(curlyResult)){
        for(let j = 0; j < curlyResult.length; j++){
          returnValue.push(curlyResult[j]);
        }
      }
      else {
        returnValue.push(curlyResult);
      }
      i = curlyRange.end;
      break;
    }
    default:
      scratch += escapeRegExp(currentLetter);
      break;
    }
  }
  if(scratch.length > 0){
    returnValue.push(scratch);
  }
  return returnValue;
};

var _parseJsonArray = function(utteranceArray, parsingRange, intentSchema){ // eslint-disable-line no-unused-vars
  // Really brute force method - user JSON.parse and attempt at each ]
  let error = {"error": "", "position": -1};
  if(utteranceArray[parsingRange.start] !== "["){
    error.error = "parsing JSON array doesn't start with [", utteranceArray.slice(parsingRange.start).join("");
    error.position = parsingRange.start;
    throw error;
  }
  let accumulatedValue = "";
  let returnValue = [];
  for(let i = parsingRange.start; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
    accumulatedValue += utteranceArray[i];
    switch(utteranceArray[i]){
    case "]":{
      try {
        returnValue = JSON.parse(accumulatedValue);
        parsingRange.end = i;
        return returnValue;
      }
      catch(e){
        // Ignore all errors - we are simply trying blindly so errors don't mean anything
      }
      break;
    }
    default:
      break;
    }
  }
};

var _parseFlagParameters = function(utteranceArray, parsingRange, intentSchema){
  let error = {"error": "", "position": -1};
  if(utteranceArray[parsingRange.start] !== "("){
    error.error = "parsing slot doesn't start with (";
    error.position = parsingRange.start;
    throw error;
  }
  let returnValue = [];
  for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
    switch(utteranceArray[i]){
    case "[":{
      let jsonArrayRange = {"start": i, "end": -1};
      let jsonArrayResult = _parseJsonArray(utteranceArray, jsonArrayRange, intentSchema);
      returnValue = jsonArrayResult;
      i = jsonArrayRange.end;
      break;
    }
    case ")":{
      parsingRange.end = i;
      return returnValue;
    }
    case " ":
    case "\f":
    case "\n":
    case "\r":
    case "\t":
    case "\v":
      break;
    default:
      error.position = i;
      error.error = "unexpected character while parsing flag parameters at position: " + error.position + ": " + utteranceArray[i] + ", in the utterance: " + utteranceArray.join("");
      throw error;
    }
  }
};

var _parseFlags = function(utteranceArray, parsingRange, intentSchema){
  let error = {"error": "", "position": -1};
  if(utteranceArray[parsingRange.start] !== ":"){
    error.error = "parsing slot doesn't start with :";
    error.position = parsingRange.start;
    throw error;
  }
  let accumulatedValue = "";
  let returnValue = [];
  for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
    switch(utteranceArray[i]){
    case "}":
      parsingRange.end = i;
      if(accumulatedValue.length > 0){
        returnValue.push({"name": accumulatedValue});
      }
      return returnValue;
    case ",":
      if(accumulatedValue.length > 0){
        returnValue.push({"name": accumulatedValue});
        accumulatedValue = "";
      }
      break;
    case "(":{
      returnValue.push({"name": accumulatedValue});
      accumulatedValue = "";
      let flagsRange = {"start": i, "end": -1};
      let flagsResult = _parseFlagParameters(utteranceArray, flagsRange, intentSchema);
      returnValue[returnValue.length - 1].parameters = flagsResult;
      i = flagsRange.end;
      break;
    }
    case " ":
    case "\f":
    case "\n":
    case "\r":
    case "\t":
    case "\v":
      break;
    default:
      // simply accumulate the characters
      accumulatedValue += utteranceArray[i];
    }
  }
};

var _parseOptionsList = function(utteranceArray, parsingRange, intentName, intentSchema) { // eslint-disable-line no-unused-vars
  let error = {"error": "", "position": -1};
  if (utteranceArray[parsingRange.start] !== "{") {
    error.error = "parsing options list doesn't start with {";
    error.position = parsingRange.start;
  }
  let accumulatedValue = "";
  let returnValue = {"type": "optionsList", "options": []};

  for (let i = parsingRange.start + 1; i < (parsingRange.end < 0 ? utteranceArray.length : parsingRange.end + 1); i++) {
    switch (utteranceArray[i]) {
    case "}":
      parsingRange.end = i;
      returnValue.options.push(accumulatedValue);
      return returnValue;
    case "|":
      returnValue.options.push(accumulatedValue);
      accumulatedValue = "";
      break;
    default:
      // simply accumulate the characters
      accumulatedValue += utteranceArray[i];
    }
  }
  error.error = "parsing options list ran out of characters to parse before completing slot parsing";
  error.position = -1;
  throw error;
};

var _parseSlotWithFlags = function(utteranceArray, parsingRange, intentName, intentSchema){
  let error = {"error": "", "position": -1};
  if(utteranceArray[parsingRange.start] !== "{"){
    error.error = "parsing slot doesn't start with {";
    error.position = parsingRange.start;
    throw error;
  }
  let accumulatedValue = "";
  let returnValue = {"type": "slot"};
  for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
    switch(utteranceArray[i]){
    case "}":
      parsingRange.end = i;
      if(typeof returnValue.flags === "undefined"){
        returnValue.flags = [];
      }
      returnValue.flags.push(accumulatedValue);
      return returnValue;
    case ":":{
      if(_isSlotName(accumulatedValue, intentName, intentSchema) === false){
        error.error = "slot name " + accumulatedValue + " does not exist within intent schema";
        error.position = i;
        throw error;
      }
      returnValue.slotType = _getSlotType(accumulatedValue, intentName, intentSchema);
      returnValue.name = accumulatedValue;
      accumulatedValue = "";
      let flagsRange = {"start": i, "end": -1};
      let flagsResult = _parseFlags(utteranceArray, flagsRange);
      parsingRange.end = flagsRange.end;
      returnValue.flags = flagsResult;
      return returnValue;
    }
    case " ":
    case "\f":
    case "\n":
    case "\r":
    case "\t":
    case "\v":
      break;
    default:
      // simply accumulate the characters
      accumulatedValue += utteranceArray[i];
    }
  }
  error.error = "parsing slot ran out of characters to parse before completing slot parsing";
  error.position = -1;
  throw error;
};

/**
 * Call to get from the data set the portion relevant to the specified word
 * @param word {string} - word for which to get equivalents
 * @param dataSet {{singleWordSynonyms:[], equivalentPhrases:[]}} - object containing various word and phrase equivalents
 * @returns {string[]} - array of equivalents for the given word
 * @private
 */
var _getWordEquivalents = function(word, dataSet){
  if(typeof word !== "string" || typeof dataSet === "undefined" || typeof dataSet.singleWordSynonyms === "undefined"){
    return undefined;
  }
  word = word.toLowerCase();
  let wordEquivalents = dataSet.singleWordSynonyms;
  let returnValues = [];
  returnValues.push(word);
  for(let i = 0; i < wordEquivalents.length; i++){
    let scratch = wordEquivalents[i];
    if(typeof scratch.synonyms !== "undefined" && Array.isArray(scratch.synonyms) && scratch.words.indexOf(word) >= 0){
      for(let j = 0; j < scratch.synonyms.length; j++){
        returnValues = returnValues.concat(scratch.synonyms[j].values);
      }
    }
  }
  return returnValues;
};

/**
 * Call to get word equivalents for an array of words and dataSets at once.
 * @param words {string[]} - words for which to get equivalents
 * @param dataSet {{singleWordSynonyms:[], equivalentPhrases:[]}[]} - array of objects containing various word and phrase equivalents
 * @returns {Array []} - array of word equivalents arrays
 * @private
 */
var _getWordsEquivalentsForDataSets = function(words, dataSets){
  if(typeof words === "undefined" || Array.isArray(words) === false || typeof dataSets === "undefined" || Array.isArray(dataSets) === false){
    return;
  }
  let returnValue = [];
  for(let i = 0; i < words.length; i++){
    let currentWordEquivalents = [];
    for(let j = 0; j < dataSets.length; j ++){
      let additions = _getWordEquivalents(words[i], dataSets[j]);
      if(typeof additions !== "undefined" && Array.isArray(additions)){
        for(let k = 0; k < additions.length; k++){
          if(currentWordEquivalents.indexOf(additions[k]) < 0){
            currentWordEquivalents.push(additions[k]);
          }
        }
      }
    }
    returnValue.push(currentWordEquivalents);
  }
  return returnValue;
};

/**
 * Call to get from the data set the portion relevant to the specified phrase
 * @param phrase {string} - phrase to get equivalents for
 * @param dataSet {{singleWordSynonyms:[], equivalentPhrases:[]}} - object containing various word and phrase equivalents
 * @returns {object []} - array of equivalents
 * @private
 */
var _getPhraseEquivalents = function(phrase, dataSet){
  phrase = phrase.toLowerCase();
  if(typeof phrase !== "string" || typeof dataSet === "undefined" || typeof dataSet.equivalentPhrases === "undefined"){
    return undefined;
  }
  let equivalentPhrases = dataSet.equivalentPhrases;
  let returnValues = [];
  for(let i = 0; i < equivalentPhrases.length; i++){
    let scratch = equivalentPhrases[i];
    if(typeof scratch.phrases !== "undefined" && Array.isArray(scratch.phrases) && scratch.phrases.indexOf(phrase) >= 0){
      for(let j = 0; j < scratch.equivalents.length; j++){
        returnValues.push(scratch.equivalents[j]);
      }
    }
  }
  return returnValues;
};

var _compactMultiWordEquivalentsByFitRating = function(matchesObject){
  // First, sort by phrase
  let sortingFunction = function(a, b){
    if(a.phrase > b.phrase){
      return 1;
    }
    if(a.phrase < b.phrase){
      return -1;
    }
    if(a.startWordIndex > b.startWordIndex){
      return 1;
    }
    if(a.startWordIndex < b.startWordIndex){
      return -1;
    }
    if(a.endWordIndex > b.endWordIndex){
      return 1;
    }
    if(a.endWordIndex < b.endWordIndex){
      return -1;
    }
    if(a.equivalents.fitRating > b.equivalents.fitRating){
      return 1;
    }
    if(a.equivalents.fitRating < b.equivalents.fitRating){
      return -1;
    }
    return 0;
  };
  let descendingSortingFunction = function(a, b){
    return sortingFunction(b, a);
  };
  matchesObject.matches.sort(descendingSortingFunction);
  for(let i = matchesObject.matches.length - 1; i >= 0; i--){
    if(i > 0){
      if(sortingFunction(matchesObject.matches[i], matchesObject.matches[i-1]) === 0){
        // get all the values from the second one and add those that aren't already there to the first one, then delete the second one
        for(let j = 0; j < matchesObject.matches[i].equivalents.values.length; j++){
          if(matchesObject.matches[i - 1].equivalents.values.indexOf(matchesObject.matches[i].equivalents.values[j]) < 0){
            matchesObject.matches[i - 1].equivalents.values.push(matchesObject.matches[i].equivalents.values[j]);
          }
        }
        matchesObject.matches.splice(i, 1);
      }
    }
  }
};

var _convertArrayToEquivalentsObjectOrString = function(arg){
  if(typeof arg !== "undefined" && arg !== null && Array.isArray(arg) && arg.length > 1){
    let returnValue = {"type":"equivalents", "equivalents": [].concat(arg)};
    //    console.log("converting array to eq. object: ", JSON.stringify(returnValue, null, 2));
    return returnValue;
  }
  if(typeof arg !== "undefined" && arg !== null && Array.isArray(arg) && arg.length === 1){
    return arg;
  }
  if(typeof arg === "string"){
    return arg;
  }
  return "";
};

/**
 * Call this function to generate an array of permutations of utterances with multi word phrases replaced by option
 * lists.  This function will call itself recursively, creating a cartesian product of sub-results
 * @param words {string[]} - the phrase broken up into a string array.
 * @param matches - typically the return value of the call to _compactMultiWordEquivalents function.
 * @param startingWord {number} - the index of the word to start with.  This is needed because this function will call
 * itself recursively.
 * @returns { {"type": "equivalentsSet", "equivalentsSet": []}} - where each entry in the equivalentsSet array is an
 * array consists of a mix of strings or objects like this: {"type":"equivalents", "equivalents":string[]}
 * @private
 */

var _generatePossibleMultiWordUtterances = function(words, matches, singleWordReplacements, startingWord){
  let returnValue = {"type": "equivalentsSet", "equivalentsSet": []};
  for(let i = startingWord; i < words.length; i ++){
    for(let k = 0; k < matches.matches.length; k ++){
      if(matches.matches[k].startWordIndex == i){
        // Found a match, get the replacement values, convert to an options list, call this function on the remainder
        // of the words, combine the two, add the result to returnValue.equivalentsSet.
        let replacementOptionsList = _convertArrayToEquivalentsObjectOrString(matches.matches[k].equivalents.values);
        if(matches.matches[k].endWordIndex < words.length - 1){
          // There are more words after this match, call this function again, combine with replacementOptionsList
          // and add to returnValue.equivalentsSet
          let remainingUtterances = _generatePossibleMultiWordUtterances(words, matches, singleWordReplacements, matches.matches[k].endWordIndex + 1);
          for(let j = 0; j < remainingUtterances.equivalentsSet.length; j++){
            let scratch;
            if(typeof replacementOptionsList === "string"){
              scratch = [replacementOptionsList];
            }
            else {
              scratch = [].concat(replacementOptionsList);
            }
            scratch = scratch.concat(remainingUtterances.equivalentsSet[j]);
            returnValue.equivalentsSet.push(scratch);
          }
        }
        else {
          returnValue.equivalentsSet.push([replacementOptionsList]);
        }
      }
    }
  }
  // Now ALSO add the single word replacement to the list
  if(startingWord === words.length - 1){
    let replacementOptionsList = _convertArrayToEquivalentsObjectOrString(singleWordReplacements[startingWord]);
    let scratch = "";
    if(typeof replacementOptionsList === "string"){
      scratch = replacementOptionsList;
    }
    else {
      scratch = [].concat(replacementOptionsList);
    }


    returnValue.equivalentsSet.push(scratch);
  }
  else {
    let remainingUtterances = _generatePossibleMultiWordUtterances(words, matches, singleWordReplacements, startingWord + 1);
    let replacementOptionsList = _convertArrayToEquivalentsObjectOrString(singleWordReplacements[startingWord]);
    for(let j = 0; j < remainingUtterances.equivalentsSet.length; j++){
      let scratch = "";
      if(typeof replacementOptionsList === "string"){
        scratch = replacementOptionsList;
      }
      else {
        scratch = [].concat(replacementOptionsList);
      }
      for(let l = 0; l < remainingUtterances.equivalentsSet[j].length; l++){
        if(typeof remainingUtterances.equivalentsSet[j][l] === "string"){
          if(typeof scratch[scratch.length - 1] === "string"){
            scratch[scratch.length - 1] = scratch[scratch.length - 1] + " " + remainingUtterances.equivalentsSet[j][l];
          }
          else {
            scratch.push(remainingUtterances.equivalentsSet[j][l]);
          }

        }
        else {
          scratch.push(remainingUtterances.equivalentsSet[j][l]);
        }
      }
      returnValue.equivalentsSet.push(scratch);
    }
  }

  return returnValue;
};

/**
 * Call to get back parsed JSON of the text equivalents, given the string (broken up into words) and an array of
 * data sets to use for matching.
 * @param words
 * @param dataSets
 * @private
 */
var _processParsedEquivalentsWords = function(words, dataSets){
//  console.log("_processParsedEquivalentsWords, words: ", JSON.stringify(words, null, 2) );
  let result;
  for(let i = 0; i < dataSets.length; i ++){
    result = _findMultiWordEquivalents(words, result, dataSets[i]);
  }
  //  console.log("_processParsedEquivalentsWords, 1, result: ", JSON.stringify(result, null, 2) );
  _compactMultiWordEquivalentsByFitRating(result);
  //  console.log("_processParsedEquivalentsWords, 2, result: ", JSON.stringify(result, null, 2) );
  let wordEquivalents = _getWordsEquivalentsForDataSets(words, dataSets);
  //  console.log("_processParsedEquivalentsWords, 3, wordEquivalents: ", JSON.stringify(wordEquivalents, null, 2) );
  let multiWordResult = _generatePossibleMultiWordUtterances(words, result, wordEquivalents, 0);
  //  console.log("_processParsedEquivalentsWords, 4, multiWordResult: ", JSON.stringify(multiWordResult, null, 2) );
  let removedDuplicates = _stripRedundantTextEquivalents(multiWordResult);
  //  console.log("_processParsedEquivalentsWords, 5, removedDuplicates: ", JSON.stringify(removedDuplicates, null, 2) );
  return removedDuplicates;
};

var _stripRedundantTextEquivalents = function(parsedEquivalentsSetJson){
  // First see if there is any duplication at all.
  let unfolded = _unfoldEquivalentsSet(parsedEquivalentsSetJson);
  unfolded.sort();
  let duplicateCount = 0;
  for(let i = 0; i < unfolded.length - 1; i ++){
    if(unfolded[i] === unfolded[i + 1]){
      duplicateCount ++;
    }
  }
  if(duplicateCount === 0){
    return parsedEquivalentsSetJson;
  }
  // Here we need to look at removing duplicates.  Note that this may not be possible or even desirable in all cases.
  //  console.log("duplicate count: " + duplicateCount);
  let argCopy = JSON.parse(JSON.stringify(parsedEquivalentsSetJson));
  let excluded = [];
  for(let i = 0; i < argCopy.equivalentsSet.length; i++){
    let partialSet = {"type":"equivalentsSet", "equivalentsSet":[]};
    for(let j = 0; j < argCopy.equivalentsSet.length; j++){
      if(j !== i && excluded.indexOf(j) < 0){
        partialSet.equivalentsSet.push(argCopy.equivalentsSet[j]);
      }
    }
    // Here we have a partial set
    let unfoldedPartial = _unfoldEquivalentsSet(partialSet);
    let currentOnly = {"type":"equivalentsSet", "equivalentsSet":[argCopy.equivalentsSet[i]]};
    let unfoldedCurrent = _unfoldEquivalentsSet(currentOnly);
    let allDuplicates = true;
    for(let j = 0; j < unfoldedCurrent.length; j ++){
      if(unfoldedPartial.indexOf(unfoldedCurrent[j]) < 0){
        allDuplicates = false;
      }
    }
    if(allDuplicates){
      // remove the current row from the set
      excluded.push(i);
    }
  }
  for(let i = excluded.length - 1; i >= 0; i--){
    argCopy.equivalentsSet.splice(excluded[i], 1);
  }

  return argCopy;
};

/**
 * Call to find all the multi word equivalents found in the words array and adds them to previousMatches (if passed in),
 * otherwise to the brand new return object.
 * @param words {string []} - the array of words, in order, that make up the phrase
 * @param previousMatches {{matches: Array}} - matches returned from previous call(s) to this function.  If provided, the
 * return of the call will be simply added to it.
 * @param dataSet {{singleWordSynonyms:[], equivalentPhrases:[]}} - object containing various word and phrase equivalents
 * @returns {{matches: Array}} - previousMatches (if passed in) or a new object with all the newly found matches added
 * @private
 */
var _findMultiWordEquivalents = function(words, previousMatches, dataSet){
//  console.log("_findMultiWordEquivalents, 1, previousMatches: " + JSON.stringify(previousMatches));
  let returnValue = (typeof previousMatches !== "undefined" && typeof previousMatches.matches !== "undefined" && Array.isArray(previousMatches.matches) ? previousMatches : {"matches":[]});
  //  console.log("_findMultiWordEquivalents, 2, returnValue: " + JSON.stringify(returnValue));
  let dataSetPhrases = dataSet.equivalentPhrases;
  if(typeof dataSetPhrases === "undefined" || Array.isArray(dataSetPhrases) === false){
    //    console.log("exiting _findMultiWordEquivalents, 1, dataSet: ", JSON.stringify(dataSet, null, 2));
    return returnValue;
  }
  for(let i = 0; i < words.length; i ++){
    for(let j = i; j < words.length; j++){
      let currentPhrase = "";
      for (let k = i; k <=j; k++){
        if(k !== i){
          currentPhrase += " ";
        }
        currentPhrase += words[k];
      }
      // Now we have a phrase - find it in the dataSet
      let found = _getPhraseEquivalents(currentPhrase, dataSet);
      //      console.log("_findMultiWordEquivalents, found: ", JSON.stringify(found, null, 2));
      // "unfold" the found values
      for(let l = 0; l < found.length; l ++){
        let match = {"phrase": currentPhrase, "startWordIndex": i, "endWordIndex":j, "equivalents": found[l]};
        returnValue.matches.push(match);
      }
    }
  }
  //  console.log("_findMultiWordEquivalents, exiting, returnValue: " + JSON.stringify(returnValue));

  return returnValue;
};

/**
 * Call to parse portions of the utterance/sample that is enclosed in {} and starts with ~, e.g. {~hello}.  This will
 * look up any common words, expressions, etc and try to replace them with synonymous text.
 * @param utteranceArray
 * @param parsingRange
 * @param intentName
 * @param intentSchema
 * @param config
 * returns {}
 * @private
 */
var _parseEquivalentText = function(utteranceArray, parsingRange, config, resolvedBaseDir){
  let error = {"error": "", "position": -1};
  if(utteranceArray[parsingRange.start] !== "{" || utteranceArray[parsingRange.start + 1] !== "~"){
    error.error = "parsing equivalent text doesn't start with {~";
    error.position = parsingRange.start;
    throw error;
  }
  let accumulatedValue = "";
  //  defaultEquivalents
  let equivalentsSets = [];
  if(typeof config !== "undefined" && config !== null && typeof config.textEquivalents !== "undefined" && Array.isArray(config.textEquivalents) === true){
    // load the config specified text equivalents
    for(let i = 0; i < config.textEquivalents.length; i++){
      if(typeof config.textEquivalents[i].equivalentSetBuiltInName === "string"){
        let scratchEquivalent = require("./equivalents/" + config.textEquivalents[i].equivalentSetBuiltInName + ".json");
        equivalentsSets.push(scratchEquivalent);
      }
      else if(typeof config.textEquivalents[i].equivalentSetSrcFilename === "string") {
        let scratchEquivalent = require(utilities.resolveFileName(config.textEquivalents[i].equivalentSetSrcFilename, resolvedBaseDir));
        equivalentsSets.push(scratchEquivalent);
      }
    }
  }
  else {
    equivalentsSets.push(defaultEquivalents);
    equivalentsSets.push(misspellingEquivalents);
  }

  let words = [];
  for(let i = parsingRange.start + 2; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
    switch(utteranceArray[i]){
    case "}": {
      parsingRange.end = i;
      words.push(accumulatedValue);
      accumulatedValue = "";
      let equivalentsReturnValue = _processParsedEquivalentsWords(words, equivalentsSets);
      return equivalentsReturnValue;
    }
    case ",":
    case ".":
    case "!":
    case "?":
      if(accumulatedValue.length > 0){
        words.push(accumulatedValue);
        accumulatedValue = "";
      }
      words.push(utteranceArray[i]);
      break;
    case " ":
    case "\f":
    case "\n":
    case "\r":
    case "\t":
    case "\v":
      if(accumulatedValue.length > 0){
        words.push(accumulatedValue);
        accumulatedValue = "";
      }
      break;
    default:
      // simply accumulate the characters
      accumulatedValue += utteranceArray[i];
    }
  }
  error.error = "parsing equivalent text ran out of characters to parse before completing parsing";
  error.position = -1;
  throw error;
};

/**
* Call to parse a portion of utteranceArray specified by parsingRange
start and end, inclusively of both that starts with a curly bracket.  Stop
when the closing bracket is found, returned parsed value(s) and update parsingRange
so that the calling function knows where to resume.
This will parse and return either a slot with or without flags or an option list.
The decision is made on whether : or | is encountered first. If neither is
encountered before } and there is only one word then it's a slot without flags.
Else it's an option list with just one option.
*/
var _parseCurlyBrackets = function(utteranceArray, parsingRange, intentName, intentSchema, config, resolvedBaseDir){
  let error = {"error": "", "position": -1};
  if(utteranceArray[parsingRange.start] !== "{"){
    error.error = "parsing curly brackets doesn't start with {";
    error.position = parsingRange.start;
    throw error;
  }
  if(utteranceArray[parsingRange.start + 1] === "~"){
    // this is a text equivalent
    return _parseEquivalentText(utteranceArray, parsingRange, config, resolvedBaseDir);
  }
  let accumulatedValue = "";
  for(let i = parsingRange.start + 1; i < (parsingRange.end < 0?utteranceArray.length:parsingRange.end + 1); i ++){
    switch(utteranceArray[i]){
    case "}":
      parsingRange.end = i;
      if(_isSlotName(accumulatedValue, intentName, intentSchema)){
        let slotType = _getSlotType(accumulatedValue, intentName, intentSchema);
        return {"type": "slot", "name": accumulatedValue, "slotType": slotType};
      }
      else {
        return {"type": "optionsList", "options": [accumulatedValue]};
      }
    case "|":
      // this is an options list
      return _parseOptionsList(utteranceArray, parsingRange, intentName, intentSchema);
    case ":":
      // this is a slot with options
      return _parseSlotWithFlags(utteranceArray, parsingRange, intentName, intentSchema);
    default:
      // simply accumulate the characters
      accumulatedValue += utteranceArray[i];
    }
  }
  error.error = "parsing curly brackets ran out of characters before encountering }";
  error.position = -1;
  throw error;
};

var _splitIntentName = function(utterance){
  let returnValue = {};
  let intentRegExp = /^\s*((?:\w|[-.])+)\s*(.+)\s*/ig;

  let matchResult = intentRegExp.exec(utterance);
  if(matchResult){
    returnValue = {
      "intentName": matchResult[1],
      "utteranceString": matchResult[2]
    };
    return returnValue;
  }
  return;
};

var _isSlotName = function(slotName, intentName, intentSchema){
  let trimmedName = slotName.replace(/^\s*/,"").replace(/\s*$/,"");
  for(let i = 0; i < intentSchema.intents.length; i++){
    if(intentSchema.intents[i].intent !== intentName){
      continue;
    }
    let intentSlots = intentSchema.intents[i].slots;

    for(let j = 0; j < intentSlots.length; j++){
      if(intentSlots[j].name === trimmedName){
        return true;
      }
    }
  }
  return false;
};

parser.parseUtteranceIntoJson = _parseUtteranceIntoJson;
parser.cleanupParsedUtteranceJson = _cleanupParsedUtteranceJson;
parser.unfoldParsedJson = _unfoldParsedJson;
parser.addRegExps = _addRegExps;

parser.forTesting = {};
parser.forTesting.getWordEquivalents = _getWordEquivalents;
parser.forTesting.getWordsEquivalentsForDataSets = _getWordsEquivalentsForDataSets;
parser.forTesting.getPhraseEquivalents = _getPhraseEquivalents;
parser.forTesting.findMultiWordEquivalents = _findMultiWordEquivalents;
parser.forTesting.compactMultiWordEquivalentsByFitRating = _compactMultiWordEquivalentsByFitRating;
parser.forTesting.generatePossibleMultiWordUtterances = _generatePossibleMultiWordUtterances;
parser.forTesting.makeRegExpForEquivalentsSet = _makeRegExpForEquivalentsSet;
parser.forTesting.unfoldEquivalentsSet = _unfoldEquivalentsSet;
parser.forTesting.stripRedundantTextEquivalents = _stripRedundantTextEquivalents;
parser.forTesting.processParsedEquivalentsWords = _processParsedEquivalentsWords;

module.exports = parser;
