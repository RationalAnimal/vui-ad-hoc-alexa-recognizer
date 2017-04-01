/*
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
var expect = require("chai").expect;
var request = require("../index.js");

describe("vui-request", function() {
  describe("Request", function() {
    var app = {};
    request.addRequestToApp(app);

    it("verify Match constructor and getter/setter functions", function() {
      var emptyMatch = new app.Match();
      expect(emptyMatch.getRawText()).to.equal(undefined);
      expect(emptyMatch.getMatchProbability()).to.equal(1.0);
      expect(emptyMatch.getIntentName()).to.equal(undefined);
      expect(emptyMatch.getLocales()).to.eql([]);
      var typicalMatch = new app.Match("User said blah", 0.9, "BlahIntent", [], ["en"]);
      expect(typicalMatch.getRawText()).to.equal("User said blah");
      expect(typicalMatch.getMatchProbability()).to.equal(0.9);
      expect(typicalMatch.getIntentName()).to.equal("BlahIntent");
      expect(typicalMatch.getLocales()).to.eql(["en"]);
      // Typical with values, using Alexa convetion of naming it "NumberSlot"
      var typicalMatchWithValues = new app.Match("User said five", 0.9, "UserSaidNumberIntent", [{"key": "NumberSlot", "value": 5}], ["en"]);
      expect(typicalMatchWithValues.getRawText()).to.equal("User said five");
      expect(typicalMatchWithValues.getMatchProbability()).to.equal(0.9);
      expect(typicalMatchWithValues.getIntentName()).to.equal("UserSaidNumberIntent");
      expect(typicalMatchWithValues.getMappedValues()).to.eql([{"key": "NumberSlot", "value": 5}]);
      expect(typicalMatchWithValues.getMappedValue("NumberSlot")).to.equal(5);
      expect(typicalMatchWithValues.getMappedValue("NameSlot")).to.equal(undefined);
      expect(typicalMatchWithValues.getLocales()).to.eql(["en"]);
    });
    it("verify Match clone function", function() {
      var emptyMatch = new app.Match();
      var emptyClone = emptyMatch.clone();
      expect(emptyMatch).to.eql(emptyClone);
      var typicalMatch = new app.Match("User said blah", 0.9, "BlahIntent", [], ["en"]);
      var typicalClone = typicalMatch.clone();
      expect(typicalMatch).to.eql(typicalClone);
      // Typical with values, using Alexa convetion of naming it "NumberSlot"
      var typicalMatchWithValues = new app.Match("User said five", 0.9, "UserSaidNumberIntent", [{"key": "NumberSlot", "value": 5}], ["en"]);
      var typicalCloneWithValues = typicalMatchWithValues.clone();
      expect(typicalMatchWithValues).to.eql(typicalCloneWithValues);
    });


    it("verify Request constructor and getter functions", function() {
      var emptyRequest  = new app.Request();
      expect(emptyRequest.getRequestId()).to.equal(undefined);
      expect(emptyRequest.getRequestType()).to.equal(undefined);
      expect(emptyRequest.getRequestTimeStamp()).to.equal(undefined);
      expect(emptyRequest.getRequestLocale()).to.equal(undefined);
      expect(emptyRequest.getRequestMatchCount()).to.equal(0);
      expect(emptyRequest.getRequestMatch(5)).to.equal(undefined);
      var timeStamp = new Date().toString();
      var simpleRequest  = new app.Request("request-123", "START_SESSION", timeStamp, "en", undefined);
      expect(simpleRequest.getRequestId()).to.equal("request-123");
      expect(simpleRequest.getRequestType()).to.equal("START_SESSION");
      expect(simpleRequest.getRequestTimeStamp()).to.equal(timeStamp);
      expect(simpleRequest.getRequestLocale()).to.equal("en");
      expect(simpleRequest.getRequestMatchCount()).to.equal(0);
      expect(simpleRequest.getRequestMatch(5)).to.equal(undefined);
      var match1 = new app.Match("Hasta la vista baby", 0.9, "ByeIntent", [], ["en", "es"]);
      var match2 = new app.Match("User said five", 0.1, "UserSaidNumberIntent", [{"key": "NumberSlot", "value": 5}], ["en"]);
      var fullRequest  = new app.Request("request-456", app.Request.type.INTENT, timeStamp, "en", [match1, match2]);
      expect(fullRequest.getRequestId()).to.equal("request-456");
      expect(fullRequest.getRequestType()).to.equal("INTENT");
      expect(fullRequest.getRequestTimeStamp()).to.equal(timeStamp);
      expect(fullRequest.getRequestLocale()).to.equal("en");
      expect(fullRequest.getRequestMatchCount()).to.equal(2);
      expect(fullRequest.getRequestMatch(1)).to.eql({"userRawText":"User said five","matchProbability":0.1,"intentName":"UserSaidNumberIntent","mappedValues":[{"key":"NumberSlot","value":5}],"locales":["en"]});
      expect(fullRequest.getRequestMatch(5)).to.equal(undefined);
      var byeRequest  = new app.Request("request-789", app.Request.type.END_SESSION, timeStamp, "en", [], app.Request.endSessionReason.ERROR, {"code": app.Request.errorCode.INTERNAL_SERVER_ERROR, "message": "Internal server error."});
      expect(byeRequest.getRequestId()).to.equal("request-789");
      expect(byeRequest.getRequestType()).to.equal("END_SESSION");
      expect(byeRequest.getRequestTimeStamp()).to.equal(timeStamp);
      expect(byeRequest.getRequestLocale()).to.equal("en");
      expect(byeRequest.getRequestReason()).to.equal("ERROR");
      expect(byeRequest.getRequestError()).to.eql({"code": app.Request.errorCode.INTERNAL_SERVER_ERROR, "message": "Internal server error."});

    });


  });
});
