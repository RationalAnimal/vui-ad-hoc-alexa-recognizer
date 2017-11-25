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
var generatorsupport = require("../generatorsupport.js");
var parser = require("../parseutterance.js");

describe("vui-ad-hoc-alexa-recognizer", function() {
  describe("Simple Matches", function() {
    this.timeout(0);
    this.slow(10000);
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
    it("verify simple utterance with an AMAZON.Country slot matches", function() {
      let result = recognizer.Recognizer.matchText("have you been to france");
      expect(result).to.eql(
        {"name": "CountryIntent",
         "slots": {
          "CountrySlot": {
            "name": "CountrySlot",
            "value": "France"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Actor slot matches", function() {
      let result = recognizer.Recognizer.matchText("another actor who played bond is Sean Connery");
      expect(result).to.eql(
        {"name": "ActorIntent",
         "slots": {
          "ActorSlot": {
            "name": "ActorSlot",
            "value": "sean connery"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Artist slot matches", function() {
      let result = recognizer.Recognizer.matchText("michael jackson was in jackson five");
      expect(result).to.eql(
        {"name": "ArtistIntent",
         "slots": {
          "ArtistSlot": {
            "name": "ArtistSlot",
            "value": "michael jackson"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Professional slot matches", function() {
      let result = recognizer.Recognizer.matchText("ben carson is well known in his industry");
      expect(result).to.eql(
        {"name": "ProfessionalIntent",
          "slots": {
            "ProfessionalSlot": {
              "name": "ProfessionalSlot",
              "value": "ben carson"
            }
          }});
    });


    it("verify simple utterance with an AMAZON.Residence slot matches", function() {
      let result = recognizer.Recognizer.matchText("arlington is a nice place to visit");
      expect(result).to.eql(
        {"name": "ResidenceIntent",
          "slots": {
            "ResidenceSlot": {
              "name": "ResidenceSlot",
              "value": "arlington"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.ScreeningEvent slot matches", function() {
      let result = recognizer.Recognizer.matchText("i saw it at sundance film festival");
      expect(result).to.eql(
        {"name": "ScreeningEventIntent",
          "slots": {
            "ScreeningEventSlot": {
              "name": "ScreeningEventSlot",
              "value": "sundance film festival"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Service slot matches", function() {
      let result = recognizer.Recognizer.matchText("anna's taqueria is the best local business");
      expect(result).to.eql(
        {"name": "ServiceIntent",
          "slots": {
            "ServiceSlot": {
              "name": "ServiceSlot",
              "value": "anna's taqueria"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SoftwareApplication slot matches", function() {
      let result = recognizer.Recognizer.matchText("do you use windows");
      expect(result).to.eql(
        {"name": "SoftwareApplicationIntent",
          "slots": {
            "SoftwareApplicationSlot": {
              "name": "SoftwareApplicationSlot",
              "value": "windows"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SoftwareGame slot matches", function() {
      let result = recognizer.Recognizer.matchText("a lot of people play angry birds");
      expect(result).to.eql(
        {"name": "SoftwareGameIntent",
          "slots": {
            "SoftwareGameSlot": {
              "name": "SoftwareGameSlot",
              "value": "angry birds"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.VideoGame slot matches", function() {
      let result = recognizer.Recognizer.matchText("tetris was an early favorite");
      expect(result).to.eql(
        {"name": "VideoGameIntent",
          "slots": {
            "VideoGameSlot": {
              "name": "VideoGameSlot",
              "value": "tetris"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SocialMediaPlatform slot matches", function() {
      let result = recognizer.Recognizer.matchText("a lot of people use twitter");
      expect(result).to.eql(
        {"name": "SocialMediaPlatformIntent",
          "slots": {
            "SocialMediaPlatformSlot": {
              "name": "SocialMediaPlatformSlot",
              "value": "Twitter"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsEvent slot matches", function() {
      let result = recognizer.Recognizer.matchText("a lot of people watch superbowl");
      expect(result).to.eql(
        {"name": "SportsEventIntent",
          "slots": {
            "SportsEventSlot": {
              "name": "SportsEventSlot",
              "value": "superbowl"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.TVEpisode slot matches", function() {
      let result = recognizer.Recognizer.matchText("a lot of people watched jaynestown");
      expect(result).to.eql(
        {"name": "TVEpisodeIntent",
          "slots": {
            "TVEpisodeSlot": {
              "name": "TVEpisodeSlot",
              "value": "jaynestown"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.TVSeason slot matches", function() {
      let result = recognizer.Recognizer.matchText("dwts 20 is the best season of the series");
      expect(result).to.eql(
        {"name": "TVSeasonIntent",
          "slots": {
            "TVSeasonSlot": {
              "name": "TVSeasonSlot",
              "value": "dwts 20"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.TVSeries slot matches", function() {
      let result = recognizer.Recognizer.matchText("dancing with the stars is very popular");
      expect(result).to.eql(
        {"name": "TVSeriesIntent",
          "slots": {
            "TVSeriesSlot": {
              "name": "TVSeriesSlot",
              "value": "dancing with the stars"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Athlete slot matches", function() {
      let result = recognizer.Recognizer.matchText("michael phelps is a swimmer");
      expect(result).to.eql(
        {"name": "AthleteIntent",
         "slots": {
          "AthleteSlot": {
            "name": "AthleteSlot",
            "value": "michael phelps"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Author slot matches", function() {
      let result = recognizer.Recognizer.matchText("mark twain is a writer");
      expect(result).to.eql(
        {"name": "AuthorIntent",
         "slots": {
          "AuthorSlot": {
            "name": "AuthorSlot",
            "value": "mark twain"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Book slot matches", function() {
      let result = recognizer.Recognizer.matchText("my favorite book is Harry Potter");
      expect(result).to.eql(
        {"name": "BookIntent",
         "slots": {
          "BookSlot": {
            "name": "BookSlot",
            "value": "harry potter"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.BookSeries slot matches", function() {
      let result = recognizer.Recognizer.matchText("silence of the lambs is also a movie");
      expect(result).to.eql(
        {"name": "BookSeriesIntent",
         "slots": {
          "BookSeriesSlot": {
            "name": "BookSeriesSlot",
            "value": "silence of the lambs"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.BroadcastChannel slot matches", function() {
      let result = recognizer.Recognizer.matchText("do you like to listen to npr in the morning");
      expect(result).to.eql(
        {"name": "BroadcastChannelIntent",
         "slots": {
          "BroadcastChannelSlot": {
            "name": "BroadcastChannelSlot",
            "value": "npr"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.CivicStructure slot matches", function() {
      let result = recognizer.Recognizer.matchText("is museum of fine art a tourist attraction");
      expect(result).to.eql(
        {"name": "CivicStructureIntent",
         "slots": {
          "CivicStructureSlot": {
            "name": "CivicStructureSlot",
            "value": "museum of fine art"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Comic slot matches", function() {
      let result = recognizer.Recognizer.matchText("have you read x-men");
      expect(result).to.eql(
        {"name": "ComicIntent",
         "slots": {
          "ComicSlot": {
            "name": "ComicSlot",
            "value": "x-men"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.MusicRecording slot matches", function() {
      let result = recognizer.Recognizer.matchText("dust in the wind is the best track on that album");
      expect(result).to.eql(
        {"name": "MusicRecordingIntent",
         "slots": {
          "MusicRecordingSlot": {
            "name": "MusicRecordingSlot",
            "value": "dust in the wind"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.MusicVenue slot matches", function() {
      let result = recognizer.Recognizer.matchText("let's see it at strawberry park");
      expect(result).to.eql(
        {"name": "MusicVenueIntent",
         "slots": {
           "MusicVenueSlot": {
             "name": "MusicVenueSlot",
             "value": "strawberry park"
           }
        }});
    });

    it("verify simple utterance with an AMAZON.MusicVideo slot matches", function() {
      let result = recognizer.Recognizer.matchText("like a virgin was controversial when it came out");
      expect(result).to.eql(
        {"name": "MusicVideoIntent",
         "slots": {
           "MusicVideoSlot": {
             "name": "MusicVideoSlot",
             "value": "like a virgin"
           }
         }});
    });

    it("verify simple utterance with an AMAZON.Dessert slot matches", function() {
      let result = recognizer.Recognizer.matchText("ice cream is my favorite dessert");
      expect(result).to.eql(
        {"name": "DessertIntent",
         "slots": {
          "DessertSlot": {
            "name": "DessertSlot",
            "value": "ice cream"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.LandmarksOrHistoricalBuildings slot matches", function() {
      let result = recognizer.Recognizer.matchText("i will meet you in madison square");
      expect(result).to.eql(
        {"name": "LandmarksOrHistoricalBuildingsIntent",
         "slots": {
          "LandmarksOrHistoricalBuildingsSlot": {
            "name": "LandmarksOrHistoricalBuildingsSlot",
            "value": "madison square"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Game slot matches", function() {
      let result = recognizer.Recognizer.matchText("halo is my favorite game");
      expect(result).to.eql(
        {"name": "GameIntent",
         "slots": {
          "GameSlot": {
            "name": "GameSlot",
            "value": "halo"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Landform slot matches", function() {
      let result = recognizer.Recognizer.matchText("mount washington is a popular hiker destination");
      expect(result).to.eql(
        {"name": "LandformIntent",
         "slots": {
          "LandformSlot": {
            "name": "LandformSlot",
            "value": "mount washington"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Movie slot matches", function() {
      let result = recognizer.Recognizer.matchText("have you seen gone with the wind yet");
      expect(result).to.eql(
        {"name": "MovieIntent",
         "slots": {
          "MovieSlot": {
            "name": "MovieSlot",
            "value": "gone with the wind"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.MovieSeries slot matches", function() {
      let result = recognizer.Recognizer.matchText("star wars is very popular");
      expect(result).to.eql(
        {"name": "MovieSeriesIntent",
         "slots": {
          "MovieSeriesSlot": {
            "name": "MovieSeriesSlot",
            "value": "star wars"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.MovieTheater slot matches", function() {
      let result = recognizer.Recognizer.matchText("let's go to the coolidge corner theater");
      expect(result).to.eql(
        {"name": "MovieTheaterIntent",
         "slots": {
          "MovieTheaterSlot": {
            "name": "MovieTheaterSlot",
            "value": "coolidge corner theater"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.MusicAlbum slot matches", function() {
      let result = recognizer.Recognizer.matchText("thriller is one of the most popular albums of all time");
      expect(result).to.eql(
        {"name": "MusicAlbumIntent",
         "slots": {
          "MusicAlbumSlot": {
            "name": "MusicAlbumSlot",
            "value": "thriller"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Musician slot matches", function() {
      let result = recognizer.Recognizer.matchText("sting used to be part of a group");
      expect(result).to.eql(
        {"name": "MusicianIntent",
         "slots": {
          "MusicianSlot": {
            "name": "MusicianSlot",
            "value": "sting"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.MusicGroup slot matches", function() {
      let result = recognizer.Recognizer.matchText("i like coldplay");
      expect(result).to.eql(
        {"name": "MusicGroupIntent",
         "slots": {
          "MusicGroupSlot": {
            "name": "MusicGroupSlot",
            "value": "coldplay"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.MusicEvent slot matches", function() {
      let result = recognizer.Recognizer.matchText("will you go to the cmt music awards");
      expect(result).to.eql(
        {"name": "MusicEventIntent",
         "slots": {
          "MusicEventSlot": {
            "name": "MusicEventSlot",
            "value": "cmt music awards"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.LocalBusinessType slot matches", function() {
      let result = recognizer.Recognizer.matchText("are you going to the pharmacy");
      expect(result).to.eql(
        {"name": "LocalBusinessTypeIntent",
         "slots": {
          "LocalBusinessTypeSlot": {
            "name": "LocalBusinessTypeSlot",
            "value": "pharmacy"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.MedicalOrganization slot matches", function() {
      let result = recognizer.Recognizer.matchText("how far is massachusetts general hospital");
      expect(result).to.eql(
        {"name": "MedicalOrganizationIntent",
         "slots": {
          "MedicalOrganizationSlot": {
            "name": "MedicalOrganizationSlot",
            "value": "massachusetts general hospital"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Organization slot matches", function() {
      let result = recognizer.Recognizer.matchText("massachusetts general hospital is just around the corner");
      expect(result).to.eql(
          {"name": "OrganizationIntent",
            "slots": {
              "OrganizationSlot": {
                "name": "OrganizationSlot",
                "value": "massachusetts general hospital"
              }
            }});
    });

    it("verify simple utterance with an AMAZON.LocalBusiness slot matches", function() {
      let result = recognizer.Recognizer.matchText("is there a walmart nearby");
      expect(result).to.eql(
        {"name": "LocalBusinessIntent",
         "slots": {
          "LocalBusinessSlot": {
            "name": "LocalBusinessSlot",
            "value": "walmart"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Festival slot matches", function() {
      let result = recognizer.Recognizer.matchText("where is south by southwest held");
      expect(result).to.eql(
        {"name": "FestivalIntent",
         "slots": {
          "FestivalSlot": {
            "name": "FestivalSlot",
            "value": "south by southwest"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.FictionalCharacter slot matches", function() {
      let result = recognizer.Recognizer.matchText("batman is a dark character");
      expect(result).to.eql(
        {"name": "FictionalCharacterIntent",
         "slots": {
          "FictionalCharacterSlot": {
            "name": "FictionalCharacterSlot",
            "value": "batman"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.FoodEstablishment slot matches", function() {
      let result = recognizer.Recognizer.matchText("do you want to go to burger king");
      expect(result).to.eql(
        {"name": "FoodEstablishmentIntent",
         "slots": {
          "FoodEstablishmentSlot": {
            "name": "FoodEstablishmentSlot",
            "value": "burger king"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Director slot matches", function() {
      let result = recognizer.Recognizer.matchText("martin scorsese directed many movies");
      expect(result).to.eql(
        {"name": "DirectorIntent",
         "slots": {
          "DirectorSlot": {
            "name": "DirectorSlot",
            "value": "martin scorsese"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("bill gates and jeff bezos are among the richest people in the world");
      expect(result).to.eql(
        {"name": "PersonIntent",
         "slots": {
           "PersonOneSlot": {
             "name": "PersonOneSlot",
             "value": "bill gates"
           },
           "PersonTwoSlot": {
             "name": "PersonTwoSlot",
             "value": "jeff bezos"
           }
        }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("sean connery is a well known person");
      expect(result).to.eql(
        {"name": "WellKnownPersonIntent",
         "slots": {
           "PersonSlot": {
             "name": "PersonSlot",
             "value": "sean connery"
           }
        }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("michael jackson is a well known person");
      expect(result).to.eql(
        {"name": "WellKnownPersonIntent",
          "slots": {
            "PersonSlot": {
              "name": "PersonSlot",
              "value": "michael jackson"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("michael johnson is a well known person");
      expect(result).to.eql(
        {"name": "WellKnownPersonIntent",
          "slots": {
            "PersonSlot": {
              "name": "PersonSlot",
              "value": "michael johnson"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("mark twain is a well known person");
      expect(result).to.eql(
        {"name": "WellKnownPersonIntent",
          "slots": {
            "PersonSlot": {
              "name": "PersonSlot",
              "value": "mark twain"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("alfred hitchcock is a well known person");
      expect(result).to.eql(
        {"name": "WellKnownPersonIntent",
          "slots": {
            "PersonSlot": {
              "name": "PersonSlot",
              "value": "alfred hitchcock"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("sting is a well known person");
      expect(result).to.eql(
        {"name": "WellKnownPersonIntent",
          "slots": {
            "PersonSlot": {
              "name": "PersonSlot",
              "value": "sting"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Person slot matches", function() {
      let result = recognizer.Recognizer.matchText("jonathan ive is a well known person");
      expect(result).to.eql(
        {"name": "WellKnownPersonIntent",
          "slots": {
            "PersonSlot": {
              "name": "PersonSlot",
              "value": "jonathan ive"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.EducationalOrganization slot matches", function() {
      let result = recognizer.Recognizer.matchText("have you graduated from harvard");
      expect(result).to.eql(
        {"name": "EducationalOrganizationIntent",
         "slots": {
          "EducationalOrganizationSlot": {
            "name": "EducationalOrganizationSlot",
            "value": "harvard"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Organization slot matches", function() {
      let result = recognizer.Recognizer.matchText("harvard is just around the corner");
      expect(result).to.eql(
          {"name": "OrganizationIntent",
            "slots": {
              "OrganizationSlot": {
                "name": "OrganizationSlot",
                "value": "harvard"
              }
            }});
    });

    it("verify simple utterance with an AMAZON.Corporation slot matches", function() {
      let result = recognizer.Recognizer.matchText("akamai is a highly valued company");
      expect(result).to.eql(
        {"name": "CorporationIntent",
         "slots": {
          "CorporationSlot": {
            "name": "CorporationSlot",
            "value": "Akamai Technologies"
          }
        }});
    });

    it("verify simple utterance with an AMAZON.Corporation slot matches company with special characters", function() {
      let result = recognizer.Recognizer.matchText("Estée Lauder Companies is a highly valued company");
      expect(result).to.eql(
        {"name": "CorporationIntent",
          "slots": {
            "CorporationSlot": {
              "name": "CorporationSlot",
              "value": "Estée Lauder Companies"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Corporation with INCLUDE_WILDCARD_MATCH slot and special characters matches", function() {
      let result = recognizer.Recognizer.matchText("Bléh corp is an unknown company");
      expect(result).to.eql(
        {"name": "CorporationIntent",
          "slots": {
            "CorporationSlot": {
              "name": "CorporationSlot",
              "value": "Bléh corp"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.AdministrativeArea slot matches", function() {
      let result = recognizer.Recognizer.matchText("post office in portsmouth new hampshire");
      expect(result).to.eql(
        {"name": "AdministrativeAreaIntent",
         "slots": {
          "AdministrativeAreaSlot": {
            "name": "AdministrativeAreaSlot",
            "value": "portsmouth new hampshire"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.US_FIRST_NAME slot matches", function() {
      let result = recognizer.Recognizer.matchText("my first name is jim");
      expect(result).to.eql(
        {"name": "FirstNameIntent",
         "slots": {
          "FirstNameSlot": {
            "name": "FirstNameSlot",
            "value": "Jim"
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
    it("verify simple utterance with an AMAZON.Room slot and with optional options list missing matches", function() {
      let result = recognizer.Recognizer.matchText("Best room is bedroom");
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
    it("verify simple utterance with an AMAZON.Color slot matches", function() {
      let result = recognizer.Recognizer.matchText("my favorite color is amber");
      expect(result).to.eql(
        {"name": "ColorIntent",
         "slots": {
          "ColorSlot": {
            "name": "ColorSlot",
            "value": "amber"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.SportsTeam slot matches", function() {
      let result = recognizer.Recognizer.matchText("Toronto Argonauts is a sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Toronto Argonauts"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot matches", function() {
      let result = recognizer.Recognizer.matchText("Atlanta Braves is a sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Atlanta Braves"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a league parameter matches", function() {
      let result = recognizer.Recognizer.matchText("Toronto Argonauts is a cfl sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Toronto Argonauts"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a wrong league parameter does not match", function() {
      let result = recognizer.Recognizer.matchText("Toronto Argonauts is an nfl sports team");
      expect(typeof result).to.equal("undefined");
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a league parameter matches", function() {
      let result = recognizer.Recognizer.matchText("Toronto Argonauts is a football sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Toronto Argonauts"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a league parameter and alternative name matches", function() {
      let result = recognizer.Recognizer.matchText("Red Sox is a baseball sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Boston Red Sox"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a wrong league parameter does not matche", function() {
      let result = recognizer.Recognizer.matchText("Toronto Argonauts is a baseball sports team");
      expect(typeof result).to.equal("undefined");
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a league parameter matches", function() {
      let result = recognizer.Recognizer.matchText("Arizona Cardinals is an nfl sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Arizona Cardinals"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a sport parameter matches", function() {
      let result = recognizer.Recognizer.matchText("Boston Celtics is a basketball sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Boston Celtics"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with a sport parameter matches", function() {
      let result = recognizer.Recognizer.matchText("Boston Bruins is a hockey sports team");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Boston Bruins"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot with an INCLUDE_PRIOR_NAMES parameter matches", function() {
      let result = recognizer.Recognizer.matchText("Atlanta Hawks used to be known as milwaukee hawks");
      expect(result).to.eql(
        {"name": "SportsTeamIntent",
          "slots": {
            "SportsTeamSlot": {
              "name": "SportsTeamSlot",
              "value": "Atlanta Hawks"
            },
            "SportsTeamTwoSlot": {
              "name": "SportsTeamTwoSlot",
              "value": "Milwaukee Hawks"
            }
          }
        });
    });

    it("verify simple utterance with an AMAZON.SportsTeam slot without an INCLUDE_PRIOR_NAMES parameter does not match on prior name", function() {
      let result = recognizer.Recognizer.matchText("Milwaukee Hawks is now known as Atlanta Hawks");
      expect(typeof result).to.equal("undefined");
    });

    it("verify simple utterance with an AMAZON.Airport slot matches", function() {
      let result = recognizer.Recognizer.matchText("Birmingham Shuttlesworth is an airport");
      expect(result).to.eql(
        {"name": "AirportIntent",
          "slots": {
            "AirportSlot": {
              "name": "AirportSlot",
              "value": "Birmingham–Shuttlesworth International Airport"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Airport slot with special characters matches", function() {
      let result = recognizer.Recognizer.matchText("José Aponte de la Torre Airport is an airport");
      expect(result).to.eql(
        {"name": "AirportIntent",
          "slots": {
            "AirportSlot": {
              "name": "AirportSlot",
              "value": "José Aponte de la Torre Airport"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Airport slot and INCLUDE_WILDCARD_MATCH flag matches", function() {
      let result = recognizer.Recognizer.matchText("Blah Blah Airport is an unknown airport");
      expect(result).to.eql(
        {"name": "AirportIntent",
          "slots": {
            "AirportSlot": {
              "name": "AirportSlot",
              "value": "Blah Blah Airport"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Airport slot and INCLUDE_WILDCARD_MATCH flag with special characters matches", function() {
      let result = recognizer.Recognizer.matchText("Blah Bléh Airport is an unknown airport");
      expect(result).to.eql(
        {"name": "AirportIntent",
          "slots": {
            "AirportSlot": {
              "name": "AirportSlot",
              "value": "Blah Bléh Airport"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Airport slot and COUNTRY flag matches", function() {
      let result = recognizer.Recognizer.matchText("Birmingham Shuttlesworth is a united states airport");
      expect(result).to.eql(
        {"name": "AirportIntent",
          "slots": {
            "AirportSlot": {
              "name": "AirportSlot",
              "value": "Birmingham–Shuttlesworth International Airport"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Airport slot and COUNTRY flag matches", function() {
      let result = recognizer.Recognizer.matchText("Ashburton Aerodrome is an airport in new zealand");
      expect(result).to.eql(
        {"name": "AirportIntent",
          "slots": {
            "AirportSlot": {
              "name": "AirportSlot",
              "value": "Ashburton Aerodrome"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Airport slot and a non-matching COUNTRY flag matches doesn't match", function() {
      let result = recognizer.Recognizer.matchText("Birmingham Shuttlesworth is a canadian airport");
      expect(typeof result).to.equal("undefined");
    });

    it("verify simple utterance with an AMAZON.Airport slot and STATE flag matches", function() {
      let result = recognizer.Recognizer.matchText("Birmingham Shuttlesworth is an airport in alabama");
      expect(result).to.eql(
        {"name": "AirportIntent",
          "slots": {
            "AirportSlot": {
              "name": "AirportSlot",
              "value": "Birmingham–Shuttlesworth International Airport"
            }
          }});
    });

    it("verify simple utterance with an AMAZON.Airport slot and STATE flag matches", function() {
      let result = recognizer.Recognizer.matchText("Birmingham Shuttlesworth is an airport in alaska");
      expect(typeof result).to.equal("undefined");
    });

    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("is JetBlue Airways a budget airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "JetBlue Airways"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("Silver Airways is a regional airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "Silver Airways"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("UPS Airlines is a cargo airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "UPS Airlines"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot with COUNTRY() flag matches", function() {
      let result = recognizer.Recognizer.matchText("West Wind Aviation is a canadian airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "West Wind Aviation"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot  with COUNTRY() flag doesn't match with the non-matching country's airline", function() {
      let result = recognizer.Recognizer.matchText("UPS Airlines is a canadian airline");
      expect(typeof result).to.equal("undefined");
    });

    it("verify simple utterance with an AMAZON.Airline slot with CONTINENT() flag matches", function() {
      let result = recognizer.Recognizer.matchText("West Wind Aviation is a north american airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "West Wind Aviation"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot  with CONTINENT() flag doesn't match with the non-matching country's airline", function() {
      let result = recognizer.Recognizer.matchText("UPS Airlines is a south american airline");
      expect(typeof result).to.equal("undefined");
    });
    it("verify simple utterance with an AMAZON.Airline slot with TYPE() flag matches", function() {
      let result = recognizer.Recognizer.matchText("UPS Airlines is a cargo airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "UPS Airlines"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot with TYPE() flag doesn't match with the non-matching type's airline", function() {
      let result = recognizer.Recognizer.matchText("American Airlines is a cargo airline");
      expect(typeof result).to.equal("undefined");
    });

    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("Volaris is a mexican airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "Volaris"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("MAYAir is a mexican airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "MAYAir"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("LATAM Cargo Mexico is a mexican airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "LATAM Cargo Mexico"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("Aviesa is a mexican airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "Aviesa"
          }
        }});
    });
    it("verify simple utterance with an AMAZON.Airline slot matches", function() {
      let result = recognizer.Recognizer.matchText("Avioquintana is a mexican airline");
      expect(result).to.eql(
        {"name": "AirlineIntent",
         "slots": {
          "AirlineSlot": {
            "name": "AirlineSlot",
            "value": "Avioquintana"
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
    it("verify simple utterance with two TRANSCEND.NUMBER slots matches", function() {
      let result = recognizer.Recognizer.matchText('first number is one hundred thousand and the second number twenty five');
      expect(result).to.eql(
        {"name": "TranscendNumberIntent",
           "slots": {
            "TranscendNumberOneSlot": {
              "name": "TranscendNumberOneSlot",
              "value": "100000"
            },
            "TranscendNumberTwoSlot": {
              "name": "TranscendNumberTwoSlot",
              "value": "25"
            }
          }
        });
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

    it("verify simple utterance with one TRANSCEND.US_PHONE_NUMBER slot matches", function() {
      let result = recognizer.Recognizer.matchText('my mobile number is (123) 456-7890');
      expect(result).to.eql(
        {"name": "UsPhoneNumberIntent",
          "slots": {
            "UsPhoneNumberSlot": {
              "name": "UsPhoneNumberSlot",
              "value": "1234567890"
            }
          }
        });
    });

    it("verify simple utterance with one TRANSCEND.US_PHONE_NUMBER slot matches", function() {
      let result = recognizer.Recognizer.matchText('my mobile number is one twenty three four fifty six seventy eight ninety');
      expect(result).to.eql(
        {"name": "UsPhoneNumberIntent",
          "slots": {
            "UsPhoneNumberSlot": {
              "name": "UsPhoneNumberSlot",
              "value": "1234567890"
            }
          }
        });
    });

  });
  describe("Options List Matches", function() {
    it("verify AMAZON.DATE slot with two option lists and today matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('I can meet with you today');
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
    it("verify AMAZON.DATE slot with two option lists and today matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('I would like to meet with you today');
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
    it("verify AMAZON.DATE slot with two option lists and today matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('I want to meet you today');
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
    it("verify AMAZON.TIME slot and 11 oh five pm matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 11 pm work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
          "slots": {
            "TimeSlot": {
              "name": "TimeSlot",
              "value": "23:00"
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

  describe("Synonym processing", function() {
    it("verify simple utterance with an custom slot that uses synonyms still matches on main value", function() {
      let result = recognizer.Recognizer.matchText("You will find a pan in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });
    it("verify simple utterance with an custom slot that uses synonyms but has EXCLUDE_SYNONYMS_MATCH flag still matches on main value", function() {
      let result = recognizer.Recognizer.matchText("You may find a pan in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });
    it("verify simple utterance with an custom slot matches on synonym", function() {
      let result = recognizer.Recognizer.matchText("You will find a skillet in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });

    it("verify simple utterance with an custom slot does not match on synonym when it has EXCLUDE_SYNONYMS_MATCH flag", function() {
      let result = recognizer.Recognizer.matchText("You may find a skillet in the kitchen");
      expect(typeof result).to.eql("undefined");
    });

    it("verify simple utterance with an custom slot that uses synonyms matches on SOUNDEX of the main value", function() {
      let result = recognizer.Recognizer.matchText("Is a pan in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });

    it("verify simple utterance with an custom slot that uses synonyms still matches on SOUNDEX of the main value when it has EXLUDE_SYNONYMS_MATCH flag", function() {
      let result = recognizer.Recognizer.matchText("there is a pan in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });

    it("verify simple utterance with an custom slot that uses synonyms matches on SOUNDEX of the changed main value", function() {
      let result = recognizer.Recognizer.matchText("Is a pon in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });

    it("verify simple utterance with an custom slot that uses synonyms matches on SOUNDEX of the changed main value when it has EXLUDE_SYNONYMS_MATCH flag", function() {
      let result = recognizer.Recognizer.matchText("There is a pon in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });

    it("verify simple utterance with an custom slot that uses synonyms matches on SOUNDEX of the synonym value", function() {
      let result = recognizer.Recognizer.matchText("Is a skillet in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });

    it("verify simple utterance with an custom slot that uses synonyms does not matches on SOUNDEX of the synonym value when it has EXLUDE_SYNONYMS_MATCH flag", function() {
      let result = recognizer.Recognizer.matchText("There is a skillet in the kitchen");
      expect(typeof result).to.eql("undefined");
    });

    it("verify simple utterance with an custom slot that uses synonyms matches on SOUNDEX of the changed synonym value", function() {
      let result = recognizer.Recognizer.matchText("Is a skiled in the kitchen");
      expect(result).to.eql(
        {"name": "KitchenStuffIntent",
          "slots": {
            "KitchenStuffSlot": {
              "name": "KitchenStuffSlot",
              "value": "Pan"
            }
          }});
    });

    it("verify simple utterance with an custom slot that uses synonyms does not match on SOUNDEX of the changed synonym value when it has EXLUDE_SYNONYMS_MATCH flag", function() {
      let result = recognizer.Recognizer.matchText("There is a skiled in the kitchen");
      expect(typeof result).to.eql("undefined");
    });

  });

  describe("RegExp Custom slot type processing", function() {
    it("verify simple utterance with a  custom slot based on a simple reg exp matches", function() {
      let result = recognizer.Recognizer.matchText("here is ABC123 if you see it");
      expect(result).to.eql({
        "name": "CustomRegExpIntent",
          "slots": {
            "CustomRegExpSlot": {
              "name": "CustomRegExpSlot",
              "value": "ABC123"
            }
          }
      });
    });
    it("verify simple utterance with a  custom slot based on a simple reg exp matches", function() {
      let result = recognizer.Recognizer.matchText("here is XYZ789 if you see it");
      expect(result).to.eql({
        "name": "CustomRegExpIntent",
        "slots": {
          "CustomRegExpSlot": {
            "name": "CustomRegExpSlot",
            "value": "XYZ789"
          }
        }
      });
    });
    it("verify simple utterance with a custom slot based on a simple reg exp loaded from a file matches", function() {
      let result = recognizer.Recognizer.matchText("here is the second XYZ789");
      expect(result).to.eql({
        "name": "CustomRegExpTwoIntent",
        "slots": {
          "CustomRegExpTwoSlot": {
            "name": "CustomRegExpTwoSlot",
            "value": "XYZ789"
          }
        }
      });
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
      let result1 = recognizer.Recognizer.matchText("test me");
      result1 = recognizer.Recognizer.matchText("Help");
      let result = recognizer.Recognizer.matchText("One of the minions is stewart");
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

    it("verify that an intent with a custom slot with a built in transform function will parse", function() {
      let result = recognizer.Recognizer.matchText("this is bar");
      expect(result).to.eql(
        {
          "name": "MeaninglessIntent",
          "slots": {
            "MeaninglessSlot": {
              "name": "MeaninglessSlot",
              "value": "BAR"
            }
          }
        });
    });

    it("verify that an intent with a custom slot with chained built in transform functions will parse", function() {
      let result = recognizer.Recognizer.matchText("this too is bartwo");
      expect(result).to.eql(
        {
          "name": "MeaninglessTwoIntent",
          "slots": {
            "MeaninglessTwoSlot": {
              "name": "MeaninglessTwoSlot",
              "value": "{<[(BARTWO)]>}"
            }
          }
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
    it("verify that an intent with a AMAZON.Month slot with a transform function will parse", function() {
      let result = recognizer.Recognizer.matchText("january is the best month");
      expect(result).to.eql(
        {
          "name": "MonthIntent",
          "slots": {
            "MonthSlot": {
              "name": "MonthSlot",
              "value": "January"
            }
          }
        });
    });
  });

  describe("TRANSCEND.US_PRESIDENT processing", function() {
    it("verify TRANSCEND.US_PRESIDENT slot matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("Thomas Jefferson was united states president");
      expect(result).to.eql(
        {
          "name": "TranscendPresidentsIntent",
          "slots": {
            "TranscendPresidentsSlot": {
              "name": "TranscendPresidentsSlot",
              "value": "Thomas Jefferson"
            }
          }
        });
    });
    it("verify TRANSCEND.US_PRESIDENT slot matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("20th president was united states president");
      expect(result).to.eql(
        {
          "name": "TranscendPresidentsIntent",
          "slots": {
            "TranscendPresidentsSlot": {
              "name": "TranscendPresidentsSlot",
              "value": "James A. Garfield"
            }
          }
        });
    });

  });

  describe("Text equivalent processing", function() {
    it("verify an utterance containing two text equivalents matches on the original and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("Hi what is the time please");
      expect(result).to.eql(
        {
          "name": "HiIntent",
          "slots": {}
        });
    });
    it("verify an utterance containing two text equivalents with one missing matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("Hello what is the time");
      expect(result).to.eql(
        {
          "name": "HiIntent",
          "slots": {}
        });
    });
  });

  describe("Mix in processing", function() {
    it("verify an utterance containing actual count slot matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("I would like five appetizers");
      expect(result).to.eql(
        {
          "name": "VagueCountIntent",
          "slots": {
            "CountSlot": {
              "name": "CountSlot",
              "value": "5"
            }
          },
          "wordCount": 1
        });
    });
    it("verify an utterance containing implied count of one matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("I would like an appetizer");
      expect(result).to.eql(
        {
          "name": "VagueCountIntent",
          "slots": {
            "CountSlot": {
              "name": "CountSlot",
              "value": "1"
            }
          },
          "wordCount": 1
        });
    });
    it("verify an utterance containing implied count of two matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("I would like a couple of appetizers");
      expect(result).to.eql(
        {
          "name": "VagueCountIntent",
          "slots": {
            "CountSlot": {
              "name": "CountSlot",
              "value": "2"
            }
          },
          "wordCount": 1
        });
    });
    it("verify an utterance containing implied count of three matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("I would like some appetizers");
      expect(result).to.eql(
        {
          "name": "VagueCountIntent",
          "slots": {
            "CountSlot": {
              "name": "CountSlot",
              "value": "3"
            }
          },
          "wordCount": 1
        });
    });
    it("verify an utterance containing implied count of four matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("I would like a few appetizers");
      expect(result).to.eql(
        {
          "name": "VagueCountIntent",
          "slots": {
            "CountSlot": {
              "name": "CountSlot",
              "value": "4"
            }
          },
          "wordCount": 1
        });
    });
    it("verify a match on an intent with slots matches, is modified accordingly by mix ins into a different result, and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("Morph me 3 times");
      expect(result).to.eql(
        {
          "name": "DateIntent",
          "slots": {
            "DateSlot": {
              "name": "DateSlot",
              "value": "2017-10-12"
            }
          },
          "regExpMatch": {
            "regExp": "(e)",
            "matchCount": 2
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single term", function() {
      let result = recognizer.Recognizer.matchText("AFINN this is terrible");
      expect(result).to.eql(
        {
          "name": "AfinnIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single term", function() {
      let result = recognizer.Recognizer.matchText("AFINN this is something cool");
      expect(result).to.eql(
        {
          "name": "AfinnIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 1
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single term", function() {
      let result = recognizer.Recognizer.matchText("AFINN this is cool stuff");
      expect(result).to.eql(
        {
          "name": "AfinnIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single term", function() {
      let result = recognizer.Recognizer.matchText("AFINN Precompiled Two this is terrible");
      expect(result).to.eql(
        {
          "name": "AfinnPrecompiledTwoIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single term", function() {
      let result = recognizer.Recognizer.matchText("AFINN Precompiled Two this is something cool");
      expect(result).to.eql(
        {
          "name": "AfinnPrecompiledTwoIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 1
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single term", function() {
      let result = recognizer.Recognizer.matchText("AFINN Precompiled Two this is cool stuff");
      expect(result).to.eql(
        {
          "name": "AfinnPrecompiledTwoIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :|");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :]]]]]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :]]]]]] :]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :] :]]]]]] :]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :] :]] :]]]]]] :]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :] :]]]]]]]]] :]] :]]]]]] :]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :[[[[[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :[[[[[[ :[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :[ :[[[[[[ :[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :[ :[[ :[[[[[[ :[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :[ :[[[[[[[[[ :[[ :[[[[[[ :[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]: ]]:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]: ]]]]]]: ]]:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]: ]]: ]]]]]]: ]]:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]: ]]]]]]]]]: ]]: ]]]]]]: ]]:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :']");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :']]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :']]]]]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :']]]]]] :']]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'] :']]]]]] :']]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'] :']] :']]]]]] :']]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'] :']]]]]]]]] :']] :']]]]]] :']]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[': [[':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [': [[[[[[': [[':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [': [[': [[[[[[': [[':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [': [[[[[[[[[': [[': [[[[[[': [[':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'[[[[[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'[[[[[[ :'[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'[ :'[[[[[[ :'[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'[ :'[[ :'[[[[[[ :'[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'[ :'[[[[[[[[[ :'[[ :'[[[[[[ :'[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]': ]]':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]': ]]]]]]': ]]':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]': ]]': ]]]]]]': ]]':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]': ]]]]]]]]]': ]]': ]]]]]]': ]]':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :}");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :/");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :\\");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :*");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-|");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-]]]]]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-]]]]]] :-]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-] :-]]]]]] :-]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-] :-]] :-]]]]]] :-]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-] :-]]]]]]]]] :-]] :-]]]]]] :-]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-[[[[[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-[[[[[[ :-[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-[ :-[[[[[[ :-[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-[ :-[[ :-[[[[[[ :-[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-[ :-[[[[[[[[[ :-[[ :-[[[[[[ :-[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });


    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-}");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :->");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-*");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE *-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-D");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-P");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-S");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-p");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-/");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE \\-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE /-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-\\");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'|");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE |:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE \\:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE *:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE S:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE d:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE q:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^]]]]]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^]]]]]] :^]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^] :^]]]]]] :^]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^] :^]] :^]]]]]] :^]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^] :^]]]]]]]]] :^]] :^]]]]]] :^]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[^: [[^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [^: [[[[[[^: [[^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [^: [[^: [[[[[[^: [[^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [^: [[[[[[[[[^: [[^: [[[[[[^: [[^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^[[[[[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^[[[[[[ :^[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^[ :^[[[[[[ :^[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^[ :^[[ :^[[[[[[ :^[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^[ :^[[[[[[[[[ :^[[ :^[[[[[[ :^[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]^: ]]^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]^: ]]]]]]^: ]]^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]^: ]]^: ]]]]]]^: ]]^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]^: ]]]]]]]]]^: ]]^: ]]]]]]^: ]]^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^|");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE |^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^?");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^>");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE <^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^*");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE *^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^D");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^P");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^S");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE S^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^p");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE d^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE q^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^/");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE \\^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^\\");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE /^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE \\':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE /':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE <-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE d-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE q-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE <':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE *':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE S':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE d':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE q':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE /:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });


    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE {:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE }:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE |':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE |-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'?");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'>");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'*");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'D");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'P");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'S");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'p");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'/");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'\\");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :D");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :P");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :S");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :p");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :o)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE );");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ));");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))))));");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )))))); ));");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ); )))))); ));");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ); )); )))))); ));");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ); ))))))))); )); )))))); ));");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[; [[;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [; [[[[[[; [[;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [; [[; [[[[[[; [[;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [; [[[[[[[[[; [[; [[[[[[; [[;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;[[[[[[");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;]]]]]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;]]]]]] ;]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;] ;]]]]]] ;]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;] ;]] ;]]]]]] ;]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;] ;]]]]]]]]] ;]] ;]]]]]] ;]]");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((; ((;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (; ((((((; ((;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (; (((((((((; ((; ((((((; ((;");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((: ((:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (: ((((((: ((:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (: ((: ((((((: ((:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (: (((((((((: ((: ((((((: ((:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ):");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )):");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )))))):");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )))))): )):");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ): )))))): )):");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ): )): )))))): )):");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ): ))))))))): )): )))))): )):");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[: [[:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [: [[[[[[: [[:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [: [[: [[[[[[: [[:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [: [[[[[[[[[: [[: [[[[[[: [[:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((-: ((-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (-: ((((((-: ((-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (-: ((-: ((((((-: ((-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (-: (((((((((-: ((-: ((((((-: ((-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))))))-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))))))-: ))-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )-: ))))))-: ))-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )-: ))-: ))))))-: ))-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )-: )))))))))-: ))-: ))))))-: ))-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [[[[[[-: [[-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [-: [[[[[[-: [[-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [-: [[-: [[[[[[-: [[-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE [-: [[[[[[[[[-: [[-: [[[[[[-: [[-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]]]]]]-: ]]-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]-: ]]]]]]-: ]]-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]-: ]]-: ]]]]]]-: ]]-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ]-: ]]]]]]]]]-: ]]-: ]]]]]]-: ]]-:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((^: ((^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (^: ((((((^: ((^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (^: ((^: ((((((^: ((^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (^: (((((((((^: ((^: ((((((^: ((^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))))))^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))))))^: ))^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )^: ))))))^: ))^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )^: ))^: ))))))^: ))^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )^: )))))))))^: ))^: ))))))^: ))^:");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-D");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =/");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =\\");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =^/");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -1
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =P");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE \\o/");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ♥");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :{");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-{");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE <3");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-)))))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-))))))))) :-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a tripple subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-) :-))))))))) :-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-) :-)) :-))))))))) :-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-) :-))))))) :-)) :-))))))))) :-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ://");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 0
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :)))))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a double subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :))))))))) :))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a tripple subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :) :))))))))) :))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });
    it("verify sentiment analysis is computed correctly for a multiple subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :) :)) :))))))))) :))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple subset emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :) :))))))) :)) :))))))))) :))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-(((((( :-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for tripple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-( :-(((((( :-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-( :-(( :-(((((( :-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :-( :-((((((((( :-(( :-(((((( :-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :(((((( :((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for tripple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :( :(((((( :((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :( :(( :(((((( :((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :( :((((((((( :(( :(((((( :((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;(((((( ;((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for tripple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;( ;(((((( ;((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;( ;(( ;(((((( ;((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;( ;((((((((( ;(( ;(((((( ;((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;)))))) ;))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;) ;)))))) ;))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;) ;)) ;)))))) ;))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;) ;))))))))) ;)) ;)))))) ;))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-(((((( ;-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-( ;-(((((( ;-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-( ;-(( ;-(((((( ;-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-( ;-((((((((( ;-(( ;-(((((( ;-((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-)))))) ;-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-) ;-)))))) ;-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-) ;-)) ;-)))))) ;-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;-) ;-))))))))) ;-)) ;-)))))) ;-))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :')))))) :'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :') :')))))) :'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :') :')) :')))))) :'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :') :'))))))))) :')) :')))))) :'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ((((((': ((':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (': ((((((': ((':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (': ((': ((((((': ((':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE (': (((((((((': ((': ((((((': ((':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))))))':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ))))))': ))':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )': ))))))': ))':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )': ))': ))))))': ))':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE )': )))))))))': ))': ))))))': ))':");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'(((((( :'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'( :'(((((( :'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'( :'(( :'(((((( :'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :'( :'((((((((( :'(( :'(((((( :'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;') ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;') ;')) ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;') ;'))))))))) ;')) ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'(((((( ;'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'( ;'(((((( ;'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'( ;'(( ;'(((((( ;'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'( ;'((((((((( ;'(( ;'(((((( ;'((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^)))))) :^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^) :^)))))) :^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^) :^)) :^)))))) :^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^) :^))))))))) :^)) :^)))))) :^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^(((((( :^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^( :^(((((( :^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^( :^(( :^(((((( :^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE :^( :^((((((((( :^(( :^(((((( :^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^)))))) ;^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^) ;^)))))) ;^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^) ;^)) ;^)))))) ;^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for multiple emojis", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^) ;^))))))))) ;^)) ;^)))))) ;^))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^(((((( ;^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^( ;^(((((( ;^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^( ;^(( ;^(((((( ;^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;^( ;^((((((((( ;^(( ;^(((((( ;^((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =(((((( =((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =( =(((((( =((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =( =(( =(((((( =((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =( =((((((((( =(( =(((((( =((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =)");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =)))))) =))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =) =)))))) =))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =) =)) =)))))) =))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =) =))))))))) =)) =)))))) =))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =')");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =')))))) ='))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =') =')))))) ='))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =') =')) =')))))) ='))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE =') ='))))))))) =')) =')))))) ='))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='((((((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='(((((( ='((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='( ='(((((( ='((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='( ='(( ='(((((( ='((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ='( ='((((((((( ='(( ='(((((( ='((");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;')");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 2
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 3
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'))))))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 4
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a double emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 7
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a triple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;') ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 9
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;') ;')) ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 12
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a multiple emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;') ;'))))))))) ;')) ;')))))) ;'))");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": 16
            }
          }
        });
    });

    it("verify sentiment analysis is computed correctly for a single emoji", function() {
      let result = recognizer.Recognizer.matchText("AFINNEMOTE ;'(");
      expect(result).to.eql(
        {
          "name": "AfinnEmoticonIntent",
          "slots": {},
          "sentiment": {
            "AFINN": {
              "score": -2
            }
          }
        });
    });


  });

  /*
    describe("TRANSCEND.US_LAST_NAME processing", function() {
      it("get timing of loading entire last name json", function() {
        let entireLastNameList = require("../builtinslottypes/uslastnames.json");
        let soundexCompute = require("../soundex.js");
        let foundZulu = false;
        let totalCount = 0;
        for(let i = 0; i < entireLastNameList.values.length; i++){
          totalCount += entireLastNameList.values[i].count;
  //        let soundex = soundexCompute.simple.soundEx(entireLastNameList.values[i].name);
  //        entireLastNameList.values[i].soundex = soundex;
          if(entireLastNameList.values[i].name == "ZULU"){
            foundZulu = true;
            console.log("ZULU at index: " + i);
          }
        }
        console.log("total count: " + totalCount);
  //      console.log(JSON.stringify(entireLastNameList, null, 2));
        expect(foundZulu).to.equal(true);
      });

    });
  */
});

describe("domain parsing", function() {
  describe("Simple Domain Parsing", function () {
    it("verify simplest domain parses", function () {
      let result = recognizer.Recognizer.matchDomain("Hi what is the time please", "./test/testDomainSimplest1.json");
      expect(result).to.eql(
        {"match":
          {
            "name": "HiIntent",
            "slots": {}
          }
        }
        );
    });
    it("verify simplest domain parses", function () {
      let domain = require("../test/testDomainSimplest2.json");
      let loadedRecognizer = require("../recognizer.json");
      domain.recognizers[0].recognizer = loadedRecognizer;
      let result = recognizer.Recognizer.matchDomain("Hi what is the time please", domain);
      expect(result).to.eql(
        {"match":
          {
            "name": "HiIntent",
            "slots": {}
          }
        }
      );
    });
    it("verify multi recognizer domain parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let result = recognizer.Recognizer.matchDomain("nice day isn't it", domain);
      expect(result).to.eql(
        {"match":
          {
            "name": "NiceDayIntent",
            "slots": {}
          }
        }
      );
    });
    it("verify multi recognizer domain with non default match criteria and a hardcoded accessor parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let stateAccessor = {
        "getState": function(selector){
          return {"flow": "TEST_FLOW"};
        }
      };
      let result = recognizer.Recognizer.matchDomain("nice suit", domain, stateAccessor);
      expect(result).to.eql(
        {
          "match":
          {
            "name": "ComplimentIntent",
            "slots": {}
          },
          "result": {
            "text": "Thanks"
          }
        }
      );
    });

    it("verify multi recognizer domain with non default match criteria and a state sub select accessor parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let stateAccessor = {
        "getState": function(state, selector){
          return state[selector];
        }
      };
      let result = recognizer.Recognizer.matchDomain("nice suit", domain, stateAccessor, [], applicationState);
      expect(result).to.eql(
        {
          "match":
          {
            "name": "ComplimentIntent",
            "slots": {}
          },
          "result": {
            "text": "Thanks"
          }
        }
      );
    });

    it("verify multi recognizer domain with non default match criteria returning a single result and a state sub select accessor parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW_2"
        }
      };
      let stateAccessor = {
        "getState": function(selector){
          return applicationState[selector];
        }
      };
      let result = recognizer.Recognizer.matchDomain("nice suit", domain, stateAccessor, [], applicationState);
      expect(result).to.eql(
        {
          "match":
            {
              "name": "ComplimentIntent",
              "slots": {}
            },
          "result": {"text": "Thank you"}
        }
      );
    });

    it("verify multi recognizer domain with non default match criteria returning a random value from result array and a state sub select accessor parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW_3"
        }
      };
      let allowableValues = [
        {"text": "Thanks a bunch"},
        {"text": "Danke"},
        {"text": "I agree"}
      ];
      let basicStateAccessor = require("../builtinstateaccessors/basic.js");
      let stateAccessor = new basicStateAccessor(applicationState);
      let result = recognizer.Recognizer.matchDomain("nice suit", domain, stateAccessor, [], applicationState);
//      console.log("result: ", result);
      expect(result.match).to.eql(
        {
          "name": "ComplimentIntent",
          "slots": {}
        }
      );
      let isAllowable = false;
      for(let i = 0; i < allowableValues.length; i++){
//        console.log("JSON.stringify(result.result): " + JSON.stringify(result.result) + ", JSON.stringify(allowableValues[i]): " + JSON.stringify(allowableValues[i]));
        if(JSON.stringify(result.result) === JSON.stringify(allowableValues[i])){
          isAllowable = true;
          break;
        }
      }
      expect(isAllowable).to.equal(true);
    });

    it("verify multi recognizer domain with non default match criteria returning a random value from result array and a state sub select accessor parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let originalUsedValues = [
        {"text": "Thanks a bunch"},
        {"text": "Danke"}
      ];
      let usedValues = [
        {"text": "Thanks a bunch"},
        {"text": "Danke"}
      ];
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW_4"
        },
        "squirrelledAwayAlreadyUsed" : usedValues
      };
      let allowableValues = [
        {"text": "Thanks a bunch"},
        {"text": "Danke"},
        {"text": "I agree"}
      ];
      let stateAccessor = {
        "getState": function(selector){
          return applicationState[selector];
        },
        "getStateChain": function(selectors){
          return applicationState[selectors[0]];
        },
        "setState": function(selector, newValue){
          applicationState[selector] = newValue;
        },
        "setStateChain": function(selectors, newValue){
          applicationState[selectors[0]] = newValue;
        }

      };
      let result = recognizer.Recognizer.matchDomain("nice suit", domain, stateAccessor, [], applicationState);
      expect(result.match).to.eql(
        {
          "name": "ComplimentIntent",
          "slots": {}
        }
      );
      let isAllowable = false;
      for(let i = 0; i < allowableValues.length; i++){
//        console.log("JSON.stringify(result.result): " + JSON.stringify(result.result) + ", JSON.stringify(allowableValues[i]): " + JSON.stringify(allowableValues[i]));
        if(JSON.stringify(result.result) === JSON.stringify(allowableValues[i])){
          isAllowable = true;
          break;
        }
      }
      expect(isAllowable).to.equal(true);

      let isUsed = false;
      for(let i = 0; i < originalUsedValues.length; i++){
//        console.log("JSON.stringify(result.result): " + JSON.stringify(result.result) + ", JSON.stringify(usedValues[i]): " + JSON.stringify(usedValues[i]));
        if(JSON.stringify(result.result) === JSON.stringify(originalUsedValues[i])){
          isUsed = true;
          break;
        }
      }
      expect(isUsed).to.equal(false);
    });

    it("verify multi recognizer domain with non default match criteria returning a random value from result array and a state sub select accessor using built in basic state accessor parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let usedValues = [
        {"text": "Thanks a bunch"},
        {"text": "Danke"}
      ];
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW_4"
        },
        "squirrelledAwayAlreadyUsed" : usedValues
      };
      let allowableValues = [
        {"text": "Thanks a bunch"},
        {"text": "Danke"},
        {"text": "I agree"}
      ];
      let basicStateAccessor = require("../builtinstateaccessors/basic.js");
      let stateAccessor = new basicStateAccessor(applicationState);

      let result = recognizer.Recognizer.matchDomain("nice suit", domain, stateAccessor, [], applicationState);
      expect(result.match).to.eql(
        {
          "name": "ComplimentIntent",
          "slots": {}
        }
      );
      let isAllowable = false;
      for(let i = 0; i < allowableValues.length; i++){
//        console.log("JSON.stringify(result.result): " + JSON.stringify(result.result) + ", JSON.stringify(allowableValues[i]): " + JSON.stringify(allowableValues[i]));
        if(JSON.stringify(result.result) === JSON.stringify(allowableValues[i])){
          isAllowable = true;
          break;
        }
      }
      expect(isAllowable).to.equal(true);

      let isUsed = false;
      for(let i = 0; i < usedValues.length; i++){
//        console.log("JSON.stringify(result.result): " + JSON.stringify(result.result) + ", JSON.stringify(usedValues[i]): " + JSON.stringify(usedValues[i]));
        if(JSON.stringify(result.result) === JSON.stringify(usedValues[i])){
          isUsed = true;
          break;
        }
      }
      expect(isUsed).to.equal(false);
    });
/* TODO add this test back once trusted domains are fully implemented
    it("verify domain with subdomain parses", function () {
      let domain = require("../test/blahblahdomain/blahblahdomain.json");
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let stateAccessor = {
        "getState": function(state, selector){
          return state[selector];
        },
        "createSubAccessor": function(){
          return stateAccessor;
        }
      };
      let result = recognizer.Recognizer.matchDomain("good morning to you", domain, stateAccessor, [], applicationState);
      expect(result).to.eql(
        {"match":
          {
            "name": "GrumbleIntent",
            "slots": {}
          }
        }
      );
    });
*/
    it("verify built in simple read-only state accessor's getState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let readOnlyStateAccessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new readOnlyStateAccessor(applicationState);

      let result = simpleAccessor.getState("selectthis");
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in simple read-only state accessor's getStateChain function works with a single element", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let readOnlyStateAccessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new readOnlyStateAccessor(applicationState);

      let result = simpleAccessor.getStateChain(["selectthis"]);
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in simple read-only state accessor's getStateChain function works with multiple elements", function () {
      let applicationState = {
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "TEST_FLOW"
          }
        }
      };
      let readOnlyStateAccessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new readOnlyStateAccessor(applicationState);

      let result = simpleAccessor.getStateChain(["somethingelse", "selectthis"]);
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in simple read-only state accessor's setState function does nothing", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let readOnlyStateAccessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new readOnlyStateAccessor(applicationState);

      simpleAccessor.setState("selectthis", {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });

    it("verify built in simple read-only state accessor's setStateChain function does nothing", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let readOnlyStateAccessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new readOnlyStateAccessor(applicationState);

      simpleAccessor.setStateChain(["selectthis"], {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });

    it("verify built in base state accessor's getState function doesn't works", function () {
      let accessor = require("../builtinstateaccessors/base.js");
      let accessorInstance = new accessor();

      let result = accessorInstance.getState("selectthis");
      expect(typeof result).to.equal("undefined");
    });

    it("verify built in base object state accessor's getState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/baseobject.js");
      let accessorInstance = new accessor(applicationState);

      let result = accessorInstance.getState("selectthis");
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in basic read only state accessor's getState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let accessorInstance = new accessor(applicationState);

      let result = accessorInstance.getState("selectthis");
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in basic read only state accessor's setState function doesn't works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let accessorInstance = new accessor(applicationState);

      accessorInstance.setState("selectthis", {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });

    it("verify built in basic read/write state accessor's setState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let accessorInstance = new accessor(applicationState);

      accessorInstance.setState("selectthis", {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "NEW_FLOW"
        }
      });
    });

    it("verify built in basic read/write state accessor's setStateChain function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "TEST_FLOW"
          }
        }
      };
      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let accessorInstance = new accessor(applicationState);
      accessorInstance.setStateChain(["somethingelse", "selectthis"], {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "NEW_FLOW"
          }
        }
      });
    });

    it("verify built in basic read/write state accessor's mergeReplaceState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "somethingelse": {
          "keepthis": {
            "oldstuff": "was here before the call"
          },
          "replacethis": {
            "flow": "TEST_FLOW"
          }

        }
      };
      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let accessorInstance = new accessor(applicationState);
      accessorInstance.setStateChain(["somethingelse"], {"replacethis": {"flow": "NEW_FLOW"}, "addthis": {"newstuff": "added by mergeReplaceState call"}});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "somethingelse": {
          "addthis": {
            "newstuff": "added by mergeReplaceState call"
          },
          "replacethis": {
            "flow": "NEW_FLOW"
          }
        }
      });
    });

    it("verify built in basic read/write state accessor's getState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);

      let result = accessorInstance.getState("selectthis");
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in basic read/write state accessor's setState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);

      accessorInstance.setState("selectthis", {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "NEW_FLOW"
        }
      });
    });

    it("verify built in basic read/write state accessor's setStateChain function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "TEST_FLOW"
          }
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);
      accessorInstance.setStateChain(["somethingelse", "selectthis"], {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "NEW_FLOW"
          }
        }
      });
    });

    it("verify built in basic read/write state accessor's mergeReplaceState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "somethingelse": {
          "keepthis": {
            "oldstuff": "was here before the call"
          },
          "replacethis": {
            "flow": "TEST_FLOW"
          }

        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);
      accessorInstance.setStateChain(["somethingelse"], {"replacethis": {"flow": "NEW_FLOW"}, "addthis": {"newstuff": "added by mergeReplaceState call"}});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "somethingelse": {
          "addthis": {
            "newstuff": "added by mergeReplaceState call"
          },
          "replacethis": {
            "flow": "NEW_FLOW"
          }
        }
      });
    });

    it("verify built in simple state accessor's getState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);

      let result = accessorInstance.getState("selectthis");
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in simple state accessor's getStateChain function works with a single element", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);

      let result = accessorInstance.getStateChain(["selectthis"]);
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in simple state accessor's getStateChain function works with multiple elements", function () {
      let applicationState = {
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "TEST_FLOW"
          }
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);

      let result = accessorInstance.getStateChain(["somethingelse", "selectthis"]);
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in simple state accessor's setState function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);

      accessorInstance.setState("selectthis", {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "NEW_FLOW"
        }
      });
    });

    it("verify built in simple state accessor's setState function works when the new value is undefined", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);
      accessorInstance.setState("selectthis");
      expect(applicationState).to.eql({
        "something": "this is not relevant"
      });
    });

    it("verify built in simple state accessor's setState function works when the new value is null", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);
      accessorInstance.setState("selectthis", null);
      expect(applicationState).to.eql({
        "something": "this is not relevant"
      });
    });

    it("verify built in simple state accessor's setStateChain function works", function () {
      let applicationState = {
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "TEST_FLOW"
          }
        }
      };
      let accessor = require("../builtinstateaccessors/basic.js");
      let accessorInstance = new accessor(applicationState);
      accessorInstance.setStateChain(["somethingelse", "selectthis"], {"flow": "NEW_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "somethingelse": {
          "selectthis": {
            "flow": "NEW_FLOW"
          }
        }
      });
    });

    it("verify built in base object state accessor's getSubAccessor function generates an instance of base object accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobject.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      expect(subAccessor instanceof accessor).to.equal(true);
    });

    it("verify built in base object state accessor's getSubAccessor function without trusted domain argument works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobject.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      let result = subAccessor.getState();
      expect(result).to.eql({});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        },
        "untrusted": {}
      });
    });

    it("verify built in base object state accessor's getSubAccessor function with trusted domain argument works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobject.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor([], {"read": true, "write": true});
      let result = subAccessor.getState();
      expect(result).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });

    it("verify built in base object state accessor's getSubAccessor function without trusted domain argument works for getting partial state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobject.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis");
      let result = subAccessor.getState();
      expect(result).to.eql({});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW",
          "untrusted": {}
        }
      });
    });

    it("verify built in base object state accessor's getSubAccessor function with trusted domain argument produces read only accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobject.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis", {"read": true, "write": true});
      subAccessor.setState("flow", "NEW_FLOW");
      let result = subAccessor.getState();
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in read only object state accessor's getSubAccessor function generates an instance of read only object accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      expect(subAccessor instanceof accessor).to.equal(true);
    });

    it("verify built in read only object state accessor's getSubAccessor function with no arguments works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      let result = subAccessor.getState();
      expect(result).to.eql({});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        },
        "untrusted": {}
      });
    });

    it("verify built in read only object state accessor's getSubAccessor function with trusted domain argument works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor([], {"read": true, "write": true});
      let result = subAccessor.getState();
      expect(result).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });

    it("verify built in read only object state accessor's getSubAccessor function works for getting partial state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis");
      let result = subAccessor.getState();

      expect(result).to.eql({});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW",
          "untrusted": {}
        }
      });
    });

    it("verify built in read only object state accessor's getSubAccessor function works for getting partial state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis", {"read": true, "write": true});
      let result = subAccessor.getState();

      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in read only object state accessor's getSubAccessor function without trusted domain argument produces read only accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis");
      subAccessor.setState("flow", "NEW_FLOW");
      let result = subAccessor.getState();
      expect(result).to.eql({});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW",
          "untrusted": {}
        }
      });
    });

    it("verify built in read only object state accessor's getSubAccessor function with trusted domain argument produces read only accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basicreadonly.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis", {"read": true, "write": true});
      subAccessor.setState("flow", "NEW_FLOW");
      let result = subAccessor.getState();
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });


    it("verify built in base object read write state accessor's getSubAccessor function generates an instance of base object read write accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      expect(subAccessor instanceof accessor).to.equal(true);
    });

    it("verify built in base read write state accessor's getSubAccessor function without trusted domain argument works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      let result = subAccessor.getState();
      expect(result).to.eql({});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        },
        "untrusted": {}
      });
    });

    it("verify built in base read write state accessor's getSubAccessor function with trusted domain argument works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor([], {"read": true, "write": true});
      let result = subAccessor.getState();
      expect(result).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });

    it("verify built in base read write state accessor's getSubAccessor function without trusted domain argument works for getting partial state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis");
      let result = subAccessor.getState();
      expect(result).to.eql({});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW",
          "untrusted": {}
        }
      });
    });

    it("verify built in base read write state accessor's getSubAccessor function with trusted domain argument works for getting partial state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis", {"read": true, "write": true});
      let result = subAccessor.getState();
      expect(result).to.eql({"flow": "TEST_FLOW"});
    });

    it("verify built in base read write state accessor's getSubAccessor function produces read write accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/baseobjectrw.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis");
      subAccessor.setState("flow", "NEW_FLOW");
      let result = subAccessor.getState();
      expect(result).to.eql({"flow": "NEW_FLOW"});
    });

    it("verify built in basic read write state accessor's getSubAccessor function generates an instance of basic read write accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basic.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      expect(subAccessor instanceof accessor).to.equal(true);
    });

    it("verify built in basic read write state accessor's getSubAccessor function with no arguments works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basic.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor();
      let result = subAccessor.getState();
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        },
        "untrusted": {}
      });
      expect(result).to.eql({});
    });


    it("verify built in basic read write state accessor's getSubAccessor function with trusted domain argument works for getting the whole state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basic.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor([], {"read": true, "write": true});
      let result = subAccessor.getState();
      expect(result).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });

    it("verify built in basic read write state accessor's getSubAccessor function with no arguments works for getting partial state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basic.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis");
      let result = subAccessor.getState();
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW",
          "untrusted": {}
        }
      });
      expect(result).to.eql({});
    });

    it("verify built in basic read write state accessor's getSubAccessor function with trusted domain argument works for getting partial state sub accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basic.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis", {"read": true, "write": true});
      let result = subAccessor.getState();
      expect(result).to.eql({"flow": "TEST_FLOW"});
      expect(applicationState).to.eql({
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      });
    });


    it("verify built in basic read write state accessor's getSubAccessor function produces read write accessor", function () {
      let applicationState = {
        "something": "this is not relevant",
        "selectthis": {
          "flow": "TEST_FLOW"
        }
      };

      let accessor = require("../builtinstateaccessors/basic.js");
      let simpleAccessor = new accessor(applicationState);

      let subAccessor = simpleAccessor.createSubAccessor("selectthis");
      subAccessor.setState("flow", "NEW_FLOW");
      let result = subAccessor.getState();
      expect(result).to.eql({"flow": "NEW_FLOW"});
    });





  });
});

