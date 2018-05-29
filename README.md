[![Build Status](https://travis-ci.org/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg?branch=master)](https://travis-ci.org/RationalAnimal/vui-ad-hoc-alexa-recognizer)
[![NPM downloads](http://img.shields.io/npm/dm/vui-ad-hoc-alexa-recognizer.svg?style=flat&label=npm%20downloads)](https://npm-stat.com/charts.html?package=vui-ad-hoc-alexa-recognizer)
[![OPEN open source software](https://img.shields.io/badge/Open--OSS-%E2%9C%94-brightgreen.svg)](http://open-oss.com)
[![Release](https://img.shields.io/github/release/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg?label=Last%20release&a)](https://www.npmjs.com/package/vui-ad-hoc-alexa-recognizer)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg)](http://isitmaintained.com/project/RationalAnimal/vui-ad-hoc-alexa-recognizer "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg)](http://isitmaintained.com/project/RationalAnimal/vui-ad-hoc-alexa-recognizer "Percentage of issues still open")
[![Patreon](https://img.shields.io/badge/back_on-patreon-red.svg)](https://www.patreon.com/RationalAnimal)

# vui-ad-hoc-alexa-recognizer

Provides natural language understanding/processing capability to enable easy implementation of chat bots and voice services.
High performance run time in only 2 lines of code - 'require' to include it, and the call to process the text.
These can run anywhere Node.js is running - backend, browser, mobile apps, etc with or without internet connection.
Has a rich set of built in intents and extensible slots (equivalent to Alexa's),
custom slots (both list based and regular expression based), synonyms, slot flags, parametrized flags, transformation functions,
SoundEx matching, wild card matching, option lists, text equivalents sets, mix-in post processing, sentiment analysis, 
unlimited sets of recognizers to build large
segmented apps, domains with state specific processing, builtin and custom chainable responders, sub-domains (trusted and
non-trusted), etc.

# What's in the name
You may be wondering why such an odd name.  Glad you asked, here is the explanation:
1. vui - stands for "voice user interface" - because this module allows building skills/apps that have voice user interface
2. ad-hoc - because this module creates a pre-configured run time for specific set(s) of intents (requiring no further configuration at run time)
3. alexa - because this module started out by using Alexa skill configuration files (it has expanded well beyond that, but can still be used as before).
So, if you already have an Alexa skill, using this module should be very easy and fast
(and even if you don't it's still easy and fast, just a little longer to configure).
Also, you can use this module simply to ease your Alexa coding - you can configure everything using vui-ad-hoc-alexa-recognizer,
saving yourself time and effort by not having to manually enter all the variations, then use the included alexify utility to output alexa compatible files
4. recognizer - because that's what it does - "recognizes" and processes utterances to identify intents, extract slot values, and optionally provide responses and update the app state.

# Repository
This module as well as related vui modules can be found here:
https://github.com/RationalAnimal

# Tutorials, Examples, Documentation

I have finally gotten to a point where the major features are at a good spot and I can spare some time for
tutorials, examples, and documentation.
To that end I have set up a web site on GitHub pages and included the first set of tutorials, with more on the way.

Here is the website:
https://rationalanimal.github.io/vui-ad-hoc-alexa-recognizer/

## Recognizer Tutorials

The first set of tutorials deals with the lower level, i.e. recognizer functionality:

* "Hello World" and "Using Hello World" - these two tutorials together comprise the usual "Hello World" example - 
one shows how to configure, generate, and test a recognizer.json file. 
The other tutorial shows how to write your own code to use the generated file.
* "You Have Options... Option Lists, That Is" - this tutorial shows how to avoid having to manually enter and maintain a
large number of related utterances.
* "Great Intrinsic Value" - this one shows how to get information back from the user via BUILT IN slot types.
* "Let's Talk" - here the user is shown how to build an actual chat bot - a small app that takes input from the user,
parses it, stores some values in the state for future use, and responds to the user based on the parsed
information and state.
* "Count on it" - introduces the use of what is probably the singularly most useful built in slot type - NUMBER.
* "He Spoke Bespoke" - deals with how to define the simplest type of a custom slot - list based custom slot.
* "Known Intentions" - deals with another built in feature: shows how to use, configure, and turn off built in intents.
* "It's All the Same to Me" - demonstrates custom slots that use synonyms to simplify the code that has to deal with
multiple values that map to a smaller subset.
* "Wild (Card) Thing" - explains how to get values from the user that are not part of the "accepted" set, i.e. using
wildcard matches.
* "Express Yourself Regularly" - explains how to use regular expressions based custom slots to get user input that
matches a particular pattern rather than specific list of values.
* "That Sounds Like You" - explains how to use SOUNDEX matching to process words that sound similar.  This helps with
commonly substituted words in chat bots and words that sound the same but aren't spelled the same way in voice services.
* "Six of One, Half a Dozen of the Other" - covers text equivalents sets and their use.  Text equivalents feature lets you
define words and phrases that are equivalent to each other so that you need only to specify a simple utterance and
have vui-ad-hoc-alexa-recognizer match on any variation of that utterance that may result from using text equivalents.
This allows solving many different issues - from typos, to homophones, to special vocabularies, etc...
* "Would You Like Some Fries with That?" - introduces the concept of "mix in" (aka "add on") processing.
Shows how you can use mix ins to cleanly separate matching and business logic, change matching through configuration and
mix in application, add logging, and more.

## Domain Tutorials

Finally, here is the first domain tutorial:

* "Hello Domain" - this is a very simple, introductory example of a domain that doesn't use the state nor any of the
advanced features, but does respond to every handled intent without the need for any conversation specific code.

# Articles

In addition to tutorials I will from time to time publish articles related to either chatbots/voice services in general
or vui-ad-hoc-alexa-recognizer in particular (or some of both).  They are located on the same website as the tutorials.
Here is the first of these:

* "Better Way of Building Better Chatbots" at https://rationalanimal.github.io/vui-ad-hoc-alexa-recognizer/Articles/BetterWayOfBuildingBetterChatbots/

# Note on licenses
The code in this project is distributed under the MIT license.  Some data files
found in the builtinslottypes directory (e.g. colors.json) use values taken from Wikipedia
and thus they are licensed under Creative Commons Attribution-ShareAlike license.
Such files have appropriate attribution and license information within them.
If you don't wish to deal with these licenses, simply delete such file(s) from
the builtinslottypes directory.  You will need to provide your own versions of
these files.  Note that only some of those files have a
different license - you DON'T need to delete the entire directory to remove them.
Simply search in builtinslottypes directory for "license" and/or "attribution"
Also, AFINN related JSON data files in the builtinmixins directory are a modification of the original files (see
attribution within the files) distributed under Apache 2.0 license.

# Installation

```shell
npm install vui-ad-hoc-alexa-recognizer --save
```

# Summary

This module provides the ability to match user's text input (possibly from speech to text source) to an intent with
slot values as well as the ability to configure return values and state updates right within it.
There are two levels of functionality - a lower level allowing a match of a string against a single recognizer, returning
an intent match with parsed out slot values and a higher level "domain" functionality that allows configuring an
entire app, returning not just a match but results and even updating the current state.

## "Recognizer" (or lower level) functionality
npm module that provides VUI (voice user interface) special ad-hoc recognizer
designed to parse raw text from the user and map it to intents.
This could be useful in many cases.  If
you already have an Alexa skill and would like to convert it to
Google assistant, or some other service, this module makes it really easy. Many skills can be converted
in less than an hour.
Also you can use this to quickly create a skill or an app even if you don't already have an Alexa skill.
You will simply need to create the
required intents, utterances, and (optionally) custom slot value files (equivalent of which
you'd have to do anyway).
It uses the same two files (intents and utterances) that are used to configure Alexa skills.
(It also supports the "beta" Alexa configuration, but I don't recommend using it yet as).
This allows easy "middleware" implementation that can be placed between
Google assistant (or other service) and the Alexa backend.  If you have custom slots and
you want to use exact or SoundEx matches on those slots, then you would also need
file(s) listing these values.
Supports almost all Alexa features - built in intents, all major built in slot types,
most minor ones, 
as well as "extra" features, such as the ability to do wildcard or SoundEx
matches, transforming the values before sending them to be processed, text equivalents matching (such as misspellings,
equivalent words or phrases, homophones and more) etc.
Additional configuration can be added through config file.
You can also use it without any backend service whatsoever - simply use it with your javascript
code same way you would use any other npm module.  It will provide complete
utterance parsing and slot values mapping.  Simply use simple branching
code (e.g. switch statement) using the intent to complete processing.

Keep in mind that many text parsing tasks can be trivially configured as intents/utterances even if you have no intention
of building a chat bot or a voice service.  For example, if you wanted
to parse spelled out numbers, or even combinations of spelled out numbers and numerals, you can easily setup to do it like this:

utterances:

```text
NumberIntent {NumberSlot}
```

intents:

```json
{
  "intents": [
    {
      "intent": "NumberIntent",
      "slots": [
        {
          "name": "NumberSlot",
          "type": "AMAZON.NUMBER"
        }
      ]
    }
  ]
}
```

Now, you can call the match() function, pass it any combination of spelled out and numerals, and it will return
a match on NumberIntent with the value of the NumberSlot being set to the parsed number:

```shell
node matcher.js "51 thousand 2 hundred sixty 3"
```
```json
{
  "name": "NumberIntent",
  "slots": {
    "NumberSlot": {
      "name": "NumberSlot",
      "value": "51263"
    }
  }
}
```

Note that the Number slot is coded to be able to accept both "normal" numbers and numbers that people spell out digit by
digit or groups of digits, such as zip codes or phone numbers.  So "one two three four five" will parse as "12345", etc.
This does mean that occasionally there may come up a way to parse the same expression in more than one way and the attempt
is made to make the most likely match.

Similarly, you can parse dates, etc. even if that's the only thing you want to do (e.g. you have an app where the user
can type in a date - simply use vui-ad-hoc-alexa-recognizer to parse it and return a date).  Dates will match not only the
exact date specification, but strings such as "today", etc.

## "Domain" (higher level) functionality

Domains are a higher level of parsing than recognizers.  Domains do use "recognizer" parsing, but add the follow abilities:

* define a list of recognizers to be used
* define application state-based conditions for using a particular match (e.g. only test against a particular recognizer if you are in a specific state)
* allow returning of results in addition to simply matching on an intent (e.g. if the user says "How are you doing?", not only will it match on a greeting intent, but also will return "Good, and you?")
* allow updating of the application state right within the matching code rather than having to write the extra code to do it (e.g. if the user says "My name is Bob" then some portion of the state will be set to "Bob" by the domain handling code)
* allow nesting of the domains. This is particularly useful as whole types of interactions can be encapsulated as domains and then reused.  It also allows breaking large apps into smaller chunks, i.e. domains.

# Usage

## "Recognizer" (or lower level) functionality

It has two pieces of functionality:
* run it offline to generate a recognizer.json file that will be used in matching/parsing the text
* add two lines of code to your app/skill to use it to match the raw text at run time using the generated recognizer.json file.

Imagine you already have an Alexa skill and you would like to port it to Cortana
or Google Assistant (or even if you don't but want to create a chat bot/service from scratch).
Here are examples of files that you will have for your
Alexa skill or will need to create if you don't have any yet
(these are NOT complete files, you can find the complete sample
files in the test directory):

```shell
cat test/utterances.txt
```
```
TestIntent test
TestIntent test me
TestIntent test please
TestIntent	test pretty please
TestIntent       test pleeeeeeease
MinionIntent One of the minions is {MinionSlot}
MinionIntent {MinionSlot}
StateIntent {StateSlot}
StateIntent New England includes {StateSlot} as one of its states
BlahIntent here is my number {BlahSlot}, use it wisely. And here is another one {BlehSlot}, don't squander it
BlahIntent here is {BlahSlot} and {BlehSlot}
AnotherIntent First is {SomeSlot} and then there is {SomeOtherSlot}
```
```shell
cat test/intents.json
```
```json
{
  "intents": [
    {
      "intent": "TestIntent",
      "slots": []
    },
    {
      "intent": "BlahIntent",
      "slots": [
        {
          "name": "BlahSlot",
          "type": "AMAZON.NUMBER"
        },
        {
          "name": "BlehSlot",
          "type": "AMAZON.NUMBER"
        }
      ]
    },
    {
      "intent": "AnotherIntent",
      "slots": [
        {
          "name": "SomeSlot",
          "type": "SOME"
        },
        {
          "name": "SomeOtherSlot",
          "type": "SOMEOTHER"
        }
      ]
    },
    {
      "intent": "MinionIntent",
      "slots": [
        {
          "name": "MinionSlot",
          "type": "MINIONS"
        }
      ]
    },
    {
      "intent": "StateIntent",
      "slots": [
        {
          "name": "StateSlot",
          "type": "AMAZON.US_STATE"
        }
      ]
    }
  ]
}
```
and also here is an example of a custom slot type file:

```shell
cat test/minions.txt
```
```
Bob
Steve
Stewart
```

### BETA InteractionModel.js file support

Currently, Amazon is beta testing a new GUI tools for editing skills' interaction models.  This produces a single json
file that includes ALL the information for the skill - intents, utterances, custom slot types, and some "new" bits:
prompts/dialogs/confirmations.  The support for this is being added to various parts of vui-ad-hoc-alexa-recognizer
(including the generator and alexifyer) and is functional.  However, until Amazon finishes the beta testing, this will not be finalized and
may change.

* NOTE: AT THIS TIME I DO NOT RECOMMEND USING INTERACTION MODEL FILES - WHILE I HAVE FINISHED THE SUPPORT, I HAVE NOT TESTED IT FULLY

### Generate recognizer.json file

The first step is to generate a run time file - recognizer.json.  This file has
all the information that is needed to parse user text later.  To create it, run
the generator, e.g.:

```shell
node generator.js --intents test/intents.json --utterances test/utterances.txt --config test/config.json
```

(the example intents.json, utterances.txt, and config.json files are included in the test directory)

This will produce a recognizer.json in the current directory.

Additionally, there is beta support for the beta interaction model builder by Amazon.  To use it specify --interactionmodel
parameter instead of --intents and --utterances:

```shell
node generator.js --interactionmodel test/interactionmodel.json --config test/config.json
```

* NOTE: AT THIS TIME I DO NOT RECOMMEND USING INTERACTION MODEL FILES - WHILE I HAVE FINISHED THE SUPPORT, I HAVE NOT TESTED IT FULLY

Note that you can use the extra features in the interactionmodel.json file just as you could with intents.json and
utterances.txt (e.g. options lists, slot flags, TRANSCEND specific slot types).  Simply use alexifyutterances.js (see later) to prepare interactionmodel.json for import into Alexa
developer console.

For usage, simply run the generator without any arguments:

```shell
node generator.js
```

and the generator command will list the needed arguments, e.g.:

```shell
Usage: node /Users/ilya/AlexaProjects/vui-ad-hoc-alexa-recognizer/vui-ad-hoc-alexa-recognizer/generator.js:
  --sourcebase BaseSourceDirectory that is the base for the other file references on the command line or in the config file.  This will be used for both build and run time source base unless overridden by other command line arguments.
  --buildtimesourcebase BuildTimeBaseSourceDirectory that is the base for the other file references on the command line or in the config file at build time.  Will override --sourcebase value for build time directory, if both are supplied
  --runtimesourcebase RunTimeBaseSourceDirectory that is the base for the other file references (e.g. in the config file) at run time.  Will override --sourcebase value for run time directory, if both are supplied
  --vuibase BaseVuiDirectory that is the location of vui-ad-hoc-alexa-recognizer.  This will be used for both build and run time vui base unless overridden by other command line arguments. Defaults to ./node_modules/vui-ad-hoc-alexa-recognizer
  --buildtimevuibase BuildTimeBaseVuiDirectory that is the location of vui-ad-hoc-alexa-recornizer executable files at build time.  Will override --vuibase value for build time directory, if both are supplied
  --runtimevuibase RunTimeBaseVuiDirectory that is the location of vui-ad-hoc-alexa-recognizer executable files at run time.  Will override --vuibase value for run time directory, if both are supplied
  --runtimeexebase RunTimeBaseExeDirectory that is the location of javascript executable files at run time.
  --config ConfigFileName specify configuration file name, optional.  If not specified default values are used.
  --intents IntentsFileName specify intents file name, required.  There is no point in using this without specifying this file.
  --utterances UtterancesFileName specify utterances file name, optional.  This is "optional" only in the sense that it CAN be omitted, but in practice it is required.  There only time you would invoke this function without an utterance file argument is if your skill generates only build in intents, which would make it rather useless.
  --optimizations [SINGLE-STAGE] optional. SINGLE-STAGE means no pre-matches using wildcards.  Depending on the recognizer, this may be slower or faster
  --suppressRecognizerDisplay does not send recognizer.json to console
```

Note here that you should already have the intents.json and utterances.txt files
as these files are used to configure the Alexa skill.

Also, you can specify how to parse built in intents in the config.json.
For example:

```json
{
	"builtInIntents":[
		{
			"name": "AMAZON.RepeatIntent",
			"enabled": false
		}
	]
}
```

will turn off parsing of the AMAZON.RepeatIntent.

You can also specify additional utterances for built in intents, either directly
in the config file or in an external file:

```json
{
  "builtInIntents":[
    {
      "name": "AMAZON.StopIntent",
      "enabled": true,
      "extendedUtterances": ["enough already", "quit now"],
      "extendedUtterancesFilename": "test/stopIntentExtendedUtterances.txt"
    }
  ]
}
```

Similarly you can affect built in slot types using config:

```json
{
  "builtInSlots": [
    {
      "name": "AMAZON.US_FIRST_NAME",
      "extendedValues": [
        "Prince Abubu"
      ],
      "extendedValuesFilename": "test/usFirstNameExtendedValues.txt"
    }
  ]
}
```

This will add "Prince Abubu" and whatever names are found in test/usFirstNameExtendedValues.txt
file to the list of first names recognized by the AMAZON.US_FIRST_NAME slot.

### Parse user text

The second step is to use recognizer.json file at run time to parse the user
text and produce the output json that can be used to set the intent portion of
the request json.  
You only need 2 lines of code to be added to your app to use it:

```js
let recognizer = require("vui-ad-hoc-alexa-recognizer");
let parsedResult = recognizer.Recognizer.matchText("Some text to match to intent");
```

(If this is not working, check to make sure you have generated your recognizer.json
first and that it's located in the same directory where your code is.)

Note that there are additional arguments to matchText(). You can specify sorting
order, excluded intents, and a different recognizer file.

You can also use it from the command line to test your configuration and to see
the matches. For an example of how to use it (assuming you cloned the code from
GitHub and ran "npm test" to have it configured with the test samples), try:

```shell
node matcher.js "Bob"
```
which will produce:

```json
{
  "name": "MinionIntent",
  "slots": {
    "MinionSlot": {
      "name": "MinionSlot",
      "value": "Bob"
    }
  }
}
```
or you could specify a particular recognizer file to use, e.g.:

```shell
node matcher.js "Bob" "./recognizer.json"
```

or try

```shell
node matcher.js "here is four hundred eighty eight million three hundred fifty two thousand five hundred twelve and also six oh three five five five one two one two"
```

which will produce:

```json
{
  "name": "BlahIntent",
  "slots": {
    "BlahSlot": {
      "name": "BlahSlot",
      "value": "488352512"
    },
    "BlehSlot": {
      "name": "BlehSlot",
      "value": "6035551212"
    }
  }
}
```


```shell
node matcher.js "thirty five fifty one"
```

which will produce:

```json
{
  "name": "FourDigitIntent",
  "slots": {
    "FooSlot": {
      "name": "FooSlot",
      "value": "3551"
    }
  }
}
```

```shell
node matcher.js "sure"
```

which will produce:

```json
{
  "name": "AMAZON.YesIntent",
  "slots": {}
}
```

```shell
node matcher.js "New England includes New Hampshire as one of its states"
```
which will produce:

```json
{
  "name": "StateIntent",
  "slots": {
    "StateSlot": {
      "name": "StateSlot",
      "value": "New Hampshire"
    }
  }
}
```

```shell
node matcher.js "My first name is Jim"
```

which will produce:

```json
{
  "name": "FirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "Jim"
    }
  }
}

```

```shell
node matcher.js "December thirty first nineteen ninety nine"
```

which will produce:

```json
{
  "name": "DateIntent",
  "slots": {
    "DateSlot": {
      "name": "DateSlot",
      "value": "1999-12-31"
    }
  }
}
```

```shell
node matcher.js "lets do it on tuesday"
```

which will produce:

```json
{
  "name": "DayOfWeekIntent",
  "slots": {
    "DayOfWeekSlot": {
      "name": "DayOfWeekSlot",
      "value": "tuesday"
    }
  }
}
```

Please note that matcher.js is just a convenience and also serves as an example.
You will NOT be using it at run time (most likely, though some might find the use
for it).

If you are porting an existing Alexa skill (to, for example, Cortana),
you will probably deploy your code (that uses the parser) to some middleware layer, like this:

```
Alexa  -------------->    Alexa   <-- middleware <---- Cortana
Skill  <-------------- AWS Lambda --> AWS Lambda ---->  Skill
```

Where in the middleware AWS Lambda (exposed via API Gateway) you will be able to
see the raw user text from Cortana (passed as the "message" field in the request),
then call it same way matcher.js does, get the resulting json and update the
intent in the request from "None" to the resulting json.  The backend Lambda can
then process it further.

If you are using vui-ad-hoc-alexa-recognizer for new development you have two main options:
* use it just for NLP to map utterances to intents, which you will then use for branching code
* use higher level domain functionality to define much of your app/skill

### Matched custom slot values

There are differences between what kind of values different services may send.
Alexa appears to respect capitalization of the custom slot values (or it sends
lower case versions) while Cortana capitalizes the first letter under some
circumstances, but not always, and also adds a period at the end of utterances
or even other punctuation signs (I've seen entering a zip code changed from
"12345" to "Is 12345 ?"). To keep Cortana (as well as other "misbehaving" services)
behaving consistently, the returned matches use the capitalization of the custom
slot values supplied in the config file rather than what Cortana will send.
Thus, if your custom slot value (in the config file) is "petunia" then "petunia"
will be returned even if Cortana will send you "Petunia".

### Slot flags

In some cases you would like to match on a particular slot differently from the
standard algorithm.  For example, if you are trying to get the user's first name
you may way to match on ANYTHING the user says so that unusual names are matched.
In this case you can modify your utterances file to include special flags, e.g.:

```
FirstNameIntent My first name is {FirstNameSlot: INCLUDE_WILDCARD_MATCH, EXCLUDE_VALUES_MATCH }
```

These flags will be used in parsing. Here are the different currently available
flags:

1. "INCLUDE_VALUES_MATCH", "EXCLUDE_VALUES_MATCH" - to include/exclude custom
slot values in the matching pattern.
2. "INCLUDE_WILDCARD_MATCH", "EXCLUDE_WILDCARD_MATCH" - to include/exclude
a wildcard in the matching pattern.
3. "SOUNDEX_MATCH" - to use SoundEx for matching (will match on values that sound like desired values, but are not necessarily spelled the same)
4. "INCLUDE_SYNONYMS_MATCH", "EXCLUDE_SYNONYMS_MATCH" - to include/exclude
synonym values in the matching pattern.  This is only relevant for custom slot types that actually use synonyms.
5. "EXCLUDE_YEAR_ONLY_DATES" - this flag is only applied to the AMAZON.DATE type
slot and turns off parsing of a single number as a year.  This is useful when
there are otherwise identical utterances that may match on a number or on a date.  If the year only
match is allowed then there is no way to differentiate between the two.
6. "EXCLUDE_NON_STATES" - this flag is only applied to the AMAZON.US_STATE type
slot and turns off parsing of US territories and D.C.
7. "STATE" - this is a parametrized flag (see below).  currently
it only applies to the AMAZON.Airport slot type and it restricts the matches to
the specified states.
8. "COUNTRY" - this is a parametrized flag (see below).  currently
it only applies to the AMAZON.Airline and AMAZON.Airport slot types and it restricts the matches to
the specified countries.
9. "CONTINENT", "TYPE" - these are parametrized flags (see below).  currently
they only apply to the AMAZON.Airline slot type and they restrict the matches to
the specified types and continents.
10. "SPORT", "LEAGUE" - these are parametrized flags (see below).  currently
they only apply to the AMAZON.SportsTeam slot type and they restrict the matches to
the specified sports and leagues.
11. "INCLUDE_PRIOR_NAMES", "EXCLUDE_PRIOR_NAMES" - Currently these only apply to the AMAZON.SportsTeam and AMAZON.Corporation
slot type and they include/exclude the prior team (or corporation) names in the search. Default is EXCLUDE_PRIOR_NAMES.

If you don't specify any of these, then
INCLUDE_VALUES_MATCH and EXCLUDE_WILDCARD_MATCH will be used as the default.  Also,
if you include by mistake both INCLUDE... and EXCLUDE... for the same flag, the
default value is (silently) going to be used.  If you are concerned you can look
at the generated recognizer.json to see how the flags were parsed.
Also note that SOUNDEX_MATCH will automatically imply EXCLUDE_VALUES_MATCH and
EXCLUDE_WILDCARD_MATCH flags; however SOUNDEX_MATCH is only available for the
custom slot types at this time.

It would typically not be useful (at this time with only these sets of flags)
to specify INCLUDE... for both or EXCLUDE... for both wildcard and value matches
unless you are specify SOUNDEX_MATCH.  If you are going to include
wildcard then there is no reason to include values as well - it will only slow
down the parsing.  If you exclude both then it will be the same as if you had removed that slot
from the utterance completely.  For this reason, parsing ignores these combinations.
If you specify INCLUDE_WILDCARD_MATCH then only the wild card will be used.
If you specify both EXCLUDE_VALUES_MATCH and EXCLUDE_WILDCARD_MATCH then only
EXCLUDE_WILDCARD_MATCH is used.

Also note that you have to be very careful when using wildcards.  For example,
imagine this utterance instead of the above example:

```
FirstNameIntent {FirstNameSlot:INCLUDE_WILDCARD_MATCH,EXCLUDE_VALUES_MATCH}
```

This will match on ANYTHING the user says.  So, DON'T use wildcards in "naked"
utterances (ones that use nothing but slots) unless you are absolutely SURE that
that is what you want. This is why these flags exist at the utterance level rather
than intent level.

Also, you should probably NOT specify wildcard matches on slots of many of the
built in intents, such as date or number - this will likely not end well and
it doesn't make sense. For this reason, parsing ignores these flags at this
time on most of these slot types.  Parsing will also ignore SOUNDEX_MATCH on non-custom
slot types (though this may be added in the future for some built in types).

In the future there will be other flags added, possibly specific to
particular built in slot types (e.g. I may add a flag to return only the female
first names from the AMAZON.US_FIRST_NAME type slot or numeric values within
a certain range from the AMAZON.NUMBER type slot).

### Parameterized flags
Some flags can take parameters.  For example, "COUNTRY", "CONTINENT", and "TYPE" flags
are used to specify countries, continents, and types to use in the match.  For example,
if your utterances file contains these lines:

```shell
AirlineIntent {AirlineSlot:COUNTRY(["canada"])} is a canadian airline
AirlineIntent {AirlineSlot:CONTINENT(["north america"])} is a north american airline
```
then only Canadian airlines will match the first one, and only north american
airlines will match the second one.

### Custom list based slot types with synonyms

You can create a very simple custom slot type based on a list of simple values, loaded either from config.json or a separate
text file. But you can also load "values" which are objects.  These objects must themselves contain a "value" field
that replaces the simple field. In addition, these objects can also contain a field "synonyms" which must be an array
of strings.  For example, here is a custom slot type defined in a config.json:

```json
{
  "name": "KITCHENSTUFF",
  "values": [
    "Spoon",
    {
      "value": "Pan",
      "synonyms": [
        "Skillet"
      ]
    }
  ]
}
```

This will match on "spoon", "pan", and "skillet".  Furthermore, **and this is the real value of the synonyms**, when
matching on the "skillet", the actual returned value will be "Pan" (otherwise you could have simply added more values
instead of using synonyms).

Couple of important points:

* You can mix strings and objects within config.json
* If you want to specify json objects in a separate file then you MUST use a file with a .json extension and it must
contain valid json
* Whatever you specify in a file that does NOT have .json extension will be loaded as plain strings (one per line) even
if it contains valid json

#### Synonyms and SOUNDEX

Custom slot type that has synonyms will work with SOUNDEX flag just like one without synonyms.

### Custom slot types based on regular expressions

In addition to the normal custom type slots - one based on a list of values - you can also define a custom slot type
based on a regular expression.  This might be useful if you are looking for some value that has a particular format.
For example, a serial number for a product might have a specific format and you may be looking for it in user input.
It would be impractical to specify all the serial numbers even if you had the up to date list.  Instead, you can define
a custom slot that will match the regular expression for the serial number and return it.
E.g. given config.json:

```text
...
{
	"name": "CUSTOMREGEXP",
	"customRegExpString": "(ABC123|XYZ789)"
}
...
```

and otherwise standard intents and utterances files, when

```shell
node matcher.js "here is XYZ789 if you see it"
```

will produce:

```json
{
  "name": "CustomRegExpIntent",
  "slots": {
    "CustomRegExpSlot": {
      "name": "CustomRegExpSlot",
      "value": "XYZ789"
    }
  }
}
```

You can also load the reg ex for a custom slot from a file.  This can be useful for sharing the same reg ex between many
different recognizers.  To do this, use customRegExpFile member instead of customRegExpString:

```text
...
{
	"name": "CUSTOMREGEXP",
	"customRegExpFile": "customRegExpFile.txt"
}
...
```

### Options list
Instead of creating multiple similar utterance lines like you would do with Alexa
utterances, you can specify variations with options lists:

```text
DateIntent I {want to|wish to|like to|would like to|can} meet {you|with you} {DateSlot}
```

is equivalent to these:

```text
DateIntent I want to meet you {DateSlot}
DateIntent I want to meet with you {DateSlot}
DateIntent I wish to meet you {DateSlot}
DateIntent I wish to meet with you {DateSlot}
DateIntent I like to meet you {DateSlot}
DateIntent I like to meet with you {DateSlot}
DateIntent I would like to meet you {DateSlot}
DateIntent I would like to meet with you {DateSlot}
DateIntent I can meet you {DateSlot}
DateIntent I can meet with you {DateSlot}
```
Note that you can specify an options list that's optional by omitting one value:

```text
DateIntent I {want to|wish to|like to|would like to|can} meet {|you|with you} {DateSlot}
```

will match on (for instance):

```text
I want to meet tomorrow
```
### Text equivalents
Similarly to the options list, text equivalents allow variations in the text to be matched.  Unlike the options list
you don't have to manually add all of the possibilities.  Instead, simply enclose the text that should match using
equivalents and this module will do it for you, e.g.:

```text
HiIntent {~Hi what time is it}
```

is equivalent to these:

```text
HiIntent Hi what time is it
HiIntent Hello what time is it
HiIntent Hey what time is it
HiIntent How are you what time is it
HiIntent Good morning what time is it
HiIntent Good day what time is it
HiIntent Good night what time is it
HiIntent Hi there what time is it
...etc..
```

At this time the following implementation is in place:  it uses two data sets - a very small default data set and a
common misspellings data set. It will match both single
word substitutions AND phrase substitutions.  This will soon be expanded to include
an independent npm module containing additional values (so that they can be updated independently of this module) as well
as the ability to add your own modules to support special "domain" equivalents.  For example, you can add "slang" data
set or "medical jargon" data set.
So, an example similar to the above that substitutes both the phrases and the individual words and uses multiple data
sets (e.g. correcting for typos, skipping optional words like please, etc) could be:

```text
HiTimeIntent {~How are you can you tell me please what is the acceptable time to come to work}
```

is equivalent to these:

```text
HiTimeIntent  how are you can you tell me please what is the acceptable time to come to work
HiTimeIntent  how are you doing can you tell me please what is the acceptable time to come to work
HiTimeIntent  how are you can you tell me what is the acceptable time to come to work
HiTimeIntent  how are you doing can you tell me what is the acceptable time to come to work
HiTimeIntent  how are you can you tell me please what is the acceptible time to come to work
HiTimeIntent  how are you doing can you tell me please what is the acceptible time to come to work
HiTimeIntent  how are you can you tell me what is the acceptible time to come to work
HiTimeIntent  how are you doing can you tell me what is the acceptible time to come to work
HiTimeIntent  hi can you tell me please what is the acceptable time to come to work
HiTimeIntent  hello can you tell me please what is the acceptable time to come to work
HiTimeIntent  good morning can you tell me please what is the acceptable time to come to work
HiTimeIntent  good day can you tell me please what is the acceptable time to come to work
HiTimeIntent  good evening can you tell me please what is the acceptable time to come to work
HiTimeIntent  good night can you tell me please what is the acceptable time to come to work
HiTimeIntent  whats up can you tell me please what is the acceptable time to come to work
HiTimeIntent  hey can you tell me please what is the acceptable time to come to work
HiTimeIntent  hi can you tell me what is the acceptable time to come to work
HiTimeIntent  hello can you tell me what is the acceptable time to come to work
HiTimeIntent  good morning can you tell me what is the acceptable time to come to work
HiTimeIntent  good day can you tell me what is the acceptable time to come to work
HiTimeIntent  good evening can you tell me what is the acceptable time to come to work
HiTimeIntent  good night can you tell me what is the acceptable time to come to work
HiTimeIntent  whats up can you tell me what is the acceptable time to come to work
HiTimeIntent  hey can you tell me what is the acceptable time to come to work
HiTimeIntent  hi can you tell me please what is the acceptible time to come to work
HiTimeIntent  hello can you tell me please what is the acceptible time to come to work
HiTimeIntent  good morning can you tell me please what is the acceptible time to come to work
HiTimeIntent  good day can you tell me please what is the acceptible time to come to work
HiTimeIntent  good evening can you tell me please what is the acceptible time to come to work
HiTimeIntent  good night can you tell me please what is the acceptible time to come to work
HiTimeIntent  whats up can you tell me please what is the acceptible time to come to work
HiTimeIntent  hey can you tell me please what is the acceptible time to come to work
HiTimeIntent  hi can you tell me what is the acceptible time to come to work
HiTimeIntent  hello can you tell me what is the acceptible time to come to work
HiTimeIntent  good morning can you tell me what is the acceptible time to come to work
HiTimeIntent  good day can you tell me what is the acceptible time to come to work
HiTimeIntent  good evening can you tell me what is the acceptible time to come to work
HiTimeIntent  good night can you tell me what is the acceptible time to come to work
HiTimeIntent  whats up can you tell me what is the acceptible time to come to work
HiTimeIntent  hey can you tell me what is the acceptible time to come to work
```

Note that the matching algorithm is pretty efficient and does NOT actually try to match on these utterances, but instead
uses a single regular expression.

### Removing flags/cleaning up the utterance file
There is also a utility available to "clean up" utterance files for use with
Alexa.  This may be needed if you want to use a single file as your utterances
file for both Alexa and porting projects.  Since the slot flags don't exist in
Alexa, they need to be stripped from the utterance file.  For that use
alexifyutterances.js utility:

```shell
node alexifyutterances.js --utterances test/utterances.txt --intents test/intents.json --output testutterances.txt --noconfig
Result was saved to testutterances.txt
```

You can now import testutterances.txt into the Alexa developer console.

Note that not only will alexifyutterances.js remove flags, it will also "unfold"
options lists into multiple utterances as well as "unfold" any text equivalents so that you can use them with Alexa.
This feature would be useful even if you only want to use this module to
reduce the tedium of entering multiple lines into Alexa and don't even
intent to create your own chat bot or convert your Alexa skill.

There is also support for the BETA Amazon interaction model editor.  You can edit the files it generates to add
features supported by this module.  E.g. you can options lists or slot flags or even TRANSCEND native slot types.
Then run it through the alexifyutterances.js and the result will be importable back into Alexa console:

```shell
node alexifyutterances.js --interactionmodel test/interactionmodel.json --output alexifiedmodel.json --noconfig
Result was saved to alexifiedmodel.json
```

### Nominal support for some built in list slots

Many of the list slots (e.g. AMAZON.Actor) have very large value lists.  These
are often not needed in a typical vui skill.  Thus, a compromise support is
provided for them.  They are there and can be used, but they only have a few
values.  If you actually do have a need for them, you have two options:
1. You can provide your own expansion list of values in the config.json file
2. You can use wildcard slot matching to match on any value the user can provide

### Transform functions

#### Custom transform functions

You can transform matched values before returning them.  You do this by specifying
transform functions in the config file, here are examples for the built in and
custom slot types:

```json
{
  "customSlotTypes":[
    {
      "name": "SOME",
      "values": [
        "apple",
        "star fruit",
        "pear",
        "orange"
      ],
      "transformSrcFilename": "./test/transformSome.js"			
    }
  ],
  "builtInSlots": [
    {
      "name": "AMAZON.US_STATE",
      "transformSrcFilename": "./test/transformUsState.js"
    },
    {
      "name": "AMAZON.Month",
      "transformSrcFilename": "./test/transformFirstWordTitleCase.js.js"
    }
  ]
}
```
You then put into the specified "transformSrcFilename" file the source code for
the function to do the transformation.
Then, when you type:

```shell
node matcher.js 'january is the best month'
```

you will get (note the capitalized first letter of the month):

```json
{
  "name": "MonthIntent",
  "slots": {
    "MonthSlot": {
      "name": "MonthSlot",
      "value": "January"
    }
  }
}
```
See the test directory for more examples.

There are many reasons you may want to do this: transforming states into postal
code or fixing issues with speech recognition, etc.
For example, a particular service may not understand some spoken phrases well.
One that I've ran into is the word "deductible" is understood to be "the duck tibble".
This will never match.  Well, you could add this to your list of acceptable values.
This will only solve half a problem.  Once you match it and send it to your Alexa
backend, it will choke on this.  So, you can add a transform function to map
"the duck tibble" to "deductible" before sending it off to Alexa backend.

When you write a custom transform function be aware that it has this signature:

```javascript
function someTransformFunction(value, intentName, slotName, slotType){/* do something and return transformed value*/};
```

And that it returns a transformed value (or undefined if the input value is undefined or null).
You can use the other arguments to change how your function may transform the matched value.
For example, you may specify a particular transform function of a slot type, but you may check within your function
that the slot name equals a particular slot name and change the transformation.

#### Built in transform functions

In addition to being able to write your own custom transform functions you can also use some built in ones.
The current list is:

```text
addAngleBrackets - surrounds the matched value with <>
addCurlyBrackets - surrounds the matched value with {}
addParentheses - surrounds the matched value with ()
addSquareBrackets - surrounds the matched value with []
codeToState - converts passed in US state postal code to the corresponding state name.  Does NOT convert territories.
formatAsUsPhoneNumber1 - formats TRANSCEND.US_PHONE_NUMBER matched value as (111) 111-1111
formatAsUsPhoneNumber2 - formats TRANSCEND.US_PHONE_NUMBER matched value as 111.111.1111
formatAsUsPhoneNumber3 - formats TRANSCEND.US_PHONE_NUMBER matched value as 111 111 1111
formatAsUsPhoneNumber4 - formats TRANSCEND.US_PHONE_NUMBER matched value as 111-111-1111
removeDigits - removes all digits from the matched value
removeDollar - removes all occurrences of $s from the matched value
removeNonDigits - removes all non-digits from the matched value
removeNonAlphanumericCharacters - removes all non alphanumeric characters from the matched value
removeNonWordCharacters - same as removeNonAlphanumericCharacters, but allows underscore. Removes anything that's not a number, letter, or underscore from the matched value.
removePeriod - removes all occurrences of . from the matched value
removePoundSign - removes all occurrences of #s from the matched value
removeWhiteSpaces - removes all continuous sequences of any white space characters from the matched value
replaceWhiteSpacesWithSpace - replaces all continuous sequences of any white space characters in the matched value with a single space
stateToCode - converts passed in US state name to the corresponding postal code.  Does NOT convert territories.
toLowerCase - converts the matched value to lower case
toUpperCase - converts the matched value to upper case
```

You can also
see the currently available ones in the builtintransforms directory.
To use them, specify "transformBuiltInName" member instead of the "transformSrcFilename":

```json
{
  "name": "MEANINGLESS",
  "values": [
    "foo",
    "bar"
  ],
  "transformBuiltInName": "toUpperCase"
}
```

#### Chaining transform functions

Both custom and built in transform functions can be chained simply by specifying an array instead of a single value in
the configuration file, for example:

```json
{
  "name": "MEANINGLESS",
  "values": [
    "foo",
    "bar"
  ],
  "transformBuiltInName": ["toUpperCase", "addParentheses", "addSquareBrackets"]
}
```

will apply all the specified transforms.

### Mix-ins

Sometimes you may want to do some additional processing of the result before returning it.  It could be almost anything,
for example:

* add logging to all matches
* compute sentiment score and add it to the result
* adjust/update/replace matched slot values

and many other possible examples.

Mix-in (or add on) processing allows you to do that and you can do it mostly through configuration (some coding may be
required)

#### Built in mix-ins

Currently there are only about seven built in mix ins.  Here is the list with a short description for each:
* adddefaultslots - can be used to inject slot(s) with hard coded values
* changeintent - can be used to change the matched intent to another one
* charactercount - counts the characters in the matched utterance and attaches this count to the result
* countregexp - counts the occurence of the specified reg exp and attaches this count to the result
* noop - a simple logging mix in.  Does not modify the result in any way, simply logs it to console
* removeslots - removes all matched slots from the result
* wordcount counts the words in the matched utterance and attaches this count to the result

Imagine that you update you config.json file to add the mixIns section like this:

```text
"mixIns": {
  "bundles": [
    {
      "bundleName": "loggingMixIn",
      "mixInCode": [
        {
          "mixInBuiltInName": "noop",
          "arguments": {
            "log": true
          }
        }
      ]
    }
  ],
  "appliesTo": [
    {
      "bundleName": "loggingMixIn",
      "intentMatchRegExString": "(.*)"
    }
  ]
}
```

What this does is defines a mix in "bundle" (i.e. bundle of the code - noop - and argument) and give it a name "loggingMixIn".
Then it specifies that this "bundle" applies to every intent (i.e. "appliesTo" field has a pairing of this bundle with
the "intentMatchRegExString" which matches on every intent: (.*)).  As a result, the "noop" mix in will run after every
match and log the results.  You can modify which intents it applies to by chaining the matching reg exp.  The code that
will actually be run is noop.js located in the builtinmixins directory:

```javascript
"use strict";
module.exports = function(standardArgs, customArgs){ // eslint-disable-line no-unused-vars
  let intentName;
  let utterance;
  let priorResult;
  if(typeof standardArgs !== "undefined"){
    intentName = standardArgs.intentName;
    utterance = standardArgs.utterance;
    priorResult = standardArgs.priorResult;
  }
  if(typeof customArgs !== "undefined" && customArgs.log === true){
    console.log("noop built in mix in called");
    if(typeof standardArgs !== "undefined"){
      console.log("noop standardArgs: ", JSON.stringify(standardArgs));
    }
    else {
      console.log("noop standardArgs: undefined");
    }
    if(typeof customArgs !== "undefined"){
      console.log("noop customArgs: ", JSON.stringify(customArgs));
    }
    else {
      console.log("noop customArgs: undefined");
    }
  }
};
```

Note the signature - two arguments are passed in, both are objects.
The first one is passed to your mix in by vui-ad-hoc-alexa-recognizer automatically.  It contains intent name,
utterance that matched, and the result to be returned to the user.
The second one contains the arguments specified in the config.json: {"log": true} passed to this function on your
behalf by vui-ad-hoc-alexa-recognizer.

You might be wondering why some of these exist.  After all, why have code that removes parts of the result produced by
the matching process.  Here is a simple "for instance": You are encountering issues with some intent(s).  You don't want
to delete the code nor do you want to change skill definitions.  You just want to temporarily disable these intents.
So, you may remove all the slot values, then change the intent name to something like "RemovedIntent" which will handle
any such cases and will respond to the user with "I am sorry, I didn't get that" essentially disabling the intents.
Or you may have decided that you want to experiment with changing the conversation flow and remap an intent to a closely
related, but different one.

#### Custom mix-ins

In addition to the built in functionality you can define your own code to run for some intents.

Imagine you have an intent on which you want to do some post processing.  For example, you may have an intent that
collects some numerical input from the user.  You might ask the user: "How many television sets do you have".  And you
may define multiple utterances to recognize - some contain just the number, some might be a full sentence containing a
number: "I have 2 television sets". But... the user might say something like "I have a television set" or "I have a couple
of television sets".  Now, these two last utterances do NOT contain an explicit number, but they DO implicitly specify
the count.  You could construct several intents (NumberOfTvSetIntent, OneTvSetIntent, TwoTvSetsIntent) and then map
corresponding utterances to their intents and the "handler" code would know about the implied counts in the 1 and 2 TV sets
intents.  However, that requires a complication of the code and potentially mixing parsing and business logic together.
Wouldn't it be nice if we simply could somehow "extract" the counts (1 and 2 respectively) and add them to the result
as slot values so that the business logic would simply use them?  Well, that's what a custom mix-in would let you do.

```text
"mixIns": {
  "bundles": [
    {
      "bundleName": "tvCountMixIn",
      "mixInCode": [
        {
          "mixInSrcFileName": "./injecttvcountslotvalue.js",
          "arguments": {}
        }
      ]
    }
  ],
  "appliesTo": [
    {
      "bundleName": "tvCountMixIn",
      "intentMatchRegExString": "(TvCountIntent)"
    }
  ]
}
```

Now, after a successful match on TvCountIntent, ./injecttvcountslotvalue.js will run and add the corresponding slot
and value to the result.  What would this code look like?  Something like this:

```javascript
"use strict";
module.exports = function(standardArgs, customArgs){ // eslint-disable-line no-unused-vars
  let intentName;
  let utterance;
  let priorResult;
  if(typeof standardArgs !== "undefined"){
    intentName = standardArgs.intentName;
    utterance = standardArgs.utterance;
    priorResult = standardArgs.priorResult;
  }
  if(typeof priorResult !== "undefined" && priorResult !== null && typeof priorResult.slots !== "undefined" && priorResult.slots !== null && typeof priorResult.slots.CountSlot === "undefined"){
    if(utterance.endsWith("a television set")){
      priorResult.slots["CountSlot"] = {
        "name": "CountSlot",
        "value": "1"
      };
    }
    else if(utterance.endsWith("a couple of television sets")){
      priorResult.slots["CountSlot"] = {
        "name": "CountSlot",
        "value": "2"
      };
    }
  }
};
```
Note the signature - just as with the built in mix ins two arguments are passed in, 
both are objects with multiple (potentially) fields.
The first one is passed to your mix in by vui-ad-hoc-alexa-recognizer automatically.  It contains intent name,
utterance that matched, and the result to be returned to the user.
The second one contains the arguments specified in the config.json (nothing in this case).

Here this code checks to see if the result already has a CountSlot value.  If not - it will attempt to determine whether
it's 1 or 2 by looking at the utterance and updating the result with "injected" CountSlot.

#### Applying mix ins when there is no match

Sometimes you may want to apply a particular mix in NOT when there IS an intent match, but when there ISN'T one.
A typical common example is replacing all non-matches with a default intent, e.g. "UnknownIntent".
You can easily do this by specifying "unmatched": true in your config.json:

```json
{
  "bundleName": "SetIntentMixIn",
  "unmatched": true
}
```

You can even combine both matched intent and unmatched specifications:
```json
{
  "bundleName": "loggingMixIn",
  "intentMatchRegExString": "(.*)",
  "unmatched": true
}
```

the above will execute on EVERY match attempt, whether it successfully matches or not.

### Sentiment Analysis

#### AFINN

You can use afinn built in mix in for sentiment analysis.  Currently it supports AFINN96 and AFINN111 data sets.
Also, there is an AFINN96 misspelled words data set that includes misspelled versions of the words in AFINN96.
More data sets are on the way.  Some of them will be "alternative base sets" - AFINN165.  Others are additional data sets
that can be added to the base set, such as scored misspelled words or emoji data set.
This mix in takes a single argument and returns a single
score.  For example, given this config snippet:

```json
{
  "bundleName": "afinnSentimentBundle",
  "mixInCode": [
    {
      "mixInBuiltInName": "afinn",
      "arguments": {"ratingDataSetFiles": ["./afinn96.json", "./afinn96misspelled.json"]}
    }
  ]
}
```

might attach this "sentiment.AFINN.score" to the result:
```json
{
  "name": "AfinnIntent",
  "slots": {},
  "sentiment": {
    "AFINN": {
      "score": -3
    }
  }
}
```

#### Precompiled sentiment data sets

When you specify the data sets for sentiment analysis you should be aware that it may have some performance implications.
For your convenience you can specify the data set(s) individually as many as you'd like as part of the "ratingDataSetFiles"
array.  However, this would then mean that the sentiment analysis code would have to do extra work at run time.  Namely,
merge the data sets, sort, remove duplicates, etc.  You can eliminate these steps if you use "precompiled" data sets.
These include one or more data sets already merged, sorted, etc.  You can specify only one such file since the intent
is to create a single precompiled file that does not need to be processed further.
So, instead of the "ratingDataSetFiles" array, please use "precomputedDataSet" field:

```json
{
  "bundleName": "afinnSentimentBundle",
  "mixInCode": [
    {
      "mixInBuiltInName": "afinn",
      "arguments": {"precomputedDataSet": "./afinn96withmisspelledwords_precompiled.json"}
    }
  ]
}
```

Currently there is only one precomputed data set - afinn96withmisspelledwords_precompiled.json - but you can make a set
yourself it you need it.

#### Making your own precompiled sets

If you want to create a custom precompiled set you can use provided afinndatasetcombiner.js utility to do so.  You can
run it without arguments to get the usage info, but it's really simple:

```shell
node afinndatasetcombined.js -i <input file1> ... <input file2> -o <output file> 
```

e.g.

```shell
node afinndatasetcombiner.js -i builtinmixins/afinn96.json builtinmixins/afinn96misspelled.json builtinmixins/afinnemoticon-8.json -o builtinmixins/afinn96withmisspelledwordsandemoticons_precompiled.json
```

### Dollar values

If a service like Cortana passes a dollar value, e.g. $1000, it will be mapped
to "1000 dollars" as would be expected by an Alexa skill. (Note that if you
want to test it with matcher.js you have to either escape the $ character or
enclose the whole string in '' rather than "" to avoid command line handling
of $)

```shell
node matcher.js 'the first price is $1000 and the second price is $525000'
```
which will produce:

```json
{
  "name": "PriceIntent",
  "slots": {
    "PriceOneSlot": {
      "name": "PriceOneSlot",
      "value": "1000"
    },
    "PriceTwoSlot": {
      "name": "PriceTwoSlot",
      "value": "525000"
    }
  }
}
```
Note that this is identical to:

```shell
node matcher.js 'the first price is 1000 dollars and the second price is 525000 dollars'
```
which will produce:

```json
{
  "name": "PriceIntent",
  "slots": {
    "PriceOneSlot": {
      "name": "PriceOneSlot",
      "value": "1000"
    },
    "PriceTwoSlot": {
      "name": "PriceTwoSlot",
      "value": "525000"
    }
  }
}
```

### Trailing punctuation

Trailing periods (.), exclamation signs (!), and question marks (?) are ignored
during parsing.

### Commas in numeric slots

Any commas within numeric input, e.g. "20,000", are ignored during parsing.

## Optimizations

Note: now that multi-stage matching has been enabled, the performance should be
a lot better for many previously slow scenarios.  However, you can still make it
faster by arranging for the parsing order and excluding some intents from parsing.

In some interesting cases multi-stage matching is actually slower (sometimes by a large factor)
than single-stage matching.  To accommodate such cases, you can generate recognizer files
without multi-stage matching.  To do so, simply add --optimizations SINGLE-STAGE to the generator command line:

```shell
node generator.js --intents test/intents.json --utterances test/utterances.txt --config test/config.json --optimizations SINGLE-STAGE
```

### Intent parsing order

You can pass to the matching call the name(s) of the intents that you want to
try to match first. (Currently it only supports custom intents, but that's not
a problem since built in intents are very fast).  Then this call
will likely execute much faster.  Since most of the time you know what the next
likely answers (i.e. utterances) are going to be, you can provide them to the
matching call.  For example, the following call will try to match CountryIntent first:

```javascript
let result = recognizer.Recognizer.matchText("have you been to France", ["CountryIntent"]);
```

### Intent exclusion

In addition to the intent parsing order you can also pass a list of intents to
be excluded from the matching process.  This is useful if you have intents that
have very large sets of custom values and you are pretty sure you don't want to
parse then in a particular place in your skill (i.e. if you are in a flow that
does not include some intents then you should be able to exclude them from
parsing).  The following call will try to match CountryIntent first and will not even try to match FirstNameIntent:

```javascript
let result = recognizer.Recognizer.matchText("have you been to France", ["CountryIntent"], ["FirstNameIntent"]);
```

### Alternate recognizer files

In addition to the intent parsing order and intent exclusion lists you can pass
an alternate recognizer file to use in the matching call. (Note that the "normal" behavior is to assume a recognizer
named "recognizer.json".  Explicitly specifying the recognizer simply overrides the default.)

```javascript
let result = recognizer.Recognizer.matchText("have you been to France", ["CountryIntent"], ["FirstNameIntent"], alternativeRecognizer);
```

This can be used both
for performance optimization as well as for breaking up large skills/apps into
smaller chucks, typically by functionality (though now that domain functionality has been added, you should probably
use domains for modularizing your app unless there is a reason not to).  Let's say you have a large skill
that has several logical flows in it.  For example, you can have a travel skill
that lets you book a hotel and/or a car, check for special events, reserve a
table at a restaurant, etc.  Each of these may have its own logic - its "flow".
So, you may define a separate set of intents and utterances and custom slot
values for each.  Then use a session variable to keep track of the current flow.
For each flow you can generate its own recognizer file.  Then, at run time, use
the recognizer for the flow that the user is in.
This has multiple advantages: performance will increase; the skill/app can be
developed separately by different teams, each having its own skill/app portion
that they are working on and they will update only the recognizer for their
portion.

### Options list

Using options lists instead of multiple similar utterances may
improve performance. Testing with a simple one slot date example and an utterance
that unfolds to about 3800 utterances reduces the time from 330 ms to 74 ms on
a desktop computer.  Considering that if you run it on AWS Lambda (which is MUCH slower
than a typical higher end desktop computer) you may be shaving off seconds off of
your time, which for voice interactions is quite important.

### SoundEx support

SoundEx support has been added at the utterance level for custom slot types.
You can now specify a SOUNDEX_MATCH flag for a custom slot type and SoundEx match
will be used.  This allows matching of expressions that are not exact matches, but
approximate matches.

```shell
cat utterances.txt
```
where utterances.txt includes this line:

```
MinionIntent Another minion is {MinionSlot:SOUNDEX_MATCH}
```
then
```shell
node matcher.js "another minion is steward"
```
will return
```json
{
  "name": "MinionIntent",
  "slots": {
    "MinionSlot": {
      "name": "MinionSlot",
      "value": "Stewart"
    }
  }
}
```

Note that "Stewart" matched on "steward"

## "Domain" (higher level) functionality

### domainrunner.js

More documentation for domains is coming.  Meanwhile you can test your domain files using domainrunner.js utility.
To see the usage, simply run it:

```shell
node domainrunner.js
```

will return

```text
Usage: node domainrunner.js --domain <path to a domain> --state <path to state json> --outputState [true|false]  --builtinaccessor [basic|readonly]
To exit type "EXIT"
```

If you specify the path to the domain file and to the state json object, then you will see a prompt once you run it:

```shell
Please type user text:
```

If you do, you will see the results being returned.  The domainrunner.js will continue running and accepting user
input (and possible updating the state object) until you kill the process or type EXIT

### Domain configuration

You can create a domain rather easily.  For the simplest setup all you need is an existing recognizer JSON file and you are in business.
Imagine you already have a recognizer file (lets call it myrecognizer.json) that's located in your current directory.
You would also need a "state" json file.  For now, you can simply create a file named "mystate.json" in the current
directory that contains an empty object - {}

Then you can define a domain JSON like this:

```json
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "mine"
        }
      ]
    }
  ]
}
```

You could now test it with domain runner:

```shell
node domainrunner.js 
```

You will see a prompt.  Assuming you have a corresponding DateIntent defined and you type in "tomorrow", you will see
something like this:

```shell
Please type user text: tomorrow
Your text was: "tomorrow"
Domain response:  {
  "match": {
    "name": "DateIntent",
    "slots": {
      "DateSlot": {
        "name": "DateSlot",
        "value": "2017-08-27"
      }
    }
  }
}
Please type user text:
```

#### Returning hard coded result

This is nice, it works, and it shows how easy it is to set up a domain. Howeveer, there is really nothing new here yet.
How about specifying actual results?
We can do it quite easily, by adding just a few more values to the domain file:

```json
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "mine",
          "responder": {
            "result": {
              "directValue": {"text": "Thank you"}
            }
          }
        }
      ]
    }
  ]
}
```

Notice that we've added the "result" field.  This specifies what the returned results will be.  In this case they will
consist of just one object that has a single field named "text" with the value "Thank you".

Run the domain runner again and see the results:

```shell
Please type user text: tomorrow
Your text was: "tomorrow"
Domain response:  {
  "match": {
    "name": "DateIntent",
    "slots": {
      "DateSlot": {
        "name": "DateSlot",
        "value": "2017-08-27"
      }
    }
  },
  "result": {
    "text": "Thank you"
  }
}
```

You can see that there is now a "result" field in the domain's response that has the value we've specified.

#### Returning one of several hard coded results at random

If you look closely at the domain file you'll see that we are specifying just one value.  You can specify many values
with one of them being chosen at random, like this:

```json
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "mine",
          "responder": {
            "result": {
              "directValues": {
                "pickMethod": "random",
                "values": [
                  {"text": "Thanks a bunch"},
                  {"text": "Danke"},
                  {"text": "Thank you"}
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

If you run domain runner again, you will see one of the three messages displaying at random every time you type "tomorrow":

```shell
Please type user text: tomorrow
Your text was: "tomorrow"
Domain response:  {
  "match": {
    "name": "DateIntent",
    "slots": {
      "DateSlot": {
        "name": "DateSlot",
        "value": "2017-08-27"
      }
    }
  },
  "result": {
    "text": "Danke"
  }
}
```

#### Returning one of several hard coded results at random without repeating

This is better, but still very simple.  What if you wanted the replied to not repeat (at least until all of them were used up)?
You can do that too by simply changing the value of the "pickMethod" field from "random" to "randomDoNotRepeat" and adding
a "repeatSelector" field:

```json
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "mine",
          "responder": {
            "result": {
              "directValues": {
                "pickMethod": "randomDoNotRepeat",
                "repeatSelector": "squirrelledAwayAlreadyUsed",
                "values": [
                  {"text": "Thanks a bunch"},
                  {"text": "Danke"},
                  {"text": "Thank you"}
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

Now, if you run domain runner again you will see that the values don't repeat (at least until you use up all 3, then the
cycle starts again).

How is this done? Quite simple.  To see it, run the domain runner with the --outputState true option, and you should see
something like this:

```shell
Please type user text: tomorrow
Your text was: "tomorrow"
Domain response:  {
  "match": {
    "name": "DateIntent",
    "slots": {
      "DateSlot": {
        "name": "DateSlot",
        "value": "2017-08-27"
      }
    }
  },
  "result": {
    "text": "Thank you"
  }
}
State object:  {
  "squirrelledAwayAlreadyUsed": [
    {
      "text": "Thank you"
    }
  ]
}
Please type user text: 
```

Notice that the state object (which was empty to begin with - mystate.json) now has a field "squirrelledAwayAlreadyUsed".
It's an array and it contains the values of the outputs that have already been used.  Every time a particular output is
provided, this field is updated to include it, so it will not be used again until all the values have been used up.

The "squirrelledAwayAlreadyUsed" field name comes from the domain configuration - you can specify anything you want as
the name. The reason, by the way, for specify the field name is to avoid collisions and overwriting some portions of the
state that you didn't mean to overwrite.  This way, you can pick a name for the field to keep track of the "used" values.

#### Combining multiple results

You can specify multiple results to be returned.  When you do, you can specify how to combine them.
To do so, specify "responders" (plural) rather than "responder" field.  For example:

```json
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "mine",
          "responders": [
            {
              "result": {
                "combineRule": "setTo",
                "directValues": {
                  "pickMethod": "randomDoNotRepeat",
                  "repeatSelector": "squirrelledAwayAlreadyUsed",
                  "values": [
                    {"text": "Thanks a bunch"},
                    {"text": "Danke"},
                    {"text": "Thank you"}
                  ]
                }
              }
            },
            {
              "result": {
                "combineRule": "mergeAppend",
                "directValues": {
                  "pickMethod": "randomDoNotRepeat",
                  "repeatSelector": "squirrelledAwayAlreadyUsed2",
                  "values": [
                    {"text": "second text 1", "ssml": "<speak>Thanks a bunch</speak>", "videos": ["http://someotherurl.com"]},
                    {"text": "second text 2", "ssml": "<speak>Thanks a bunch with a card</speak>", "videos": ["http://somethirdurl.com"], "card": {"Title": "Card Title"}}
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

Here we have two "responders" - the first one is just as before (except that it has a "combineRule" field with "setTo" value - 
this tells the code to reset the result to the output of this "responder").  The second one has a combine rule set to 
"mergeAppend".  This will attempt to merge and/or append the second result with the first one:

```text
Please type user text: tomorrow
Your text was: "tomorrow"
Domain response:  {
  "match": {
    "name": "DateIntent",
    "slots": {
      "DateSlot": {
        "name": "DateSlot",
        "value": "2017-08-27"
      }
    }
  },
  "result": {
    "text": "Danke  second text 2",
    "ssml": "<speak>Thanks a bunch with a card</speak>",
    "videos": [
      "http://somethirdurl.com"
    ],
    "card": {
      "Title": "Card Title"
    }
  }
}
State object:  {
  "squirrelledAwayAlreadyUsed": [
    {
      "text": "Danke"
    }
  ],
  "squirrelledAwayAlreadyUsed2": [
    {
      "text": "second text 2",
      "ssml": "<speak>Thanks a bunch with a card</speak>",
      "videos": [
        "http://somethirdurl.com"
      ],
      "card": {
        "Title": "Card Title"
      }
    }
  ]
}
```

As you can see, not only have the two results been "merged" - different fields from both have been added to the final result.
But also where there are the same fields present in both they have been "appended" (see the "text" fields).

When combining different outputs, the following happens:
 * "text" fields are concatenated with a space in between
 * "ssml" fields' contents are concatenated and surrounded with a single set of <speak> tags (e.g. <speak>one</speak>
 concatenated with <speak>two</speak> will result in <speak>one two</speak>)
 * "videos" arrays are combined
 * separate "card" elements are added to an array

#### Merge and replace results

In addition to merging/appending you can also use "mergeReplace" method of combining.  When you do that, non-conflicting
fields from the results will be added to the final output.  However, when the fields ARE conflicting (e.g. two "text" fields)
instead of being appended they will be replaced by the later result.  So, if you were to change the previous domain file
to this:

```json
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "mine",
          "responders": [
            {
              "result": {
                "combineRule": "setTo",
                "directValues": {
                  "pickMethod": "randomDoNotRepeat",
                  "repeatSelector": "squirrelledAwayAlreadyUsed",
                  "values": [
                    {"text": "Thanks a bunch"},
                    {"text": "Danke"},
                    {"text": "Thank you"}
                  ]
                }
              }
            },
            {
              "result": {
                "combineRule": "mergeReplace",
                "directValues": {
                  "pickMethod": "randomDoNotRepeat",
                  "repeatSelector": "squirrelledAwayAlreadyUsed2",
                  "values": [
                    {"text": "second text 1", "ssml": "<speak>Thanks a bunch</speak>", "videos": ["http://someotherurl.com"]},
                    {"text": "second text 2", "ssml": "<speak>Thanks a bunch with a card</speak>", "videos": ["http://somethirdurl.com"], "card": {"Title": "Card Title"}}
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

and re-run domain runner, you would get this output:

```text
Please type user text: tomorrow
Your text was: "tomorrow"
Domain response:  {
  "match": {
    "name": "DateIntent",
    "slots": {
      "DateSlot": {
        "name": "DateSlot",
        "value": "2017-08-27"
      }
    }
  },
  "result": {
    "text": "second text 2",
    "ssml": "<speak>Thanks a bunch with a card</speak>",
    "videos": [
      "http://somethirdurl.com"
    ],
    "card": {
      "Title": "Card Title"
    }
  }
}
State object:  {
  "squirrelledAwayAlreadyUsed": [
    {
      "text": "Thank you"
    }
  ],
  "squirrelledAwayAlreadyUsed2": [
    {
      "text": "second text 2",
      "ssml": "<speak>Thanks a bunch with a card</speak>",
      "videos": [
        "http://somethirdurl.com"
      ],
      "card": {
        "Title": "Card Title"
      }
    }
  ]
}
```

Note that the "text" value comes from the second responder only.

#### setTo and ignore combine rules

You've already seen the "setTo" combine rule - it's used in the first responder.  It's designed not to merge two results,
but rather to set the result to the second one if its combine rule is "setTo".

"ignore" combine rule is the opposite - the result (if any) produced by the responder with this combine rule is ignored
completely.  This exists to support the responders that are there primarily to update the state rather than produce the
"output".  Sometimes you may also want to use it to temporarily disable the "output" from a responder without actually
deleting it.

#### Custom responders

You can create completely custom responders by providing function body source right within the domain file.
For example:

```json
{
  "result": {
    "functionSource": "return {\"text\":\"Thanks\"};"
  }
}
```

When this function is created at run time, it will be created with these 3 arguments: 'match', 'stateAccessor',
'selectorArray' and the corresponding values will be passed in.
If you need to, go ahead and use them in your function body

#### Custom responders modules

While it's all well and good to add a function body right within the domain json file, it's a little problematic - the
source code must be escape to be part of the json file.  If you make a mistake in escaping it, the function will not work.
Additionally, you can't unit test it by itself.
So, for longer/more complicated functions it's better to put them into a separate module and require the module.  You
can do that using "functionModule" field:

```json
{
  "result": {
    "combineRule": "setTo",
    "functionModule": "./test/greetingdomain/customresponderfunction.js"
  }
}
```

Where the contents of "./test/greetingdomain/customresponderfunction.js" are:

```javascript
'use strict';

let _responderFunction = function(match, stateAccessor, selectorArray){
  let intent = match.name;
  if(intent === "GreetingIntent"){
    stateAccessor.mergeReplaceState(selectorArray, {"customfunctionmodulewasrun": "true"});
    return {
      "text": "Hi from the custom function module"
    };
  }
};

module.exports = _responderFunction;
```

Now, if you re-run the domain runner, you will get this:

```text
Please type user text: hi there
Your text was: "hi there"
Domain response:  {
  "match": {
    "name": "GreetingIntent",
    "slots": {}
  },
  "result": {
    "text": "Hi from the custom function module  Hello",
    "ssml": "<speak>Hello</speak>"
  }
}
State object:  {
  "greetingdomain": {
    "customfunctionmodulewasrun": "true",
    "greetingAlreadyUsed": [
      {
        "text": "Hello",
        "ssml": "<speak>Hello</speak>"
      }
    ]
  }
}
```

Note that the function correctly ran, the "result" includes the text from it combined with the text from other
responders, state object was correctly adjusted as well.

#### Setting state object directly

So now you have seen how simply returning a particular value can update the state (randomDoNotRepeat pick method).
But that is part of the default built in behavior.  You can also directly update the state.
To do that, simply add an "updateState" field to your responder, e.g.:

```json
{
  "result": {
    "combineRule": "ignore",
    "directValue": {"text": "Ignore this text"}
  },
  "updateState": {
    "updateRule": "mergeReplace",
    "updateSelector": "someuselessvalue.some.other.useless.value",
    "directValue": {"update": "result of replaceMerge updateRule"}
  }
}
```

First, notice that in the above example while we do return a "result" field, the "combineRule" is "ignore" so this
responder will NOT contribute to the returned result.

The "updateState" field contains a couple of fields that should look somewhat familiar now.  "updateRule" is similar to
the "combineRule" of the result field, but applies to how the state object is to be updated by this responder.  In this
example we are specifying that the value of "directValue" field is to be merged (replacing existing values where conflicting)
with the current state object.  You can also use "setTo" here to replace without merging.

But what about the "updateSelector"? Well, here is where you specify which part of the state object is to be updated.
In this example, if we run domain runner again (with the option to show state), we'll see this:

```text
...
State object:  {
  "squirrelledAwayAlreadyUsed": [
    {
      "text": "Thanks a bunch"
    }
  ],
  "squirrelledAwayAlreadyUsed2": [
    {
      "text": "second text 2",
      "ssml": "<speak>Thanks a bunch with a card</speak>",
      "videos": [
        "http://somethirdurl.com"
      ],
      "card": {
        "Title": "Card Title"
      }
    }
  ],
  "someuselessvalue": {
    "some": {
      "other": {
        "useless": {
          "value": {
            "update": "result of replaceMerge updateRule"
          }
        }
      }
    }
  }
}
...
```

So, the other updates to the state object still take place, and then the direct update of the state object happens right
where the selector specified it.

Note: currently, only "directValue" field is supported, but other ways (including user custom functions) will be added shortly.

#### Important note on "selectors"

Selectors are used in multiple places in domains.  This is the first use that you've seen, but the concept is the same
elsewhere.

Also, in this particular example, the selector is used "logically", i.e. the way you'd expect.  That's because behind the
scenes domainrunner.js is using a built in "accessor" - collection of functions that actually access the state object.
There are two built in accessors at this time.  The other one is a read only accessor (so if you used that one none of the
changes to the state object would take place).  More built in accessors will be coming in the future, but you can also
write your own.  If you do that, you can use the selector in different ways.  For instance, if your state object is saved
in a nosql database, the selector may be a key that's used to look up portions of the state.  It's up to you how you
implement it.  This of the state as NOT being manipulated directly, rather manipulated through accessors.  So, you could
create a React compatible accessor that will treat the state as read only but will issue updates to the state via a separate
mechanism.  The domain code doesn't care and the accessors are designed to be "pluggable".

#### Built in accessors

There are two built-in accessors: basic and readonly.  They work the same way, but the read only accessor does not update
the state.

Note that you can also select a different built-in accessor when using domainrunner.js by specifying an extra argument:

```shell
  --builtinaccessor [basic|readonly]
```

on the command line.


#### Non-default single value state match criteria

So far you've only seen default match criteria, meaning you've only seen a domain using a single recognizer without any
regard to anything else.  Here is the relevant snippet from the domain file:

```text
...
  "states": [
    {
      "matchCriteria": "default",
...
```

However, you can specify that a particular recognizer should only be used under certain conditions.  For example, if
the state object contains field "startedEnrollment" and its value is {"status":"yes"} then use a different recognizer.

If you update your domain file to include that, e.g.:
```text
...
"recognizers": [
  {
    "key": "mine",
    "path": "./myrecognizer.json"
  },
  {
    "key": "greeting",
    "path": "./test/greetingdomain/greetingrecognizer.json"
  }
],

...
"states": [
  {
    "matchCriteria": {
      "type": "state",
      "selector": "startedEnrollment",
      "match": true,
      "value": {"status": "yes"}
    },
    "matchSpecs": [
      {
        "recognizer": "greeting",
        "responder": {
          "result": {
            "directValue": {"text": "Hello to you too"}
          }
        }
      }
    ]
  },
...
```

and re-run domain runner (without changing the state) you will get:

```text
Please type user text: hi there
Your text was: "hi there"
Domain response:  undefined
State object:  {}
```

but if you now edit the state object to include "startedEnrollment": {"status": "yes"} then you'll get:

```text
Please type user text: hi there
Your text was: "hi there"
Domain response:  {
  "match": {
    "name": "GreetingIntent",
    "slots": {}
  },
  "result": {
    "text": "Hello to you too"
  }
}
State object:  {
  "startedEnrollment": {
    "status": "yes"
  }
}
```

So this showed how you can specify which recognizer(s) to use based on some criteria.

Note that "default" criteria will always match.

#### Non-default single value negative match criteria

You can also set the "match" to false, indicating that this match criteria will succeed if the state does NOT match
the provided value:

```text
...
"states": [
  {
    "matchCriteria": {
      "type": "state",
      "selector": "startedEnrollment",
      "match": false,
      "value": {"status": "yes"}
    },
    "matchSpecs": [
      {
        "recognizer": "greeting",
        "responder": {
          "result": {
            "directValue": {"text": "Hello to you too"}
          }
        }
      }
    ]
  },
...
```

This should be used carefully - the non-matching criteria may should be designed to avoid frequent/always matches.
An example of proper match might be a "global" setting indicating whether the user has completed some step and if not,
then proceeding down that user interaction path.


#### Non-default multi-valued match criteria

In addition to the single value match criteria you can also specify an array of matching values.  The only difference is
that instead of:

```text
"match": true,
"value": {"status": "yes"}
```

you would specify something like:

```text
"match": true,
"values": [{"status": "yes"}, {"status": "tbd"}]
```

this will match if the "status" is either "yes" or "tbd"

#### Non-default multi-valued negative match criteria

Just as for single values, you can set "match" to be false to indicate that the match will succeed if the state does
NOT match ANY of the provided values

#### Testing for null in the match criteria

Sometimes you just need to test whether a value is a null or not.
Here is a simple and concise way of checking whether a value is null:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.selector",
  "isNull": true
}
```

Similarly, here is how you would check if the value is not null:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.selector",
  "isNull": false
}
```

#### Testing for undefined in the match criteria

Testing for undefined is another common test that you may want to perform.
This would typically be done when you want to test whether some state value has been set.
The specification is similar to testing for null:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.selector",
  "isUndefined": true
}
```

Similarly, here is how you would check if the value is not undefined:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.selector",
  "isUndefined": false
}
```

#### Testing for a numeric value being greater than a reference value in the match criteria

Testing for a numeric value being greater than a reference value is also fairly common.
Here is how you could do it:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.threshold",
  "greaterThan": 5
}
```

Note that unlike isNull or isUndefined there is no way to specify "false" (i.e. negative) condition.
This can instead be done using lessThanOrEqual test (lessThanOrEqual is not yet implemented).

#### Testing for a numeric value being greater than or equal to a reference value in the match criteria

Similar to testing for a numeric value being greater than a reference value, you can test
for a numberic value being greater than or equal to a reference value:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.threshold",
  "greaterThanOrEqual": 4
}
```

Similar to greaterThan there is no way to specify "false" (i.e. negative) condition.
This can instead be done using lessThan (lessThan is not yet implemented).

#### Testing for a numeric value being less than a reference value in the match criteria

You can also test for a numeric value being less than a reference value:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.threshold",
  "lessThan": 10
}
```

#### Testing for a numeric value being less than or equal to a reference value in the match criteria

To test for a numeric value being less than or equal to a reference value:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.threshold",
  "lessThanOrEqual": 10
}
```

#### Testing for a string value consisting only of alpha characters in the match criteria

To test for a string value consisting entirely of alpha characters (a through z, case insensitive):

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isAlpha": true
}
```

Note that specifying "isAlpha": false does NOT test for whether the entire string is composed of non-alpha characters.
Instead it's testing for whether ANY of the characters are not alpha:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isAlpha": false
}
```

#### Testing for a string value consisting only of numeric characters in the match criteria

To test for a string value consisting entirely of numeric characters:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isNumeric": true
}
```

Again, specifying "isNumeric": false tests for whether ANY of the characters are not alpha:
```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isNumeric": false
}
```

#### Testing for a string value consisting only of alpha numeric characters in the match criteria

To test for a string value consisting entirely of alpha numeric characters:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isAlphaNumeric": true
}
```

Again, specifying "isAlphaNumeric": false tests for whether ANY of the characters are not alpha numeric:
```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isAlphaNumeric": false
}
```

#### Testing for a string value consisting only of white space characters in the match criteria

To test for a string value consisting entirely of white space characters:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isWhiteSpace": true
}
```

As before, specifying "isWhiteSpace": false tests for whether ANY of the characters are not white space:
```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isWhiteSpace": false
}
```

#### Testing for a string value consisting only of upper case in the match criteria

To test for a string value consisting entirely of upper case characters:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isUpperCase": true
}
```

Again, specifying "isUpperCase": false tests for whether ANY of the characters are not upper case:
```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isUpperCase": false
}
```

#### Testing for a string value consisting only of lower case in the match criteria

To test for a string value consisting entirely of lower case characters:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isLowerCase": true
}
```

Same as with other isXxx, specifying "isLowerCase": false tests for whether ANY of the characters are not lower case:
```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "isLowerCase": false
}
```

#### Testing for a string value containing a substring in the match criteria

To test for a string value containing a substring:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "containsSubstring": true
  "substring": "somesubstring"
}
```

Specifying "containsSubstring": false tests to ensure that the specified substring is NOT contained:

```text
"matchCriteria": {
  "type": "state",
  "selector": "some.value",
  "containsSubstring": false
  "substring": "somesubstring"
}
```

#### Match criteria within responders

So far you have seen match criteria used only to specify whether a particular recognizer is to be used.  This gives a lot
of flexibility.  However if limited to just this case, this arrangement makes conditional use of responders difficult.
That's why you can also use the match criteria within a responder as well:

```json
{
  "matchCriteria": {
    "type": "state",
    "selector": "conditionalResponderValue",
    "isUndefined": false
  },
  "matchSpecs": [
    {
      "recognizer": "conditionalrespondertest",
      "responders": [
        {
          "matchCriteria": {
            "type": "state",
            "selector": "conditionalResponderValue.useResponder1",
            "isUndefined": false
          },
          "result": {
            "directValue": {
              "text": "Conditional responder 1"}
          }
        },
        {
          "matchCriteria": {
            "type": "state",
            "selector": "conditionalResponderValue.useResponder3",
            "isUndefined": false
          },
          "result": {
            "combineRule": "mergeAppend",
            "directValue": {
              "text": "Conditional responder 3"}
          }
        },
        {
          "matchCriteria": {
            "type": "state",
            "selector": "conditionalResponderValue.useResponder2",
            "isUndefined": false
          },
          "result": {
            "combineRule": "mergeAppend",
            "directValue": {
              "text": "Conditional responder 2"}
          }
        }
      ]
    }
  ]
}
```

In the example above match criteria is used both ways - to restrict when to use the recognizer as well as to restrict
when to apply a particular responder.  Here, if the state has a defined "conditionalResponderValue" then the recognizer
will be applied.  However, each of the 3 responders also have their own match criteria. If a particular responder's
match criteria is not met then that responder will not contribute to the response.  For example, if the state object is:

```json
{
  "conditionalResponderValue": {
    "useResponder1": true,
    "useResponder2": true
  }
}
```

and we match on the utterance, only 2 out of 3 responders will contribute to the result:

```json
{
  "match": {
    "name": "ConditionalResponderTestingIntent",
    "slots": {}
  },
  "result": {
    "text": "Conditional responder 1  Conditional responder 2"
  }
}
```

##### Using conditional responders

Conditional responders are a very powerful tool.  You can create a different output depending on the current state.
For example, imagine if your user says something like "I would like to get two tickets for today's 7:30 showing of Deadpool 27".
If your user is already authenticated and the credit card info is on file, you can respond with
"your etickets have been ordered, please see your email".  However, if the user has not yet authenticated you can
respond with "please log in first so we can help you".

Note that you could still do this without conditional responders, but you would have to create multiple recognizers to
accomplish that and it would unnecessarily complicate the code.

#### Slot test match criteria

If you are using match criteria with responders then you can also test slot values.  This does not make sense when using
match criteria as a recognizer use condition.  That's because you don't have the intent (and thus slots) parsed yet when
you are deciding whether to use the recognizer - the recognizer is the one doing the parsing.  But with responders you
DO have parsed slot values.  What follows is a description of the various slot tests available with match criteria.

#### Non-default single value slot match criteria

Use this when you want to compare the slot value to a single predefined value, e.g.:

```json
{
  "matchCriteria": "default",
  "matchSpecs": [
    {
      "recognizer": "conditionalrespondertest",
      "responders": [
        {
          "matchCriteria": {
            "type": "slot",
            "slot": "NumberSlot",
            "value": "5",
            "match": true
          },
          "result": {
            "directValue": {
              "text": "You said 5"}
          }
        }
      ]
    }
  ]
}
```

In this case, if the slot value parsed out of the utterance for the NumberSlot equals 5 then the domain will add
"You said 5" to the result's text.  Else, nothing will be added.

#### Subdomains

If domains simply added results and state awareness and manipulation they would already be a pretty big improvement over
just using recognizers directly.  However, domains can use other domains.  This is particularly powerful because it
allows one to modularize an application, breaking it up into individual reusable modules.  This reduces complexity,
allows code reuse, and has other benefits.  Additionally, separate domains can be defined by other people, possibly
outside your group, your company/organization, etc.
As long as they are written correctly they can be used by other people/teams.

Using domain withing domain (aka sub-domains) is easy and similar to using recognizers.
First, you must add the sub-domain to the list of domains:

```text
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "domains": [
    {
      "key": "greeting",
      "path": "./test/greetingdomain/greetingdomain.json",
      "trusted": {
        "read": true,
        "write": true,
        "selector": "greetingdomain"
      }
    }
  ],
  "states": [
...
```
A few things to note here.  Just as with including recognizers you must provide a "key" with a value - this is an arbitrary
value determined by you.  It's needed so that this domain can be referenced elsewhere by this "key".
Second, there is a "trusted" field.  This field specifies whether this subdomain is trusted to read and/or write
to the parent's (i.e. this domain's) state. In this exmaple we have a fully trusted sub domain.  Such a subdomain has an
optional selector field.  Its value, if provided, is used to select a portion of the state object that
this subdomain will be able to see.  Thus, in this example the "selector" is "greetingdomain".  So any modifications will
be done to the <state object>.greetingdomain field as if it's the entire state.  If you have closely cooperating modules
that need to know each other's state then the "selector" field would probably either be absent or be the same for these
modules.  Of course the super domain (the one that's using a subdomain) can alway see the subdomains' portion of the state.

Once you've added the sub-domain to the list of domains you can now use it.  This part is actually simpler than the
set up for recogizers.  That's because the sub-domain already describes the results and the state update.  Thus, all
you have to do is specify when to use it.  You simply add it to the list of responders (for the specific match criteria)
and you are all set:

```text
...
"states": [
  {
    "matchCriteria": "default",
    "matchSpecs": [
      {
        "domain": "greeting"
      },
      {
        "recognizer": "mine",
...
```

Now whent you re-run the domain runner, you'll get something similar to this (depending on which greeting get randomly
chosen):

```text
Please type user text: hi there
Your text was: "hi there"
Domain response:  {
  "match": {
    "name": "GreetingIntent",
    "slots": {}
  },
  "result": {
    "text": "Hello",
    "ssml": "<speak>Hello</speak>"
  }
}
State object:  {
  "greetingdomain": {
    "greetingAlreadyUsed": [
      {
        "text": "Hello",
        "ssml": "<speak>Hello</speak>"
      }
    ]
  }
}
```

You can include sub-domains within sub-domains.  The only restriction is that you can't do circular subdomains - don't
include B as a side domain of A if A is already a subdomain of B.

#### Trusted vs non trusted sub-domains

In the initial example above you've seen a fully trusted domain.  What if you are using a third party domain that you
aren't sure about?  Furthermore, such a sub-domain may not even need to have access to your state, so why provide it?
You can simply accommodate this by specifying it as a non trusted sub-domain:

```text
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "domains": [
    {
      "key": "greeting",
      "path": "./test/greetingdomain/greetingdomain.json",
      "trusted": {
        "read": false,
        "write": false
      }
    }
  ],
  "states": [
...
```

Now, even if there is no "selector" field in the "trusted" field, the sub-domain will be separated from the main part of
the state and even custom responders won't be able to see outside of that sub portion.

If you were to re-run the domain runner, you would get:

```text
Please type user text: hi there
Your text was: "hi there"
newResult:  {
  "text": "Hi from the custom function module"
}
newResult:  {
  "text": "Nice to meet you",
  "ssml": "<speak>Nice to meet you</speak>"
}
Domain response:  {
  "match": {
    "name": "GreetingIntent",
    "slots": {}
  },
  "result": {
    "text": "Hi from the custom function module  Nice to meet you",
    "ssml": "<speak>Nice to meet you</speak>"
  }
}
State object:  {
  "untrusted": {
    "customfunctionmodulewasrun": "true",
    "greetingAlreadyUsed": [
      {
        "text": "Nice to meet you",
        "ssml": "<speak>Nice to meet you</speak>"
      }
    ]
  }
}
```

Note that the state of the sub-domain is now relegated to the "untrusted" subfield and only the contents of that subfield
will be visible to anything in that sub-domain.

Sometimes you may want to be able to specify the name of this "sand boxing" field.  You can do it like this:

```text
...
{
  "description": "Simplest domain",
  "recognizers": [
    {
      "key": "mine",
      "path": "./myrecognizer.json"
    }
  ],
  "domains": [
    {
      "key": "greeting",
      "path": "./test/greetingdomain/greetingdomain.json",
      "trusted": {
        "read": false,
        "write": false,
        "selector": "greetingdomain",
        "sandBoxKeys": "separateddomain"
      }
    }
  ],
  "states": [
...
```

Now, if you re-run the domain runner yet again, you will see:
```text
Your text was: "hi there"
newResult:  {
  "text": "Hi from the custom function module"
}
newResult:  {
  "text": "Hello",
  "ssml": "<speak>Hello</speak>"
}
Domain response:  {
  "match": {
    "name": "GreetingIntent",
    "slots": {}
  },
  "result": {
    "text": "Hi from the custom function module  Hello",
    "ssml": "<speak>Hello</speak>"
  }
}
State object:  {
  "separateddomain": {
    "greetingdomain": {
      "customfunctionmodulewasrun": "true",
      "greetingAlreadyUsed": [
        {
          "text": "Hello",
          "ssml": "<speak>Hello</speak>"
        }
      ]
    }
  }
}
```

Note that the entire sub-domain's portion of the state has now been placed into the field specified by the sandBoxKeys
field and also that the selector field is still used if you specified it.

#### Missing trusted specification

You can also skip specifying trusted information completely.  When you do, it's the same as specifying an untrusted
domain with the sandBoxKeys being set to "untrusted".  "selector" value will be used, if present.
For example:

```json
{
  "key": "greeting",
  "path": "./test/greetingdomain/greetingdomain.json",
  "selector": "greetingdomain"
}
```

is equivalent to

```json
{
  "key": "greeting",
  "path": "./test/greetingdomain/greetingdomain.json",
  "trusted": {
    "read": false,
    "write": false,
    "selector": "greetingdomain",
    "sandBoxKeys": "untrusted"
  }
}
```

#### Hybrid trusted sub-domains

Currently you can only specify completely trusted (read AND write) or completely untrusted sub-domains.  I am in the
process of adding partially trusted sub-domains, e.g. can read but not write OR can write but not read the parent domain's
state.  This will function differently from the "obvious" expectation.  For example, the domain that is trusted to read
the value will still be able to write to "it", but it won't write to the parent's state, rather to its own portion. And
vice versa - the domain that is write trusted will be able to write to the parent's state but will be able to read only
the values it has previously written.

## Non Alexa support

You don't have to generate just the Alexa intents/slot types.  This module can
now generate other "platform" intents, though the only one supported at this time
is "TRANSCEND", which is what the other vui-xxx projects are using as their native
built in type.

Support for MICROSOFT.xxx and possibly others will be added if/when there is a
need/demand for it.

In order to specify an "output" type, simply configure it in your config file:

```json
{
  "platform": {
    "output": "TRANSCEND"
  }
}
```

By default, if you don't specify anything, the output will be "AMAZON" for compatibility
reasons.


## Transcend features supported

Currently there are two TRANSCEND built in slot type supported: TRANSCEND.US_PHONE_NUMBER and TRANSCEND.US_PRESIDENT.

TRANSCEND.US_PHONE_NUMBER will match on seven digit number expression that's structured the way people tend to pronounce
phone numbers.  So, either listing it out as numbers or using one/two digit word equivalents (e.g. fifteen or thirty five).
Additionally, this slot type will accept parenthesis around the area code, dash between exchange and user number or dots
instead, e.g.:

```text
(123) 456-7890
123.456.7890
123 456 7890
one twenty three four fifty six seventy eight ninety
```

## Alexa features supported

Currently, you can parse:
1. All Alexa built in intents
2. Utterances without slots
3. Utterances with custom slots
4. Utterances with all the numbers/date/time/duration built in slot types: AMAZON.NUMBER, AMAZON.FOUR_DIGIT_NUMBER, AMAZON.DATE, AMAZON.TIME, AMAZON.DURATION
5. Utterances with these list built in slot types: AMAZON.US_STATE, AMAZON.US_FIRST_NAME, AMAZON.Airline (all US, Canadian, Mexican airlines), AMAZON.Airport (USA, Canada, Mexico, Australia, New Zealand, UK, Germany, Italy, and Austria airports), AMAZON.Color, AMAZON.Corporation, AMAZON.Country, AMAZON.DayOfWeek, AMAZON.Month, AMAZON.Room, AMAZON.SocialMediaPlatform, AMAZON.SportsTeam (includes NFL, CFL, NBA, MLB, NHL, and MLS teams)
6. Utterances with these list built in slot types with nominal support (see Nominal Support section): AMAZON.Actor, AMAZON.AdministrativeArea, AMAZON.Artist, AMAZON.Athlete, AMAZON.Author, AMAZON.Book, AMAZON.BookSeries, AMAZON.BroadcastChannel, AMAZON.CivicStructure, AMAZON.Comic, AMAZON.Dessert, AMAZON.Director, AMAZON.EducationalOrganization, AMAZON.Festival, AMAZON.FictionalCharacter, AMAZON.FoodEstablishment, AMAZON.Game, AMAZON.Landform, AMAZON.LandmarksOrHistoricalBuildings, AMAZON.LocalBusiness, AMAZON.LocalBusinessType, AMAZON.MedicalOrganization, AMAZON.Movie, AMAZON.MovieSeries, AMAZON.MovieTheater, AMAZON.MusicAlbum, AMAZON.MusicGroup, AMAZON.Musician, AMAZON.MusicRecording, AMAZON.MusicVenue, AMAZON.MusicVideo, AMAZON.Organization, AMAZON.Person, AMAZON.Professional, AMAZON.Residence, AMAZON.ScreeningEvent, AMAZON.Service, AMAZON.SoftwareApplication, AMAZON.SoftwareGame, AMAZON.SportsEvent, AMAZON.TVEpisode, AMAZON.TVSeason, AMAZON.TVSeries, AMAZON.VideoGame

More Amazon built in slot types are coming shortly
