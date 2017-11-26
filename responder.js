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

let responder = {};
/*
responder.combineRules = [
  {
    "name": "setTo",
    "description": "Use this response as a full response, completely replacing anything that was there or setting it to this new value if there was no prior response"
  },
  {
    "name": "mergeReplace",
    "description": "Replace the fields in the combined result using the fields from the new one, but leave other values in place"
  },
  {
    "name": "mergeAppend",
    "description": "Append/combine values where they exist, add where they don't.  Append/combine does NOT change the type to an array if it wasn't already an array. So, strings get appended, numbers get added, arrays get concatenated, some strings (e.g. ssml) may have some processing instead of plain concatenation."
  }
];
*/
let _produceResult = function(match, stateAccessor, stateSelectors, responderSpec){
  if(typeof responderSpec === "undefined" || responderSpec === null){
    return;
  }
  if(typeof stateSelectors === "undefined" || stateSelectors === null || Array.isArray(stateSelectors) === false){
    stateSelectors = [];
  }
  // TODO change the order of state update vs response generation later based on the responderSpec. For now do the state update first
  if(typeof responderSpec.updateState !== "undefined" && responderSpec.updateState !== null){
    let updateRule = responderSpec.updateState.updateRule;
    let updatedStateSelectors = [].concat(stateSelectors);

    switch(updateRule){
    case "setTo":
      stateAccessor.setStateChain(updatedStateSelectors, responderSpec.updateState.directValue);
      break;
    case "mergeReplace":
      updatedStateSelectors.push(responderSpec.updateState.updateSelector);
      stateAccessor.mergeReplaceState(updatedStateSelectors, responderSpec.updateState.directValue);
      break;
    default:
      // TODO Do nothing for now, revisit later
      break;
    }
  }
  if(typeof responderSpec.result !== "undefined" && responderSpec.result !== null){
    if(typeof responderSpec.result.builtInResponderFunction === "string"){
      try{
        let scratchFunc = require("./builtindomainresponders" + responderSpec.result.builtInResponderFunction + ".js");
        let result = scratchFunc(match, stateAccessor, stateSelectors, responderSpec.result.functionArguments);
        return result;
      }
      catch(e){
        return;
      }
    }
    else if(typeof responderSpec.result.functionSource === "string"){
      try{
        let scratchFunc = new Function("match", "stateAccessor", "selectorArray", "args", responderSpec.result.functionSource);
        let result = scratchFunc(match, stateAccessor, stateSelectors, responderSpec.result.functionArguments);
        return result;
      }
      catch(e){
        return;
      }
    }
    else if(typeof responderSpec.result.functionModule === "string"){
      try{
        let scratchFunc = require(responderSpec.result.functionModule);
        let result = scratchFunc(match, stateAccessor, stateSelectors, responderSpec.result.functionArguments);
        return result;
      }
      catch(e){
        return;
      }
    }
    else if(typeof responderSpec.result.directValue !== "undefined"){
      return responderSpec.result.directValue;
    }
    else if(typeof responderSpec.result.directValues !== "undefined"){
      let directValues = responderSpec.result.directValues;
      if(directValues.pickMethod === "random"){
        //      console.log("_produceResult, random");
        if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values)){
          let randomIndex = Math.floor(Math.random() * directValues.values.length);
          return directValues.values[randomIndex];
        }
      }
      else if(directValues.pickMethod === "randomDoNotRepeat"){
        //      console.log("_produceResult, randomDoNotRepeat");
        if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values) &&
          typeof directValues.repeatSelector !== "undefined" && directValues.repeatSelector !== null){

          let updatedStateSelectors = [].concat(stateSelectors);
          updatedStateSelectors.push(directValues.repeatSelector);
          let usedValues = stateAccessor.getStateChain(updatedStateSelectors);
          //        console.log("usedValues: ", JSON.stringify(usedValues));
          if(typeof usedValues === "undefined" || Array.isArray(usedValues) !== true){
            usedValues = [];
            //          console.log("setting usedValues to empty array: ", JSON.stringify(usedValues));
          }
          let unusedValues = [];
          let stringifiedUsedValues = [];
          for(let i = 0; i < usedValues.length; i ++){
            stringifiedUsedValues.push(JSON.stringify(usedValues[i]));
          }
          for(let i = 0; i < directValues.values.length; i++){
            if(stringifiedUsedValues.indexOf(JSON.stringify(directValues.values[i])) < 0){
              //            console.log("adding to unusedValues: ", JSON.stringify(directValues.values[i]));
              unusedValues.push(directValues.values[i]);
            }
          }
          if(unusedValues.length === 0){
            // This means all the values have been used - reset
            unusedValues = unusedValues.concat(directValues.values);
            usedValues = [];
          }
          //        console.log("unusedValues: ", JSON.stringify(unusedValues));
          let randomIndex = Math.floor(Math.random() * unusedValues.length);
          let returnValue = unusedValues[randomIndex];
          if(typeof returnValue !== "undefined" && returnValue !== null){
            usedValues.push(returnValue);
            stateAccessor.setStateChain(updatedStateSelectors, usedValues);
          }
          return returnValue;
        }
      }
    }
  }

};