describe("utterance parser", function() {
  describe("Simple JSON Parsing", function() {
    it("verify simple utterance without slots and just one word parses into json", function() {
      let result = parser.parseUtteranceIntoJson("test me");
      expect(result).to.eql({"intentName": "test", "parsedUtterance": ["me"]});
    });
    it("verify simple utterance without slots and multiple words parses into json", function() {
      let result = parser.parseUtteranceIntoJson("test me now and again");
      expect(result).to.eql({"intentName": "test", "parsedUtterance": ["me now and again"]});
    });
    it("verify simple utterance with just one slot parses into json", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot} too", intentSchema);
      expect(result).to.eql(
        {"intentName": "AnotherIntent",
         "parsedUtterance": [
           "me ",
           {
             "type": "slot",
             "slotType": "SOME",
             "name": "SomeSlot"
           },
           " too"
         ]});
    });
    it("verify simple utterance just one slot with one flag parses into json", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot:INCLUDE_VALUES_MATCH} too", intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance with just one slot with two flags parses into json", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot:INCLUDE_VALUES_MATCH, EXCLUDE_WILDCARD_MATCH} too", intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance two slots with two flags parses into json", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me { SomeSlot : INCLUDE_VALUES_MATCH , EXCLUDE_WILDCARD_MATCH} too {SomeOtherSlot: EXCLUDE_VALUES_MATCH, INCLUDE_WILDCARD_MATCH}", intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too ",
            {
              "type": "slot",
              "slotType": "SOMEOTHER",
              "name": "SomeOtherSlot",
              "flags": [
                {
                  "name": "EXCLUDE_VALUES_MATCH"
                },
                {
                  "name": "INCLUDE_WILDCARD_MATCH"
                }
              ]
            }
          ]});
    });
    it("verify simple utterance just one slot with one parameterized flag parses into json", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot:COUNTRY([\"united states\"])} too", intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "COUNTRY",
                  "parameters": [
                    "united states"
                  ]
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with two parameterized flags parses into json", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot: COUNTRY([ \"united states\" ]) , CONTINENT([\"north america\"])} too", intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "COUNTRY",
                  "parameters": [
                    "united states"
                  ]
                },
                {
                  "name": "CONTINENT",
                  "parameters": [
                    "north america"
                  ]
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with two parameterized flags and one of them having multiple parameters parses into json", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot: COUNTRY([ \"united states\" , \"canada\" , \"mexico\" ]) , CONTINENT([\"north america\"])} too", intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "COUNTRY",
                  "parameters": [
                    "united states",
                    "canada",
                    "mexico"
                  ]
                },
                {
                  "name": "CONTINENT",
                  "parameters": [
                    "north america"
                  ]
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with no flags cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot} too", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with an inappropriate EXCLUDE_YEAR_ONLY_DATES cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot:EXCLUDE_YEAR_ONLY_DATES} too", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOME",
              "name": "SomeSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with an inappropriate SOUNDEX_MATCH cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("FirstNameIntent My first name is {FirstNameSlot:SOUNDEX_MATCH}", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);

      expect(result).to.eql(
        {
          "intentName": "FirstNameIntent",
          "parsedUtterance": [
            "My first name is ",
            {
              "type": "slot",
              "slotType": "AMAZON.US_FIRST_NAME",
              "name": "FirstNameSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            }
          ]});
    });

    it("verify simple utterance just one slot with an inappropriate EXCLUDE_NON_STATES cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("FirstNameIntent My first name is {FirstNameSlot:EXCLUDE_NON_STATES}", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);

      expect(result).to.eql(
        {
          "intentName": "FirstNameIntent",
          "parsedUtterance": [
            "My first name is ",
            {
              "type": "slot",
              "slotType": "AMAZON.US_FIRST_NAME",
              "name": "FirstNameSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            }
          ]});
    });

    it("verify simple utterance just one slot with an inappropriate COUNTRY cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("FirstNameIntent My first name is {FirstNameSlot:COUNTRY([\"united states\"])}", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);

      expect(result).to.eql(
        {
          "intentName": "FirstNameIntent",
          "parsedUtterance": [
            "My first name is ",
            {
              "type": "slot",
              "slotType": "AMAZON.US_FIRST_NAME",
              "name": "FirstNameSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            }
          ]});
    });

    it("verify simple utterance just one slot with an inappropriate COUNTINENT cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("FirstNameIntent My first name is {FirstNameSlot:COUNTINENT([\"north america\"])}", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);

      expect(result).to.eql(
        {
          "intentName": "FirstNameIntent",
          "parsedUtterance": [
            "My first name is ",
            {
              "type": "slot",
              "slotType": "AMAZON.US_FIRST_NAME",
              "name": "FirstNameSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            }
          ]});
    });

    it("verify simple utterance just one slot with an inappropriate TYPE cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("FirstNameIntent My first name is {FirstNameSlot:TYPE([\"regional\"])}", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);

      expect(result).to.eql(
        {
          "intentName": "FirstNameIntent",
          "parsedUtterance": [
            "My first name is ",
            {
              "type": "slot",
              "slotType": "AMAZON.US_FIRST_NAME",
              "name": "FirstNameSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            }
          ]});
    });

    it("verify simple utterance just one slot with two parameterized flags and one of them being ficticious cleanups correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeSlot: FICTICIOUS([ \"united states\" , \"canada\" , \"mexico\" ]) , CONTINENT([\"north america\"])} too", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "name": "SomeSlot",
              "slotType": "SOME",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with one SOUNDEX_MATCH flag cleans up correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeOtherSlot:SOUNDEX_MATCH} too", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOMEOTHER",
              "name": "SomeOtherSlot",
              "flags": [
                {
                  "name": "SOUNDEX_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                },
                {
                  "name": "EXCLUDE_VALUES_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with one INCLUDE_WILDCARD_MATCH flag cleans up correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeOtherSlot:INCLUDE_WILDCARD_MATCH} too", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOMEOTHER",
              "name": "SomeOtherSlot",
              "flags": [
                {
                  "name": "INCLUDE_WILDCARD_MATCH"
                },
                {
                  "name": "EXCLUDE_VALUES_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one slot with one INCLUDE_WILDCARD_MATCH flag cleans up correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {SomeOtherSlot:INCLUDE_VALUES_MATCH} too", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "slot",
              "slotType": "SOMEOTHER",
              "name": "SomeOtherSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too"
          ]});
    });
    it("verify simple utterance just one options list parses correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {blah|bleh|bleu} {SomeOtherSlot:INCLUDE_VALUES_MATCH} too", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "optionsList",
              "options": [
                "blah",
                "bleh",
                "bleu"
              ]
            },
            " ",
            {
              "type": "slot",
              "slotType": "SOMEOTHER",
              "name": "SomeOtherSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too"
          ]});
    });


    it("verify simple utterance two options lists and a slot parses and cleans up correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {blah|bleh|bleu} {SomeOtherSlot:INCLUDE_VALUES_MATCH} too { this | that | the other }", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "optionsList",
              "options": [
                "blah",
                "bleh",
                "bleu"
              ]
            },
            " ",
            {
              "type": "slot",
              "slotType": "SOMEOTHER",
              "name": "SomeOtherSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too ",
            {
              "type": "optionsList",
              "options": [
                " this ",
                " that ",
                " the other "
              ]
            }
          ]});
    });

    it("verify simple utterance two options lists and a slot parses and cleans up correctly and then unfolds correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {|blah|bleh|bleu} {SomeOtherSlot:INCLUDE_VALUES_MATCH} too { this | that | the other |}", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      expect(parser.unfoldParsedJson(result, true)).to.eql(
        [
          "AnotherIntent me  {SomeOtherSlot} too  this ",
          "AnotherIntent me  {SomeOtherSlot} too  that ",
          "AnotherIntent me  {SomeOtherSlot} too  the other ",
          "AnotherIntent me  {SomeOtherSlot} too ",
          "AnotherIntent me blah {SomeOtherSlot} too  this ",
          "AnotherIntent me blah {SomeOtherSlot} too  that ",
          "AnotherIntent me blah {SomeOtherSlot} too  the other ",
          "AnotherIntent me blah {SomeOtherSlot} too ",
          "AnotherIntent me bleh {SomeOtherSlot} too  this ",
          "AnotherIntent me bleh {SomeOtherSlot} too  that ",
          "AnotherIntent me bleh {SomeOtherSlot} too  the other ",
          "AnotherIntent me bleh {SomeOtherSlot} too ",
          "AnotherIntent me bleu {SomeOtherSlot} too  this ",
          "AnotherIntent me bleu {SomeOtherSlot} too  that ",
          "AnotherIntent me bleu {SomeOtherSlot} too  the other ",
          "AnotherIntent me bleu {SomeOtherSlot} too "
        ]);
    });

    it("verify that an intent with various text equivalents will parse correctly", function() {
      let result = recognizer.Recognizer.matchText("Hi today my friend can you please tell me what I would like today");
      expect(result).to.eql(
        {
          "name": "EquivalentsIntent",
          "slots": {}
        });
    });

    it("verify that an intent with misspelled text equivalents will parse correctly", function() {
      let result = recognizer.Recognizer.matchText("Absense makes the heart grow stronger");
      expect(result).to.eql(
        {
          "name": "MisspelledIntent",
          "slots": {}
        });
    });

    it("verify that an intent with many misspelled text equivalents will parse correctly", function() {
      let result = recognizer.Recognizer.matchText("absense acceptible accidentaly accomodate acheive acknowlege acquaintence allegaince they're");
      expect(result).to.eql(
        {
          "name": "MisspelledIntent",
          "slots": {}
        });
    });

    it("verify that an intent with custom set of equivalents will parse correctly", function() {
      let result = recognizer.Recognizer.matchText("I would like six donuts");
      expect(result).to.eql(
        {
          "name": "HalfDozenIntent",
          "slots": {}
        });
    });

    /*
        it("verify simple utterance with text equivalents parses and cleans up correctly and then unfolds correctly", function() {
          let intentSchema = require("./intents.json");
          let result = parser.parseUtteranceIntoJson("AnotherIntent {~How are you} today {SomeOtherSlot:INCLUDE_VALUES_MATCH} too {~I want}", intentSchema);
    //      console.log("result: ", JSON.stringify(result, null, 2));
    //      let unfolded = parser.forTesting.unfoldEquivalentsSet(result.parsedUtterance[4]);
    //      console.log("unfolded: ", JSON.stringify(unfolded, null, 2));
          parser.cleanupParsedUtteranceJson(result, intentSchema);
          expect(parser.unfoldParsedJson(result, true)).to.eql(
            [
              "AnotherIntent how are you today {SomeOtherSlot} too i want",
              "AnotherIntent how are you today {SomeOtherSlot} too i wish",
              "AnotherIntent how are you today {SomeOtherSlot} too i like",
              "AnotherIntent how are you today {SomeOtherSlot} too i would like",
              "AnotherIntent how are you today {SomeOtherSlot} too i need",
              "AnotherIntent how are you today {SomeOtherSlot} too i prefer"
            ]);
        });
    */
    it("verify simple utterance two options lists and a custom slot parses and cleans up correctly and adds reg exp strings correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("AnotherIntent me {blah|bleh|bleu} {SomeOtherSlot:INCLUDE_VALUES_MATCH} too { this | that | the other }", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);

      let config = require("./config.json");

      let passThrougFunc = function(slotType, flags, stage){
        return generatorsupport.Recognizer.getReplacementRegExpStringGivenSlotType(slotType, config, flags, stage);
      };
      parser.addRegExps(result, intentSchema, passThrougFunc);
      expect(result).to.eql(
        {
          "intentName": "AnotherIntent",
          "parsedUtterance": [
            "me ",
            {
              "type": "optionsList",
              "options": [
                "blah",
                "bleh",
                "bleu"
              ]
            },
            " ",
            {
              "type": "slot",
              "slotType": "SOMEOTHER",
              "name": "SomeOtherSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " too ",
            {
              "type": "optionsList",
              "options": [
                " this ",
                " that ",
                " the other "
              ]
            }
          ],
          "regExpStrings": [
            "^\\s*me\\s+((?:\\w|\\s|[0-9,_']|-)+)\\s+((?:\\w|\\s|[0-9,_']|-)+)\\s+too\\s+((?:\\w|\\s|[0-9,_']|-)+)\\s*[.?!]?\\s*$",
            "^\\s*me\\s+(?:blah|bleh|bleu)\\s+((?:\\w|\\s|[0-9,_']|-)+)\\s+too\\s+(?:\\s+this\\s+|\\s+that\\s+|\\s+the\\s+other\\s+)\\s*[.?!]?\\s*$",
            "^\\s*me\\s+(?:blah|bleh|bleu)\\s+((?:rose\\s*|petunia\\s*|dandelion\\s*)+)\\s+too\\s+(?:\\s+this\\s+|\\s+that\\s+|\\s+the\\s+other\\s+)\\s*[.?!]?\\s*$"
          ]
        });
    });


    it("verify simple utterance one options lists and a built in slot parses and cleans up correctly and adds reg exp strings correctly", function() {
      let intentSchema = require("./intents.json");
      let result = parser.parseUtteranceIntoJson("DateIntent {today is|current date is} {DateSlot} isn't it", intentSchema);
      parser.cleanupParsedUtteranceJson(result, intentSchema);
      let config = require("./config.json");

      let passThrougFunc = function(slotType, flags, stage){
        return generatorsupport.Recognizer.getReplacementRegExpStringGivenSlotType(slotType, config, flags, stage);
      };
      parser.addRegExps(result, intentSchema, passThrougFunc);
      expect(result).to.eql(
        {
          "intentName": "DateIntent",
          "parsedUtterance": [
            {
              "type": "optionsList",
              "options": [
                "today is",
                "current date is"
              ]
            },
            " ",
            {
              "type": "slot",
              "slotType": "AMAZON.DATE",
              "name": "DateSlot",
              "flags": [
                {
                  "name": "INCLUDE_VALUES_MATCH"
                },
                {
                  "name": "EXCLUDE_WILDCARD_MATCH"
                }
              ]
            },
            " isn't it"
          ],
          "regExpStrings": [
            "^\\s*((?:\\w|\\s|[0-9,_']|-)+)\\s+((?:\\s|[-0-9a-zA-Z,_'])+)\\s+isn't\\s+it\\s*[.?!]?\\s*$",
            "^\\s*(?:today\\s+is|current\\s+date\\s+is)\\s+((?:\\s|[-0-9a-zA-Z,_'])+)\\s+isn't\\s+it\\s*[.?!]?\\s*$",
            "^\\s*(?:today\\s+is|current\\s+date\\s+is)\\s+((?:right\\s+now\\s*|today\\s*|yesterday\\s*|tomorrow\\s*|this\\s+week\\s*|last\\s+week\\s*|next\\s+week\\s*|this\\s+weekend\\s*|last\\s+weekend\\s*|next\\s+weekend\\s*|this\\s+month\\s*|last\\s+month\\s*|next\\s+month\\s*|this\\s+year\\s*|last\\s+year\\s*|next\\s+year\\s*|this\\s+decade\\s*|last\\s+decade\\s*|next\\s+decade\\s*|january\\s*|february\\s*|march\\s*|april\\s*|may\\s*|june\\s*|july\\s*|august\\s*|september\\s*|october\\s*|november\\s*|december\\s*|last\\s+january\\s*|last\\s+february\\s*|last\\s+march\\s*|last\\s+april\\s*|last\\s+may\\s*|last\\s+june\\s*|last\\s+july\\s*|last\\s+august\\s*|last\\s+september\\s*|last\\s+october\\s*|last\\s+november\\s*|last\\s+december\\s*|next\\s+january\\s*|next\\s+february\\s*|next\\s+march\\s*|next\\s+april\\s*|next\\s+may\\s*|next\\s+june\\s*|next\\s+july\\s*|next\\s+august\\s*|next\\s+september\\s*|next\\s+october\\s*|next\\s+november\\s*|next\\s+december\\s*|(?:January|February|March|April|May|June|July|August|September|October|November|December){0,1}\\s*(?:first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|sixth|6th|seventh|7th|eighth|8th|nineth|9th|tenth|10th|eleventh|11th|twelfth|12th|thirteenth|13th|fourteenth|14th|fifteenth|15th|sixteenth|16th|seventeenth|17th|eighteenth|18th|nineteenth|19th|twentieth|20th|twenty\\s+first|21st|twenty\\s+second|22nd|thwenty\\s+third|23rd|twenty\\s+fourth|24th|twenty\\s+fifth|25th|twenty\\s+sixth|26th|twenty\\s+seventh|27th|twenty\\s+eighth|28th|twenty\\s+ninth|29th|thirtieth|30th|thirty\\s+first|31st){0,1}\\s*(?:(?:(?:one\\s+thousand|two\\s+thousand){0,1}\\s*(?:(?:one|two|three|four|five|six|seven|eight|nine)\\s*hundred){0,1}\\s*(?:and\\s*){0,1}(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,1}\\s*)|(?:(?:(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety){0,1}\\s*(?:one|two|three|four|five|six|seven|eight|nine){0,1}\\s*)|(?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\\s*){0,2}\\s*|(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|[0-9])\\s*){4})\\s*)+)\\s+isn't\\s+it\\s*[.?!]?\\s*$"
          ]
        });
    });

    it("verify that we are getting phrase equivalents correctly from a single dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.getPhraseEquivalents("how are you", defaultDataSet);
      expect(result).to.eql([
        {
          "fitRating": 1,
          "values": [
            "how are you",
            "how are you doing"
          ]
        },
        {
          "fitRating": 0.99,
          "values": [
            "hi",
            "hello",
            "good morning",
            "good day",
            "good evening",
            "good night",
            "whats up",
            "hey",
          ]
        }
      ]);
    });

    it("verify that we are finding multi-word equivalents correctly from a single dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are",  "you"], [], defaultDataSet);
      expect(result).to.eql(
        {"matches":
          [
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":1,
                  "values":[
                    "how are you",
                    "how are you doing"
                  ]
                }
            },
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":0.99,
                  "values":[
                    "hi",
                    "hello",
                    "good morning",
                    "good day",
                    "good evening",
                    "good night",
                    "whats up",
                    "hey"
                  ]
                }
            }
          ]
        });
    });

    it("verify that we are finding multi-word equivalents correctly using word array that is larger than the matched phrase from a single dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are",  "you", "today"], [], defaultDataSet);
      expect(result).to.eql(
        {"matches":
          [
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":1,
                  "values":[
                    "how are you",
                    "how are you doing"
                  ]
                }
            },
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":0.99,
                  "values":[
                    "hi",
                    "hello",
                    "good morning",
                    "good day",
                    "good evening",
                    "good night",
                    "whats up",
                    "hey"
                  ]
                }
            }
          ]
        });
    });

    it("verify that we are compacting multi-word equivalents correctly using word array that is larger than the matched phrase from a single dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are",  "you", "today"], [], defaultDataSet);
      parser.forTesting.compactMultiWordEquivalentsByFitRating(result);

      expect(result).to.eql(
        {"matches":
          [
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":1,
                  "values":[
                    "how are you",
                    "how are you doing"
                  ]
                }
            },
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":0.99,
                  "values":[
                    "hi",
                    "hello",
                    "good morning",
                    "good day",
                    "good evening",
                    "good night",
                    "whats up",
                    "hey"
                  ]
                }
            }
          ]
        });
    });

    it("verify that we are finding multi-word equivalents correctly repeated calls using same dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are",  "you"], undefined, defaultDataSet);
      result = parser.forTesting.findMultiWordEquivalents(["how", "are",  "you"], result, defaultDataSet);
      expect(result).to.eql(
        {"matches":
          [
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":1,
                  "values":[
                    "how are you",
                    "how are you doing"
                  ]
                }
            },
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":0.99,
                  "values":[
                    "hi",
                    "hello",
                    "good morning",
                    "good day",
                    "good evening",
                    "good night",
                    "whats up",
                    "hey"
                  ]
                }
            },
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":1,
                  "values":[
                    "how are you",
                    "how are you doing"
                  ]
                }
            },
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":0.99,
                  "values":[
                    "hi",
                    "hello",
                    "good morning",
                    "good day",
                    "good evening",
                    "good night",
                    "whats up",
                    "hey"
                  ]
                }
            }

          ]
        });
    });

    it("verify that we are compacting multi-word equivalents correctly by fit rating when using same dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are",  "you"], undefined, defaultDataSet);
      result = parser.forTesting.findMultiWordEquivalents(["how", "are",  "you"], result, defaultDataSet);
      parser.forTesting.compactMultiWordEquivalentsByFitRating(result);
      expect(result).to.eql(
        {"matches":
          [
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":1,
                  "values":[
                    "how are you",
                    "how are you doing"
                  ]
                }
            },
            {
              "phrase":"how are you",
              "startWordIndex":0,
              "endWordIndex":2,
              "equivalents":
                {
                  "fitRating":0.99,
                  "values":[
                    "hi",
                    "hello",
                    "good morning",
                    "good day",
                    "good evening",
                    "good night",
                    "whats up",
                    "hey"
                  ]
                }
            }
          ]
        });
    });

    it("verify that we are compacting multi-word equivalents correctly by fit rating when using same dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are", "you", "today"], undefined, defaultDataSet);
      parser.forTesting.compactMultiWordEquivalentsByFitRating(result);
      let wordEquivalents = parser.forTesting.getWordsEquivalentsForDataSets(["how", "are", "you", "today"], [defaultDataSet]);
      let multiWordResult = parser.forTesting.generatePossibleMultiWordUtterances(["how", "are", "you", "today"], result, wordEquivalents, 0);
      expect(multiWordResult).to.eql(
        {
          "type": "equivalentsSet",
          "equivalentsSet": [
            [
              {
                "type": "equivalents",
                "equivalents": [
                  "how are you",
                  "how are you doing"
                ]
              },
              "today"
            ],
            [
              {
                "type": "equivalents",
                "equivalents": [
                  "hi",
                  "hello",
                  "good morning",
                  "good day",
                  "good evening",
                  "good night",
                  "whats up",
                  "hey"
                ]
              },
              "today"
            ],
            [
              "how are you today"
            ]
          ]
        }
      );
    });

    it("verify that we are stripping out duplicates correctly for multi-word equivalents when using same dataset", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are", "you", "today"], undefined, defaultDataSet);
      parser.forTesting.compactMultiWordEquivalentsByFitRating(result);
      let wordEquivalents = parser.forTesting.getWordsEquivalentsForDataSets(["how", "are", "you", "today"], [defaultDataSet]);
      let multiWordResult = parser.forTesting.generatePossibleMultiWordUtterances(["how", "are", "you", "today"], result, wordEquivalents, 0);
      let removedDuplicates = parser.forTesting.stripRedundantTextEquivalents(multiWordResult);
      expect(removedDuplicates).to.eql(
        {
          "type": "equivalentsSet",
          "equivalentsSet": [
            [
              {
                "type": "equivalents",
                "equivalents": [
                  "how are you",
                  "how are you doing"
                ]
              },
              "today"
            ],
            [
              {
                "type": "equivalents",
                "equivalents": [
                  "hi",
                  "hello",
                  "good morning",
                  "good day",
                  "good evening",
                  "good night",
                  "whats up",
                  "hey"
                ]
              },
              "today"
            ]
          ]
        }
      );
    });

    it("verify that we are generating reg exp strings correctly for multi-word equivalents", function() {
      let defaultDataSet = require("../equivalents/default.json");
      let result = parser.forTesting.findMultiWordEquivalents(["how", "are", "you", "today"], undefined, defaultDataSet);
      parser.forTesting.compactMultiWordEquivalentsByFitRating(result);
      let wordEquivalents = parser.forTesting.getWordsEquivalentsForDataSets(["how", "are", "you", "today"], [defaultDataSet]);
      let multiWordResult = parser.forTesting.generatePossibleMultiWordUtterances(["how", "are", "you", "today"], result, wordEquivalents, 0);
      let regExpString = parser.forTesting.makeRegExpForEquivalentsSet(multiWordResult);
//      console.log("unfolded: ", JSON.stringify(parser.forTesting.unfoldEquivalentsSet(multiWordResult)));
      expect(regExpString).to.eql("(?:(?:(?:how are you|how are you doing)\\s?today)|(?:(?:hi|hello|good morning|good day|good evening|good night|whats up|hey)\\s?today)|(?:how are you today))");
    });


  });
});
