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

let accessorUtils = require("./utils.js");

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
  if(this instanceof createInstance || this instanceof BasicAccessor || this === BasicAccessor){
    return new BasicAccessor(result);
  }
  else {
    return new this(result);
  }
};

let base = require("./baseobjectrw.js");
let BasicAccessor =  function(applicationState) {
  base.call(this, applicationState);
};

BasicAccessor.prototype = Object.create(base.prototype);
BasicAccessor.prototype.constructor = BasicAccessor;

BasicAccessor.createSubAccessor = _createSubAccessor;
BasicAccessor.prototype.createSubAccessor = _createSubAccessor;

module.exports = BasicAccessor;
