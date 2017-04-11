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
var recognizer = require("../index.js");

describe("vui-ad-hoc-alexa-recognizer", function() {
  describe("Simple Matches", function() {
    it("verify simple utterance without slots matches", function() {
      let result = recognizer.Recognizer.matchText("test me");
      expect(result).to.eql({"name": "TestIntent", "slots": {}});
    });
    it("verify simple utterance matches built in AMAZON.HelpIntent", function() {
      let result = recognizer.Recognizer.matchText("Help");
      expect(result).to.eql({"name": "AMAZON.HelpIntent", "slots": {}});
    });
    it("verify simple utterance with a custom slot matches", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is Bob");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
    it("verify simple utterance with two AMAZON.NUMBER slots matches", function() {
      let result = recognizer.Recognizer.matchText('here is twenty five thousand three hundred twelve and also 6035551212');
      expect(result).to.eql(
        {"name": "BlahIntent",
           "slots": {
            "BlahSlot": {
              "name": "BlahSlot",
              "value": "25312"
            },
            "BlehSlot": {
              "name": "BlehSlot",
              "value": "6035551212"
            }
          }
        });
    });

    it("verify simple utterance with a custom slot matches and retains original capitalization", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is bob");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });

  });
});