let _combineResponses = function(response1, response2, combineRule){
//  console.log("_combineResponses, 1.0, response1: ", JSON.stringify(response1, null, 2));
//  console.log("_combineResponses, 1.1, response2: ", JSON.stringify(response2, null, 2));
//  console.log("_combineResponses, 1.2, combineRule: ", combineRule);
  if(typeof response2 === "undefined" || response2 === null){
    //    console.log("_combineResponses, 2");
    return response2;
  }
  //  console.log("_combineResponses, 3, combineRule: " + combineRule);
  if(typeof combineRule === "undefined" || combineRule === null){
    //    console.log("_combineResponses, 4");
    combineRule = "mergeReplace";
  }
  let returnValue;
  switch(combineRule){
  case "ignore":
    return response1;
  case "mergeReplace":
    //      console.log("_combineResponses, 5");
    returnValue = JSON.parse(JSON.stringify(response1));
    for (let property in response2) {
      if (response2.hasOwnProperty(property)) {
        returnValue[property] = response2[property];
      }
    }
    return returnValue;
  case "mergeAppend":
    //      console.log("_combineResponses, 6");
    returnValue = JSON.parse(JSON.stringify(response1));
    //      console.log("_combineResponses, 6.1");
    for (var property in response2) {
      if (response2.hasOwnProperty(property)) {
        let existingValue = response1[property];
        let newValue = response2[property];
        if(typeof existingValue === "undefined" || existingValue === null){
          returnValue[property] = response2[property];
        }
        else if(typeof newValue === "undefined" || newValue === null){
          delete returnValue[property];
        }
        else if(typeof existingValue === "string"){
          if(property === "text"){
            returnValue[property] = existingValue + "  " + response2[property];
          }
          else if(property === "ssml"){
            if(/<\/speak>\s*$/ig.test(existingValue) && /^\s*<speak>/ig.test(newValue.toString())){
              // Strip "inner" speak tags, and concatenate.
              try{
                returnValue[property] = /(.*)(?:<\/speak>\s*$)/ig.exec(existingValue)[1] + "  " + /(?:^\s*<speak>)(.*)/ig.exec(newValue.toString())[1];
              }
              catch(e){
                returnValue[property] = existingValue + "  " + newValue.toString();
              }
            }
          }
          else {
            // Catch all string concatenation
            returnValue[property] = existingValue + newValue.toString();
          }
        }
        else if(Array.isArray(existingValue)){
          if(Array.isArray(newValue)){
            // concatenate arrays
            returnValue[property] = existingValue.concat(newValue);
          }
          else {
            // add to an array
            returnValue[property] = existingValue.concat([newValue]);
          }
        }
        else if(typeof existingValue === "object" && typeof newValue === "object"){
          if(property === "card"){
            try{
              delete returnValue["card"];
            }
            catch(e){
              // ignore
            }
            returnValue["cards"] = {existingValue, newValue};
          }
          else {
            returnValue[property] = {existingValue, newValue};
          }
        }
        else {
          try{
            returnValue[property] = existingValue + newValue;
          }
          catch(e){
            returnValue[property] = existingValue.toString() + newValue.toString();
          }
        }
      }
    }
    return returnValue;
  case "setTo":
    //      console.log("_combineResponses, 7");
    return response2;
  default:
    //      console.log("_combineResponses, 8");
    return response2;
  }
};

responder.produceResult = _produceResult;
responder.combineResponses = _combineResponses;

module.exports = responder;
