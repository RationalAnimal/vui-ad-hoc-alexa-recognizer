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

let _getSubStateAccessor = function(key){
  // NOOP
};

let _getState = function(key){
  // NOOP
};

let _getStateChain = function(keyArray){
  // NOOP
};

let _setState = function(someKey, newValue){
  // NOOP
};

let _setStateChain = function(someKeyArray, newValue){
  // NOOP
};

let _replaceState = function(newState){
  // NOOP
};

let _mergeReplaceState = function(newState, keyArray) {
  // NOOP
};

let accessor =  class {
  constructor(applicationState) {
    this.applicationState = applicationState;
  }
};

accessor.getSubStateAccessor = _getSubStateAccessor;
accessor.prototype.getSubStateAccessor = _getSubStateAccessor;

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
