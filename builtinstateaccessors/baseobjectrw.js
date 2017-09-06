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

let accessorUtils = require("./utils.js")

let _setState = function(key, newValue){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null || typeof key === "undefined" || key === null){
    return;
  }
  let keyArray = accessorUtils.unfoldKeys(key);
  accessorUtils.ensureSubfieldsPresent(state, keyArray);
  if(keyArray.length > 0){
    let result = accessorUtils.getSubObject(state, keyArray, keyArray.length - 1);
    if(typeof result === "undefined" || result === null){
      return;
    }
    if(typeof newValue === "undefined" || newValue === null){
      delete result[keyArray[keyArray.length - 1]];
    }
    else {
      result[keyArray[keyArray.length - 1]] = newValue;
    }
  }
};

let _setStateChain = function(keyArray, newValue){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null || typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) !== true){
    return;
  }
  let unfoldedKeys = accessorUtils.unfoldKeys(keyArray);
  if(unfoldedKeys.length > 0){
    let result = state;
    for(let i = 0; i < unfoldedKeys.length - 1; i++){
      result = result[unfoldedKeys[i]];
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

let _mergeReplaceState = function(keyArray, newState){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null){
    return;
  }
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
      accessorUtils.ensureSubfieldsPresent(state, expandedKeyArray);
    }
  }
  let newProperties = [];
  for(let key in newState){
    if (newState.hasOwnProperty(key)) {
      newProperties.push(key);
    }
  }
  for(let i = 0; i < newProperties.length; i ++){
    let scratchKeyArray = [].concat(keyArray);
    scratchKeyArray.push(newProperties[i]);
    _setStateChain.call(this, scratchKeyArray, newState[newProperties[i]]);
  }
};

let base = require("./baseobject.js");
let accessor =  function(applicationState) {
  base.call(this, applicationState);
  this.applicationState = applicationState;
};

accessor.prototype = Object.create(base.prototype);
accessor.prototype.constructor = accessor;

accessor.setState = _setState;
accessor.prototype.setState = _setState;

accessor.setStateChain = _setStateChain;
accessor.prototype.setStateChain = _setStateChain;

accessor.mergeReplaceState = _mergeReplaceState;
accessor.prototype.mergeReplaceState = _mergeReplaceState;

module.exports = accessor;