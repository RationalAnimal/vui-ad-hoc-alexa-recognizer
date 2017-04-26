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
    it("verify simple utterance with an AMAZON.Month slot matches", function() {
      let result = recognizer.Recognizer.matchText("May is the best month");
      expect(result).to.eql(
        {"name": "MonthIntent",
         "slots": {
          "MonthSlot": {
            "name": "MonthSlot",
            "value": "May"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.DayOfWeek slot matches", function() {
      let result = recognizer.Recognizer.matchText("lets do it on tuesday");
      expect(result).to.eql(
        {"name": "DayOfWeekIntent",
         "slots": {
          "DayOfWeekSlot": {
            "name": "DayOfWeekSlot",
            "value": "tuesday"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.US_FIRST_NAME slot matches", function() {
      let result = recognizer.Recognizer.matchText("His first name is James");
      expect(result).to.eql(
        {"name": "FirstNameIntent",
         "slots": {
          "FirstNameSlot": {
            "name": "FirstNameSlot",
            "value": "James"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.US_FIRST_NAME slot using extended values matches", function() {
      let result = recognizer.Recognizer.matchText("His first name is Prince Abubu");
      expect(result).to.eql(
        {"name": "FirstNameIntent",
         "slots": {
          "FirstNameSlot": {
            "name": "FirstNameSlot",
            "value": "Prince Abubu"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.US_FIRST_NAME slot using extended values from a file matches", function() {
      let result = recognizer.Recognizer.matchText("His first name is Doppleganger");
      expect(result).to.eql(
        {"name": "FirstNameIntent",
         "slots": {
          "FirstNameSlot": {
            "name": "FirstNameSlot",
            "value": "Doppleganger"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Room slot matches", function() {
      let result = recognizer.Recognizer.matchText("Best room is the bedroom");
      expect(result).to.eql(
        {"name": "RoomIntent",
         "slots": {
          "RoomSlot": {
            "name": "RoomSlot",
            "value": "bedroom"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Room slot using extended values matches", function() {
      let result = recognizer.Recognizer.matchText("Best room is the hobbit hole");
      expect(result).to.eql(
        {"name": "RoomIntent",
         "slots": {
          "RoomSlot": {
            "name": "RoomSlot",
            "value": "hobbit hole"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Room slot using extended values from a file matches", function() {
      let result = recognizer.Recognizer.matchText("Best room is the rabbit hole");
      expect(result).to.eql(
        {"name": "RoomIntent",
         "slots": {
          "RoomSlot": {
            "name": "RoomSlot",
            "value": "rabbit hole"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.US_STATE slot matches", function() {
      let result = recognizer.Recognizer.matchText("Vermont is definitely a state");
      expect(result).to.eql(
        {"name": "StateIntent",
         "slots": {
          "StateSlot": {
            "name": "StateSlot",
            "value": "VT"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.US_STATE slot and EXCLUDE_NON_STATES does not match on non state", function() {
      let result = recognizer.Recognizer.matchText("Vermont is definitely a state");
      expect(result).to.eql(
        {"name": "StateIntent",
         "slots": {
          "StateSlot": {
            "name": "StateSlot",
            "value": "VT"
          }
        }});
    });

  });



  describe("AMAZON.US_STATE Matches", function() {
    it("verify simple utterance with an AMAZON.US_STATE slot matches", function() {
      let result = recognizer.Recognizer.matchText("Vermont is definitely a state");
      expect(result).to.eql(
        {"name": "StateIntent",
         "slots": {
          "StateSlot": {
            "name": "StateSlot",
            "value": "VT"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.US_STATE slot and EXCLUDE_NON_STATES does not match on non state", function() {
      let result = recognizer.Recognizer.matchText("Virgin Islands is definitely a state");
      expect(typeof result).to.equal("undefined");
    });
    it("verify simple utterance with an AMAZON.US_STATE slot without EXCLUDE_NON_STATES does match on non state", function() {
      let result = recognizer.Recognizer.matchText("Virgin Islands may not be a state");
      expect(result).to.eql(
        {"name": "StateIntent",
         "slots": {
          "StateSlot": {
            "name": "StateSlot",
            "value": "Virgin Islands"
          }
        }});
    });

  });






  describe("AMAZON.NUMBER Matches", function() {
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
    it("verify that leading zeroes are preserved and parsing works with words and numbers and 'oh' is treated as 0 when part of a number", function() {
      let result = recognizer.Recognizer.matchText('here is zero oh twenty five thousand three hundred twelve and also 006035551212');
      expect(result).to.eql(
        {"name": "BlahIntent",
           "slots": {
            "BlahSlot": {
              "name": "BlahSlot",
              "value": "0025312"
            },
            "BlehSlot": {
              "name": "BlehSlot",
              "value": "006035551212"
            }
          }
        });
    });

    it("verify simple utterance with two AMAZON.NUMBER slots with commas matches", function() {
      let result = recognizer.Recognizer.matchText('here is 20,000 and also 123,456,789');
      expect(result).to.eql(
        {"name": "BlahIntent",
           "slots": {
            "BlahSlot": {
              "name": "BlahSlot",
              "value": "20000"
            },
            "BlehSlot": {
              "name": "BlehSlot",
              "value": "123456789"
            }
          }
        });
    });
  });

  describe("AMAZON.DATE Matches", function() {
    it("verify AMAZON.DATE slot and today matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('date is today');
      let today = new Date();
      let todayString = "" + today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" +  ("0" + today.getDate()).slice(-2)  ;
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": todayString
            }
          }
        });
    });

    it("verify AMAZON.DATE slot and yesterday matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('date is yesterday');
      let today = new Date();
      today.setDate(today.getDate() - 1);
      let todayString = "" + today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" +  ("0" + today.getDate()).slice(-2)  ;
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": todayString
            }
          }
        });
    });

    it("verify AMAZON.DATE slot and tomorrow matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('date is tomorrow');
      let today = new Date();
      today.setDate(today.getDate() + 1);
      let todayString = "" + today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" +  ("0" + today.getDate()).slice(-2)  ;
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": todayString
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and full calendar date matches", function() {
      let result = recognizer.Recognizer.matchText('date is March first twenty seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": "2017-03-01"
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and month and year matches", function() {
      let result = recognizer.Recognizer.matchText('date is March twenty seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": "2017-03"
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and year as two two digit words matches", function() {
      let result = recognizer.Recognizer.matchText('date is twenty seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
         "slots": {
           "DateSlot": {
             "name": "DateSlot",
             "value": "2017"
           }
         }});
    });

    it("verify simple utterance with AMAZON.DATE slot and year fully spelled out using words matches", function() {
      let result = recognizer.Recognizer.matchText('date is two thousand seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
         "slots": {
           "DateSlot": {
             "name": "DateSlot",
             "value": "2017"
           }
         }});
    });

    it("verify simple utterance with AMAZON.DATE slot and year as 4 digits matches", function() {
      let result = recognizer.Recognizer.matchText('date is 2017');
      expect(result).to.eql(
        {"name": "DateIntent",
         "slots": {
           "DateSlot": {
             "name": "DateSlot",
             "value": "2017"
           }
         }});
    });

    it("verify simple utterance with AMAZON.DATE slot and calendar date without year matches", function() {
      let result = recognizer.Recognizer.matchText('date is March first');
      let today = new Date();
      let marchFirst = new Date();
      marchFirst.setMonth(2);
      marchFirst.setDate(1);
      let year = today.getFullYear();
      if(marchFirst < today){
        year++;
      }
      let marchFirstString = "" + year + "-03-01";

      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": marchFirstString
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and month matches", function() {
      let result = recognizer.Recognizer.matchText('date is March');
      let today = new Date();
      let month = today.getMonth();
      let year = today.getFullYear();
      if(month > 2){
        year ++;
      }
      let marchString = "" + year + "-03";

      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": marchString
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and year with EXCLUDE_YEAR_ONLY_DATES flag does not match", function() {
      let result = recognizer.Recognizer.matchText('date that does not accept year only is 2016');
      expect(typeof result).to.equal("undefined");
    });

  });

  describe("AMAZON.TIME Matches", function() {
    it("verify AMAZON.TIME slot and noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does noon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "12:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and midnight matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does midnight work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "00:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and morning matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does morning work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "MO"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this morning matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this morning work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "MO"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does night work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "NI"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this night work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "NI"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and afternoon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does afternoon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and after noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does after noon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this afternoon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this afternoon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this after noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this after noon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and evening matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does evening work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "EV"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this evening matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this evening work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "EV"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and five matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does five work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "05:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and eleven o'clock matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does eleven o'clock work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and 24 o'clock does not match and returns undefined", function() {
      let result = recognizer.Recognizer.matchText("does twenty four o'clock work for you");
      expect(typeof result).to.equal("undefined");
    });
    it("verify AMAZON.TIME slot and eleven twenty three matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does eleven twenty three work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:23"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and 11 23 am matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 11 23 am work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:23"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and 11 oh five pm matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 11 oh five pm work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "23:05"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and 5 oh three at night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 5 oh three at night work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "05:03"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and six oh three at night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does six oh three at night work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "18:03"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and quarter past midnight matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter past midnight work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "00:15"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and quarter to midnight matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter to midnight work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "23:45"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and half past midnight matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does half past midnight work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "00:30"
            }
          }
        });
    });



    it("verify AMAZON.TIME slot and quarter past noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter past noon work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "12:15"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and quarter to noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter to noon work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:45"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and half past noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does half past noon work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "12:30"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and quarter past five matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter past five work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "05:15"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and quarter past 5 in the evening matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter past 5 in the evening work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "17:15"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and quarter to 13 matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter to 13 work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "12:45"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and quarter to 3 in the afternoon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does quarter to 3 in the afternoon work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "14:45"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and half past eighteen matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does half past eighteen work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "18:30"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and half past seven at night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does half past seven at night work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "19:30"
            }
          }
        });
    });


    it("verify AMAZON.TIME slot and 22 past five pm matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 22 past five pm work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "17:22"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and 22 before five am matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 22 before five am work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "04:38"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and twenty past sixteen am matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does twenty past sixteen work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "16:20"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and 10 past eleven at night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 10 past eleven at night work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "23:10"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and 11 hundred matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 11 hundred work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:00"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and oh 2 hundred matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does oh 2 hundred work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "02:00"
            }
          }
        });
    });


  });

  describe("AMAZON.DURATION processing", function() {
    it("verify AMAZON.DURATION slot and full duration specification in order matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("event duration is five years 11 months two weeks one day seven hours twenty three minutes forty seven seconds");
      expect(result).to.eql(
        {
          "name": "DurationIntent",
          "slots": {
            "DurationSlot": {
              "name": "DurationSlot",
              "value": "P5Y11M2W1DT7H23M47S"
             }
           }
        });
    });
    it("verify AMAZON.DURATION slot and full duration specification out of order matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("event duration is twenty three minutes five years two weeks one day seven hours 11 months forty seven seconds");
      expect(result).to.eql(
        {
          "name": "DurationIntent",
          "slots": {
            "DurationSlot": {
              "name": "DurationSlot",
              "value": "P5Y11M2W1DT7H23M47S"
             }
           }
        });
    });
    it("verify AMAZON.DURATION slot and full duration specification with leading zeros, in order, matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("event duration is oh five years 011 months oh two weeks zero one day zero seven hours oh twenty three minutes oh forty seven seconds");
      expect(result).to.eql(
        {
          "name": "DurationIntent",
          "slots": {
            "DurationSlot": {
              "name": "DurationSlot",
              "value": "P5Y11M2W1DT7H23M47S"
             }
           }
        });
    });
    it("verify AMAZON.DURATION slot and full duration specification with zeros does not match and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("event duration is oh years 0 months oh weeks zero day zero hours oh minutes oh seconds");
      expect(typeof result).to.equal("undefined");
    });
    it("verify AMAZON.DURATION slot and partial duration specification out of order matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("event duration is twenty three minutes two weeks one day 11 months forty seven seconds");
      expect(result).to.eql(
        {
          "name": "DurationIntent",
          "slots": {
            "DurationSlot": {
              "name": "DurationSlot",
              "value": "P11M2W1DT23M47S"
             }
           }
        });
    });
  });

  describe("Wild card processing", function() {
    it("verify simple utterance with an AMAZON.US_FIRST_NAME slot with INCLUDE_WILDCARD_MATCH matches", function() {
      let result = recognizer.Recognizer.matchText("My first name is blah blah");
      expect(result).to.eql(
        {"name": "FirstNameIntent",
         "slots": {
          "FirstNameSlot": {
            "name": "FirstNameSlot",
            "value": "blah blah"
          }
        }});
    });
    it("verify simple utterance with a custom slot with INCLUDE_WILDCARD_MATCH matches", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is banana");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "banana"
          }
        }});
    });
    it("verify simple utterance with a custom slot with INCLUDE_WILDCARD_MATCH matches and retains original capitalization if the name is found in the list", function() {
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

  describe("SoundEx processing", function() {
    it("verify simple utterance with an exact custom slot still matches", function() {
      let result = recognizer.Recognizer.matchText("Another minion is Bob");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
    it("verify simple utterance with an inexact custom slot also matches", function() {
      let result = recognizer.Recognizer.matchText("Another minion is bop");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
    it("verify simple utterance with non-matching custom slot soundex value doesn't match", function() {
      let result = recognizer.Recognizer.matchText("Another minion is blah");
      expect(typeof result).to.equal("undefined");
    });
  });


  describe("Special processing", function() {
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
    it("verify that an utterance with a $ matches on 'dollars'", function() {
      let result = recognizer.Recognizer.matchText('the first price is $1000 and the second price is $525000');
      expect(result).to.eql(
        {"name": "PriceIntent",
         "slots": {
           "PriceOneSlot": {
             "name": "PriceOneSlot",
             "value": "1000"
           },
           "PriceTwoSlot": {
            "name": "PriceTwoSlot",
            "value": "525000"
           }
        }});
    });
    it("verify that an utterance with a $ and a , in the number matches on 'dollars'", function() {
      let result = recognizer.Recognizer.matchText('the first price is $20,000 and the second price is $525,000,000');
      expect(result).to.eql(
        {"name": "PriceIntent",
         "slots": {
           "PriceOneSlot": {
             "name": "PriceOneSlot",
             "value": "20000"
           },
           "PriceTwoSlot": {
            "name": "PriceTwoSlot",
            "value": "525000000"
           }
        }});
    });
    it("verify that an utterance with a $ and mixture of numbers and spelled out number matches on 'dollars'", function() {
      let result = recognizer.Recognizer.matchText('the first price is $20 thousand and the second price is $525 million 300 thousand five hundred 10');
      expect(result).to.eql(
        {"name": "PriceIntent",
         "slots": {
           "PriceOneSlot": {
             "name": "PriceOneSlot",
             "value": "20000"
           },
           "PriceTwoSlot": {
            "name": "PriceTwoSlot",
            "value": "525300510"
           }
        }});
    });
    it("verify that an utterance with a 'dollars' spelled out also matches", function() {
      let result = recognizer.Recognizer.matchText('the first price is 1000 dollars and the second price is 525000 dollars');
      expect(result).to.eql(
        {"name": "PriceIntent",
         "slots": {
           "PriceOneSlot": {
             "name": "PriceOneSlot",
             "value": "1000"
           },
           "PriceTwoSlot": {
            "name": "PriceTwoSlot",
            "value": "525000"
           }
        }});
    });
    it("verify that repeated matches work", function() {
      let result = recognizer.Recognizer.matchText("test me");
      result = recognizer.Recognizer.matchText("Help");
      result = recognizer.Recognizer.matchText("One of the minions is stewart");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Stewart"
          }
        }});
    });
    it("verify that utterances with a period at the end work", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is stewart.");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Stewart"
          }
        }});
    });
    it("verify that utterances with a question mark at the end work", function() {
      let result = recognizer.Recognizer.matchText("test me?");
      expect(result).to.eql(
        {"name": "TestIntent",
         "slots": {}
        });
    });
    it("verify that utterances with an exclamation mark at the end work", function() {
      let result = recognizer.Recognizer.matchText("Help !");
      expect(result).to.eql(
        {"name": "AMAZON.HelpIntent",
         "slots": {}
        });
    });

  });

  describe("Configuration verification", function() {
    it("verify that a disabled built in intent will not parse", function() {
      let result = recognizer.Recognizer.matchText("Repeat");
      expect(typeof result).to.equal("undefined");
    });
    it("verify that an enabled built in intent will parse", function() {
      let result = recognizer.Recognizer.matchText("Stop");
      expect(result).to.eql(
        {"name": "AMAZON.StopIntent",
         "slots": {}
        });
    });
    it("verify that an enabled built in intent will parse additional utterances in config file", function() {
      let result = recognizer.Recognizer.matchText("enough already");
      expect(result).to.eql(
        {"name": "AMAZON.StopIntent",
         "slots": {}
        });
    });
    it("verify that an enabled built in intent will parse additional utterances in external file", function() {
      let result = recognizer.Recognizer.matchText("leave me alone");
      expect(result).to.eql(
        {"name": "AMAZON.StopIntent",
         "slots": {}
        });
    });
    it("verify that a built in intent without config will parse", function() {
      let result = recognizer.Recognizer.matchText("Help");
      expect(result).to.eql(
        {"name": "AMAZON.HelpIntent",
         "slots": {}
        });
    });

    it("verify that an intent with a custom slot with a transform function will parse", function() {
      let result = recognizer.Recognizer.matchText("First is star fruit and then there is petunia");
      expect(result).to.eql(
        {
          "name": "AnotherIntent",
          "slots": {
            "SomeSlot": {
              "name": "SomeSlot",
              "value": "star_fruit"
            },
            "SomeOtherSlot": {
              "name": "SomeOtherSlot",
              "value": "petunia"
            }
          }
        });
    });


  });

});
