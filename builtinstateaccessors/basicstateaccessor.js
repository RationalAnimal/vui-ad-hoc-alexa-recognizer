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

let accessor = {};

let _getState = function(state, key){
  let result = _getStateRaw(state, key);
  if(typeof result !== "undefined" && result !== null){
    return JSON.parse(JSON.stringify(result));
  }
};

let _getStateRaw = function(state, key){
  if(typeof state === "undefined" || state === null || typeof key === "undefined" || key === null){
    return;
  }
  let keyArray = [];
  if(typeof key === "string"){
    keyArray = key.split(".");
  }
  if(keyArray.length > 0){
    let result = state;
    for(let i = 0; i < keyArray.length; i++){
      result = result[keyArray[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    return result;
  }
};

let _getStateChain = function(state, keyArray){
  if(typeof state === "undefined" || state === null || typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) !== true){
    return;
  }
  if(keyArray.length > 0){
    let result = state;
    for(let i = 0; i < keyArray.length; i++){
      result = _getState(result, keyArray[i]);
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    return JSON.parse(JSON.stringify(result));
  }
};

let _setState = function(state, key, newValue){
  if(typeof state === "undefined" || state === null || typeof key === "undefined" || key === null){
    return;
  }
  let keyArray = [];
  if(typeof key === "string"){
    keyArray = key.split(".");
  }
  if(keyArray.length > 0){
    let result = state;
    for(let i = 0; i < keyArray.length - 1; i++){
      result = result[keyArray[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    if(typeof newValue === "undefined" || newValue === null){
      delete result[keyArray[keyArray.length - 1]];
    }
    else {
      result[keyArray[keyArray.length - 1]] = newValue;
    }
  }
};

let _setStateChain = function(state, keyArray, newValue){
  if(typeof state === "undefined" || state === null || typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) !== true){
    return;
  }
  if(keyArray.length > 0){
    let result = state;
    for(let i = 0; i < keyArray.length - 1; i++){
      result = _getStateRaw(result, keyArray[i]);
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    _setState(result, keyArray[keyArray.length - 1], newValue);
  }
};

let _ensureSubfieldsPresent = function(objectToUpdate, keys){
  if(typeof objectToUpdate === "undefined" || objectToUpdate === null){
    return;
  }
  if(typeof keys === "undefined" || keys === null){
    return;
  }
  let keyArray = [];
  if(typeof keys === "string"){
    keyArray = keys.split(".");
  }
  else {
    keyArray = keys;
  }
  if(keyArray.length > 0){
    // First ensure that we have all the "sub" fields
    let result = objectToUpdate;
    for(let i = 0; i < keyArray.length; i++){
      let scratch = result[keyArray[i]];
      if(typeof scratch === "undefined" || scratch === null){
        // We now need to add all the missing fields
        result[keyArray[i]] = {};
        result = result[keyArray[i]];
      }
      else {
        result = scratch;
      }
    }
  }
};
let _mergeReplaceState = function(state, newValue, key){
  if(typeof state === "undefined" || state === null){
    return;
  }
  let result;
  if(typeof key === "undefined" || key === null){
    // TODO verify that we need this use case
    // This means we are merging at the top level
    result = state;
  }
  else {
    let keyArray = [];
    if(typeof key === "string"){
      keyArray = key.split(".");
    }
    if(keyArray.length > 0){
      // First ensure that we have all the "sub" fields
      _ensureSubfieldsPresent(state, keyArray);
      console.log("_mergeReplaceState, expanded state: ", JSON.stringify(state, null, 2));
      _setState(state, key, newValue);
    }
  }
};


let _replaceState = function(state, newState){
  // First, delete all existing fields
  let currentProperties = [];
  for(let key in state) {
    if (state.hasOwnProperty(key)) {
      currentProperties.push(key);
    }
  }
  for(let i = 0; i < currentProperties.length; i++){
    delete state[currentProperties[i]];
  }
  let newProperties = [];
  for(let key in newState){
    if (newState.hasOwnProperty(key)) {
      newProperties.push(key);
    }
  }
  for(let i = 0; i < newProperties.length; i++){
    state[newProperties[i]] = newState[newProperties[i]]
  }
};


accessor.getState = _getState;
accessor.getStateChain = _getStateChain;
accessor.setState = _setState;
accessor.setStateChain = _setStateChain;
accessor.mergeReplaceState = _mergeReplaceState;
accessor.replaceState = _replaceState;

module.exports = accessor;
