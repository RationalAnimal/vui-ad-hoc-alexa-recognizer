[![Build Status](https://travis-ci.org/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg?branch=master)](https://travis-ci.org/RationalAnimal/vui-ad-hoc-alexa-recognizer)
[![NPM downloads](http://img.shields.io/npm/dm/vui-ad-hoc-alexa-recognizer.svg?style=flat&label=npm%20downloads)](https://npm-stat.com/charts.html?package=vui-ad-hoc-alexa-recognizer)
[![OPEN open source software](https://img.shields.io/badge/Open--OSS-%E2%9C%94-brightgreen.svg)](http://open-oss.com)
[![Release](https://img.shields.io/github/release/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg?label=Last%20release&a)](https://www.npmjs.com/package/vui-ad-hoc-alexa-recognizer)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg)](http://isitmaintained.com/project/RationalAnimal/vui-ad-hoc-alexa-recognizer "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/RationalAnimal/vui-ad-hoc-alexa-recognizer.svg)](http://isitmaintained.com/project/RationalAnimal/vui-ad-hoc-alexa-recognizer "Percentage of issues still open")

# vui-ad-hoc-alexa-recognizer

npm module that provides VUI (voice user interface) special ad-hoc recognizer
designed to parse raw text from the user and map it to the Alexa intents.
This could be useful in many cases.  If
you already have an Alexa skill and would like to convert it to Cortana or to
Google assistant, or some other service, this module makes it really easy. Many skills can be converted
in less than an hour.
Also you can use this to quickly create a skill or an app even if you don't already have an Alexa skill.
You will simply need to create the
required intents, utterances, and (optionally) custom slot value files (equivalent of which
you'd have to do anyway).
It uses the same two files (intents and utterances) that are used to configure Alexa skills.
This allows easy "middleware" implementation that can be placed between a Cortana
or Google assistant skill and the Alexa backend.  If you have custom slots and
you want to use exact or SoundEx matches on those slots, then you would also need
file(s) listing these values.
Supports almost all Alexa features - built in intents, all major built in slot types,
most minor ones, 
as well as "extra" features, such as the ability to do wildcard or SoundEx
matches, transforming the values before sending them to be processed, etc.
Additional configuration can be added through config file.
This can be used either by itself or as part of other vui-xxx projects.
You can also use it without any backend service whatsoever - simply use it with your javascript
code same way you would use any other npm module.  It will provide complete
utterance parsing and slot values mapping.  Simply use simple branching
code (e.g. switch statement) using the intent to complete processing.

# Repository
This module as well as related vui modules can be found here:
https://github.com/RationalAnimal

# Note on licenses
The code in this project is distributed under the MIT license.  Some data files
found in the builtinslottypes (e.g. colors.json) use values taken from Wikipedia
and thus they are licensed under Creative Commons Attribution-ShareAlike license.
Such files have appropriate attribution and license information within them.
If you don't wish to deal with these licenses, simply delete such file(s) from
the builtinslottype directory.  You will need to provide your own versions of
these files.  Note that only some of those files have a
different license - you DON'T need to delete the entire directory to remove them.
Simply search in builtinslottypes directory for "license" and/or "attribution"

# Installation

```shell
npm install vui-ad-hoc-alexa-recognizer --save
```

# Summary

npm module that provides VUI (voice user interface) special ad-hoc recognizer
designed to parse raw text from the user and map it to the Alexa intents.  It
uses the same two files (intents and utterances) that are used to configure Alexa skills,
but with additional features. Once parsed, the request can be sent to any
code you want to handle the intents.
This allows easy "middleware" implementation that can be placed between a Cortana
or Google assistant skill and the Alexa backend as well as your own "chatbot"
that doesn't require anybody else services and doesn't even require a backend.
It has two pieces of functionality: first, run it offline to generate a json file
that will be used in matching/parsing the text; second it will match the raw
text at run time using the generated json file.

# Usage

It has two pieces of functionality: first, run it offline to generate a recognizer.json file
that will be used in matching/parsing the text; second add two lines of
code to your app/skill to use it to match the raw
text at run time using the generated recognizer.json file.

Imagine you already have an Alexa skill and you would like to port it to Cortana
or Google Assistant (or even if you don't but want to create a chat bot/service from scratch).
Here are examples of files that you will have for your
Alexa skill or will need to create if you don't have any yet
(these are NOT complete files, you can find the complete sample
files in the test directory):

````shell
> cat test/utterances.txt
````
````
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
````
````shell
> cat test/intents.json
````
````json
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

````
and also here is an example of a custom slot type file:

````shell
> cat test/minions.txt
````
````
Bob
Steve
Stewart
````

## Generate recognizer.json file

The first step is to generate a run time file - recognizer.json.  This file has
all the information that is needed to parse user text later.  To create it, run
the generator, e.g.:

````shell
node generator.js -i test/intents.json -u test/utterances.txt -c test/config.json
````
 (the example intents.json, utterances.txt, and config.json files are included in the test directory)
This will produce a recognizer.json in the current directory.

For usage, simply run the generator without any arguments:

````shell
node generator.js
````

Note here that you should already have the intents.json and utterances.txt files
as these files are used to configure the Alexa skill.  config.json is optional,
but highly recommended if you have custom slots that are used by themselves (not
within a large utterance).  This is where you can provide the values of your
custom slot types (either directly or by providing a file name to load them from).

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

## Parse user text

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

````shell
node matcher.js "here is four hundred eighty eight million three hundred fifty two thousand five hundred twelve and also six oh three five five five one two one two"
````
which will produce:

````json
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
````


````shell
node matcher.js "thirty five fifty one"
````
which will produce:

````json
{
  "name": "FourDigitIntent",
  "slots": {
    "FooSlot": {
      "name": "FooSlot",
      "value": "3551"
    }
  }
}
````

````shell
node matcher.js "sure"
````
which will produce:

````json
{
  "name": "AMAZON.YesIntent",
  "slots": {}
}
````

````shell
> node matcher.js "New England includes New Hampshire as one of its states"
````
which will produce:

````json
{
  "name": "StateIntent",
  "slots": {
    "StateSlot": {
      "name": "StateSlot",
      "value": "New Hampshire"
    }
  }
}
````

````shell
> node matcher.js "My first name is Jim"
````
which will produce:

````json
{
  "name": "FirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "Jim"
    }
  }
}

````

````shell
> node matcher.js "December thirty first nineteen ninety nine"
````
which will produce:

````json
{
  "name": "DateIntent",
  "slots": {
    "DateSlot": {
      "name": "DateSlot",
      "value": "1999-12-31"
    }
  }
}
````

````shell
> node matcher.js "lets do it on tuesday"
````
which will produce:

````json
{
  "name": "DayOfWeekIntent",
  "slots": {
    "DayOfWeekSlot": {
      "name": "DayOfWeekSlot",
      "value": "tuesday"
    }
  }
}
````


Please note that matcher.js is just a convenience and also serves as an example.
You will NOT be using it at run time (most likely, though some might find the use
for it).

You will probably deploy your code (that uses the parser) to some middleware
layer, like this:

````
Alexa  -------------->    Alexa   <-- middleware <---- Cortana
Skill  <-------------- AWS Lambda --> AWS Lambda ---->  Skill
````

Where in the middleware AWS Lambda (exposed via API Gateway) you will be able to
see the raw user text from Cortana (passed as the "message" field in the request),
then call it same way matcher.js does, get the resulting json and update the
intent in the request from "None" to the resulting json.  The backend Lambda can
then process it further.

Notice that this module currently is being written as a primarily stand alone
solution for the Alexa to Cortana (or Google Assistant) porting.  However, it
will be retrofitted later to fit into the vui-xxx framework.

### Matched custom slot values

There are differences between what kind of values different services may send.
Alexa appears to respect capitalization of the custom slot values (or it sends
lower case versions) while Cortana capitalizes the first letter under some
circumstances, but not always, and also adds a period at the end of utterances
or even other punctuation signs (I've seen entering a zip code changed from
"12345" to "Is 12345 ?"). To keep Cortana
behaving consistently, the returned matches use the capitalization of the custom
slot values supplied in the config file rather than what Cortana will send.
Thus, if your custom slot value (in the config file) is "petunia" then "petunia"
will be returned even if Cortana will send you "Petunia".

### Slot flags

In some cases you would like to match on a particular slot differently from the
standard algorithm.  For example, if you are trying to get the user's first name
you may way to match on ANYTHING the user says so that unusual names are matched.
In this case you can modify your utterances file to include special flags, e.g.:

````
FirstNameIntent My first name is {FirstNameSlot: INCLUDE_WILDCARD_MATCH, EXCLUDE_VALUES_MATCH }
````

These flags will be used in parsing. Here are the different currently available
flags:

1. "INCLUDE_VALUES_MATCH", "EXCLUDE_VALUES_MATCH" - to include/exclude custom
slot values in the matching pattern.
2. "INCLUDE_WILDCARD_MATCH", "EXCLUDE_WILDCARD_MATCH" - to include/exclude
a wildcard in the matching pattern.
3. "SOUNDEX_MATCH" - to use SoundEx for matching.
4. "EXCLUDE_YEAR_ONLY_DATES" - this flag is only applied to the AMAZON.DATE type
slot and turns off parsing of a single number as a year.  This is useful when
there are otherwise identical utterances that may match on a number or on a date.  If the year only
match is allowed then there is no way to differenciate between the two.
5. "EXCLUDE_NON_STATES" - this flag is only applied to the AMAZON.US_STATE type
slot and turns off parsing of US territories and D.C.
6. "COUNTRY", "CONTINENT", "TYPE" - these are parameterized flags (see below).  currently
they only apply to the AMAZON.Airline slot type and they restrict the matches to
the specified countries and continents.

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
down the parsing.  If you exclude both then it will be as if you removed that slot
from the utterance completely.  For this reason, parsing ignores these combinations.
If you specify INCLUDE_WILDCARD_MATCH then only the wild card will be used.
If you specify both EXCLUDE_VALUES_MATCH and EXCLUDE_WILDCARD_MATCH then only
EXCLUDE_WILDCARD_MATCH is used.

Also note that you have to be very careful when using wildcards.  For example,
imagine this utterance instead of the above example:

````
FirstNameIntent {FirstNameSlot:INCLUDE_WILDCARD_MATCH,EXCLUDE_VALUES_MATCH}
````

This will match on ANYTHING the user says.  So, DON'T use wildcards in "naked"
utterances (ones that use nothing but slots) unless you are absolutely SURE that
that is what you want. This is why these flags exist at the utterance level rather
than intent level.

Also, you should probably NOT specify wildcard matches on slots of many of the
built in intents, such as date or number - this will likely not end well and
it doesn't make sense. For this reason, parsing ignores these flags at this
time on these slot types.  Parsing will also ignore SOUNDEX_MATCH on non-custom
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

### Removing flags/cleaning up the utterance file
There is also a utility available to "clean up" utterance files for use with
Alexa.  This may be needed if you want to use a single file as your utterances
file for both Alexa and porting projects.  Since the slot flags don't exist in
Alexa, they need to be stripped from the utterance file.  For that use
alexifyutterances.js utility:

```shell
> node alexifyutterances.js -i test/utterances.txt -o testutterances.txt
Result was saved to testutterances.txt
```

You can now import testutterances.txt into the Alexa developer console.

Note that not only will alexify.js remove flags, it will also "unfold"
options lists into multiple utterances so that you can use them with Alexa.
This feature would be usefull even if you only want to use this module to
reduce the tedium of entering multiple lines into Alexa and don't even
intent to create your own chat bot or convert your Alexa skill.

### Nominal support for some built in list slots

Many of the list slots (e.g. AMAZON.Actor) have very large value lists.  These
are often not needed in a typical vui skill.  Thus, a compromize support is
provided for them.  They are there and can be used, but they only have a few
values.  If you actually do have a need for them, you have two options:
1. You can provide your own expansion list of values in the config.json file
2. You can use wildcard slot matching to match on any value the user can provide

### Transform functions

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
code or fixing issues with speach recognition, etc.
For example, a particular service may not understand some spoken phrases well.
One that I've ran into is the word "deductible" is understood to be "the duck tibble".
This will never match.  Well, you could add this to your list of acceptable values.
This will only solve half a problem.  Once you match it and send it to your Alexa
backend, it will choke on this.  So, you can add a transform function to map
"the duck tibble" to "deductible" before sending it off to Alexa backend.

### Dollar values

If a service like Cortana passes a dollar value, e.g. $1000, it will be mapped
to "1000 dollars" as would be expected by an Alexa skill. (Note that if you
want to test it with matcher.js you have to either escape the $ character or
enclose the whole string in '' rather than "" to avoid command line handling
of $)

````shell
> node matcher.js 'the first price is $1000 and the second price is $525000'
````
which will produce:

````json
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
````
Note that this is identical to:

````shell
> node matcher.js 'the first price is 1000 dollars and the second price is 525000 dollars'
````
which will produce:

````json
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
````

### Trailing punctuation

Trailing periods (.), exclamation signs (!), and question marks (?) are ignored
during parsing.

### Commas in numeric slots

Any commas within numeric input, e.g. "20,000", are ignored during parsing.

## Optimizations

Note: now that multi-stage matching has been enabled, the performance should be
a lot better for many previously slow scenarios.  However, you can still make it
faster by arranging for the parsing order and excluding some intents from parsing.

### Intent parsing order

You can pass to the matching call the name(s) of the intents that you want to
try to match first. (Currently it only supports custom intents, but that's not
a problem since built in intents are very fast).  Then this call
will likely execute much faster.  Since most of the time you know what the next
likely answers (i.e. utterances) are going to be, you can provide them to the
matching call.

```javascript
let result = recognizer.Recognizer.matchText("have you been to France", ["CountryIntent"]);
```

### Intent exclusion

In addition to the intent parsing order you can also pass a list of intents to
be excluded from the matching process.  This is useful if you have intents that
have very large sets of custom values and you are pretty sure you don't want to
parse then in a particular place in your skill (i.e. if you are in a flow that
does not include some intents then you should be able to exclude them from
parsing).

```javascript
let result = recognizer.Recognizer.matchText("have you been to France", ["CountryIntent"], ["FirstNameIntent"]);
```

### Alternate recognizer files

In addition to the intent parsing order and intent exclusion lists you can pass
an alternate recognizer file to use in the matching call.

```javascript
let result = recognizer.Recognizer.matchText("have you been to France", ["CountryIntent"], ["FirstNameIntent"], alternativeRecognizer);
```

This can be used both
for performance optimization as well as for breaking up large skills/apps into
smaller chucks, typically by functionality.  Let's say you have a large skill
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

## SoundEx support

SoundEx support has been added at the utterance level for custom slot types.
You can now specify a SOUNDEX_MATCH flag for a custom slot type and SoundEx match
will be used.  This allows matching of expressions that are not exact matches, but
approximate matches.

```shell
> cat utterances.txt
```
where utterances.txt includes this line:

```
MinionIntent Another minion is {MinionSlot:SOUNDEX_MATCH}
```
then
```shell
> node matcher.js "another minion is steward"
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


## Examples

Right now I am focusing on implementing new features and fixing bugs rather than
creating documentation and tutorials.  Using it is relatively easy, but if you need
to find more information than is listed here and don't want to dig through the
code then you may want to take a look at the test directory.  If you've installed
the npm module you will NOT have it, but you can go to the GitHub repo and
clone it to get the full distribution.  Then look at the unit tests to see what
you can parse and what kinds of results you will be getting.

## Trascend features supported

Currently there is one TRANSCEND built in slot type supported: TRANSCEND.US_PRESIDENT

## Alexa features supported

Currently, you can parse:
1. All Alexa built in intents
2. Utterances without slots
3. Utterances with custom slots
4. Utterances with all the numbers/date/time/duration built in slot types: AMAZON.NUMBER, AMAZON.FOUR_DIGIT_NUMBER, AMAZON.DATE, AMAZON.TIME, AMAZON.DURATION
5. Utterances with these list built in slot types: AMAZON.US_STATE, AMAZON.US_FIRST_NAME, AMAZON.Country, AMAZON.Room, AMAZON.Month, AMAZON.DayOfWeek, AMAZON.Color, AMAZON.Airline (initial implementation - all US, Canadian, and Mexican airlines only)
6. Utterances with these list built in slot types with nominal support (see Nominal Support section): AMAZON.Actor, AMAZON.AdministrativeArea, AMAZON.Artist, AMAZON.Athlete, AMAZON.Author, AMAZON.Book, AMAZON.BookSeries, AMAZON.BroadcastChannel, AMAZON.CivicStructure, AMAZON.Comic, AMAZON.Corporation, AMAZON.Dessert, AMAZON.Director, AMAZON.EducationalOrganization, AMAZON.Festival, AMAZON.FictionalCharacter, AMAZON.FoodEstablishment, AMAZON.Game, AMAZON.Landform, AMAZON.LandmarksOrHistoricalBuildings, AMAZON.LocalBusiness, AMAZON.LocalBusinessType, AMAZON.MedicalOrganization, AMAZON.Movie, AMAZON.MovieSeries, AMAZON.MovieTheater, AMAZON.MusicAlbum, AMAZON.MusicGroup, AMAZON.Musician, AMAZON.MusicRecording, AMAZON.MusicVenue, AMAZON.MusicVideo, AMAZON.Organization, AMAZON.Person

More Amazon built in slot types are coming shortly
