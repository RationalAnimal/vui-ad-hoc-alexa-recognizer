# vui-ad-hoc-alexa-recognizer

npm module that provides VUI (voice user interface) special ad-hoc recognizer
designed to parse raw text from the user and map it to the Alexa intents.  It
uses the two files (intents and utterances) that are used to configure Alexa skills.
This allows easy "middleware" implementation that can be placed between a Cortana
or Google assistant skill and the Alexa backend.
Additional configuration can be added through config file.
This can be used either by itself or as part of other vui-xxx projects.

# Repository
This module as well as related vui modules can be found here:
https://github.com/RationalAnimal

# Installation

```shell
	npm vui-ad-hoc-alexa-recognizer --save
```

# Summary

npm module that provides VUI (voice user interface) special ad-hoc recognizer
designed to parse raw text from the user and map it to the Alexa intents.  It
uses the two files (intents and utterances) that are used to configure Alexa skills.
This allows easy "middleware" implementation that can be placed between a Cortana
or Google assistant skill and the Alexa backend.
Additional configuration can be added through config file.
This can be used either by itself or as part of other vui-xxx projects.
It has two pieces of functionality: first, run it offline to generate a json file
that will be used in matching/parsing the text; second it will match the raw
text at run time using the generated json file.

# Usage

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
as these files are used to configure the Alexa skill.  Config.json is optional,
but highly recommended if you have custom slots that are used by themselves (not
within a large utterance).  This is where you can provide the values of your
custom slot types (either directly or by providing a file name to load them from)

## Parse user text

The second step is to use recognizer.json file at run time to parse the user
text and produce the output json that can be used to set the intent portion of
the request json.  For an example of how to use it, try:

````shell
node matcher.js "Bob"
````
which will produce:

````shell
result:  {
  "name": "MinionIntent",
  "slots": {
    "MinionSlot": {
      "name": "MinionSlot",
      "value": "Bob"
    }
  }
}
````
or

````shell
node matcher.js "here is one hundred thousand and two three four"
````
which will produce:

````shell
result:  {
  "name": "BlahIntent",
  "slots": {
    "BlahSlot": {
      "name": "BlahSlot",
      "value": "100000"
    },
    "BlehSlot": {
      "name": "BlehSlot",
      "value": "234"
    }
  }
}
````
Please note that matcher.js is just a convenience and also serves as an example.
You will NOT be using it at run time (most likely, though some might find the use
for it).  You will probably deploy it to some middleware layer, like this:

````shell
  Alexa  --------------> Alexa
  Skill  <-------------- AWS Lambda
                           ^   |
                           |   |
  Cortana --> middleware --/   /
  Skill <---- AWS Lambda <-----
````

Where in the middleware AWS Lambda (exposed via API Gateway) you will be able to
see the raw user text from Cortana (passed as the "message" field in the request),
then call it same way matcher.js does, get the resulting json and update the
intent in the request from "None" to the resulting json.  The backend Lambda can
then process it further.

Notice that this module currently is being written as a primarily stand alone
solution for the Alexa to Cortana (or Google Assistant) porting.  However, it
will be retrofitted later to fit into the vui-xxx framework.
