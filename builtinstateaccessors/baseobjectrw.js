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

let accessorUtils = require("./utils.js");

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
    accessorUtils.ensureSubfieldsPresent(state, unfoldedKeys);
    let result = accessorUtils.getSubObject(state, unfoldedKeys, unfoldedKeys.length - 1);
    if(typeof newValue === "undefined" || newValue === null){
      delete result[unfoldedKeys[unfoldedKeys.length - 1]];
    }
    else {
      result[unfoldedKeys[unfoldedKeys.length - 1]] = newValue;
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
    let expandedKeyArray = accessorUtils.unfoldKeys(keyArray);
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

let _createSubAccessor = function createInstance(keyArray, trustSpec){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null){
    return;
  }
  let combinedTrustSpec = accessorUtils.mergeKeysAndTrustedSpec(keyArray, trustSpec);
  // TODO for now only handle the case of either fully trusted or fully untrusted sub domain
  let result;
  if(typeof combinedTrustSpec.selector === "undefined" || combinedTrustSpec.selector === null || Array.isArray(combinedTrustSpec.selector) !== true || combinedTrustSpec.selector.length === 0){
    result = state;
  }
  else {
    accessorUtils.ensureSubfieldsPresent(state, combinedTrustSpec.selector);
    result = accessorUtils.getSubObject(state, combinedTrustSpec.selector);
  }
  if(this instanceof createInstance || this instanceof BaseObjectReadWriteAccessor || this === BaseObjectReadWriteAccessor){
    return new BaseObjectReadWriteAccessor(result);
  }
  else {
    return new this(result);
  }
};


let base = require("./baseobject.js");
let BaseObjectReadWriteAccessor =  function(applicationState) {
  base.call(this, applicationState);
};

BaseObjectReadWriteAccessor.prototype = Object.create(base.prototype);
BaseObjectReadWriteAccessor.prototype.constructor = BaseObjectReadWriteAccessor;

BaseObjectReadWriteAccessor.setState = _setState;
BaseObjectReadWriteAccessor.prototype.setState = _setState;

BaseObjectReadWriteAccessor.setStateChain = _setStateChain;
BaseObjectReadWriteAccessor.prototype.setStateChain = _setStateChain;

BaseObjectReadWriteAccessor.mergeReplaceState = _mergeReplaceState;
BaseObjectReadWriteAccessor.prototype.mergeReplaceState = _mergeReplaceState;

BaseObjectReadWriteAccessor.createSubAccessor = _createSubAccessor;
BaseObjectReadWriteAccessor.prototype.createSubAccessor = _createSubAccessor;

module.exports = BaseObjectReadWriteAccessor;