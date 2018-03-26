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

let _getState = function(key){
  let result = accessorUtils.getSubObject(this.applicationState, key);
  if(typeof result !== "undefined"){
    return JSON.parse(JSON.stringify(result));
  }
};

let _getStateChain = function(keyArray){
  let result = accessorUtils.getSubObject(this.applicationState, keyArray);
  if(typeof result !== "undefined"){
    return JSON.parse(JSON.stringify(result));
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
  if(this instanceof createInstance || this instanceof BaseObjectAccessor || this === BaseObjectAccessor){
    return new BaseObjectAccessor(result);
  }
  else {
    return new this(result);
  }
};

let base = require("./base.js");
let BaseObjectAccessor =  function(applicationState) {
  base.call(this);
  this.applicationState = applicationState;
};

BaseObjectAccessor.prototype = Object.create(base.prototype);
BaseObjectAccessor.prototype.constructor = BaseObjectAccessor;

BaseObjectAccessor.getState = _getState;
BaseObjectAccessor.prototype.getState = _getState;

BaseObjectAccessor.getStateChain = _getStateChain;
BaseObjectAccessor.prototype.getStateChain = _getStateChain;

BaseObjectAccessor.createSubAccessor = _createSubAccessor;
BaseObjectAccessor.prototype.createSubAccessor = _createSubAccessor;

module.exports = BaseObjectAccessor;
