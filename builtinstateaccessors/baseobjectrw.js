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

let _setState = function(key, newValue){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null || typeof key === "undefined" || key === null){
    return;
  }
  let keyArray = [];
  if(typeof key === "string"){
    keyArray = key.split(".");
  }
  _ensureSubfieldsPresent(state, keyArray);
  if(keyArray.length > 0){
    let result = state;
    for(let i = 0; i < keyArray.length - 1; i++){
      result = result[keyArray[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    result[keyArray[keyArray.length - 1]] = newValue;
  }
};

let _setStateChain = function(keyArray, newValue){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null || typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) !== true){
    return;
  }
  let unfoldedKeys = [];
  if(keyArray.length > 0){
    for(let i = 0; i < keyArray.length; i++){
      let key = keyArray[i];
      if(typeof key === "string"){
        let subKeyArray = key.split(".");
        unfoldedKeys = unfoldedKeys.concat(subKeyArray);
      }
    }
  }
  if(unfoldedKeys.length > 0){
    let result = state;
    for(let i = 0; i < unfoldedKeys.length - 1; i++){
      result = result[unfoldedKeys[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    result[keyArray[keyArray.length - 1]] = newValue;
  }
};

let _mergeReplaceState = function(newState, keyArray){
  let state = this.applicationState;
//  console.log("_mergeReplaceState, START, state: ", JSON.stringify(state, null, 2));
  if(typeof state === "undefined" || state === null){
    return;
  }
  let objectToUpdate = state;
  if(typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) === false || keyArray.length === 0){
    // Nothing to do for now
  }
  else {
    let expandedKeyArray = [];
    for(let i = 0; i < keyArray.length; i ++){
      let splitKeyArray = keyArray[i].split(".");
      for(let j = 0; j < splitKeyArray.length; j ++){
        expandedKeyArray.push(splitKeyArray[j]);
      }
    }
    if(expandedKeyArray.length > 0){
      // First ensure that we have all the "sub" fields
      _ensureSubfieldsPresent(state, expandedKeyArray);
    }
  }
  let newProperties = [];
  for(let key in newState){
    if (newState.hasOwnProperty(key)) {
      newProperties.push(key);
    }
  }
  for(let i = 0; i < newProperties.length; i ++){
//    console.log("_mergeReplaceState, 1, i: " + i + " state: ", JSON.stringify(state, null, 2));
    let scratchKeyArray = [].concat(keyArray);
    scratchKeyArray.push(newProperties[i]);
    _setStateChain(objectToUpdate, scratchKeyArray, newState[newProperties[i]]);
  }
};


let _replaceState = function(newState, keyArray){
  let state = this.applicationState;
  let objectToUpdate = state;
  if(typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) === false){
    // Nothing to do for now
  }
  else {
    let expandedKeyArray = [];
    for(let i = 0; i < keyArray.length; i++){
      let splitKeyArray = keyArray[i];
      for(let j = 0; j < splitKeyArray.length; j++){
        expandedKeyArray.push(splitKeyArray[j]);
      }
    }
    _ensureSubfieldsPresent(state, expandedKeyArray);
    for(let i = 0; i < expandedKeyArray.length; i++){
      objectToUpdate = objectToUpdate[expandedKeyArray[i]];
    }
    // Here we have objectToUpdate pointing to last
  }

  let currentProperties = [];
  for(let key in objectToUpdate) {
    if (objectToUpdate.hasOwnProperty(key)) {
      currentProperties.push(key);
    }
  }
  for(let i = 0; i < currentProperties.length; i++){
    delete objectToUpdate[currentProperties[i]];
  }


  let newProperties = [];
  for(let key in newState){
    if (newState.hasOwnProperty(key)) {
      newProperties.push(key);
    }
  }
  for(let i = 0; i < newProperties.length; i++){
    objectToUpdate[newProperties[i]] = newState[newProperties[i]]
  }
};

let base = require("./baseobject.js");
let accessor =  function(applicationState) {
  base.call(this, applicationState);
  this.applicationState = applicationState;
};

accessor.prototype = Object.create(base.prototype);
accessor.prototype.constructor = accessor;

accessor.getState = _getState;
accessor.prototype.getState = _getState;


accessor.getStateChain = _getStateChain;
accessor.prototype.getStateChain = _getStateChain;


accessor.setState = _setState;
accessor.prototype.setState = _setState;

accessor.setStateChain = _setStateChain;
accessor.prototype.setStateChain = _setStateChain;

accessor.mergeReplaceState = _mergeReplaceState;
accessor.prototype.mergeReplaceState = _mergeReplaceState;

accessor.replaceState = _replaceState;
accessor.prototype.replaceState = _replaceState;

module.exports = accessor;