---
layout: page
title: Would You Like Some Fries with That?
permalink: /Tutorials/WouldYouLikeSomeFriesWithThat/
---
You don't create a voice service or a chat bot to simply chat with the users without any further purpose.
You have some business logic that gets called.  Even IF you did write a simple "chatter box" you still would
want to do something with the conversation - log it, analyze it so it can be improved, etc.
Good programming practices would suggest separating "parsing/matching" logic from business logic, and further from infrastructure
and/or reporting logic.
Luckily for you vui-ad-hoc-alexa-recognizer has a feature that makes this easy - "mix in"s (aka "add on"s).

Before we proceed, as in the previous tutorials, ensure that you have node and npm installed, create a new directory and initialize npm project there (accepting default values):
{% highlight shell %}
prompt> node -v
v6.9.4
prompt> npm -v
3.10.10
prompt> npm init
{% endhighlight %}

Note: if you don't want to type in all the source code, you don't have to.  This tutorial is available as an npm module.  Simply load the module, then copy all the files to your current directory:

{% highlight shell %}
prompt> npm install --save tui-wouldyoulikefrieswiththat
prompt> cp node_modules/tui-wouldyoulikefrieswiththat/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

If you are doing this in a directory that already has vui-ad-hoc-alexa-recognizer installed, please install the latest version - some of the
features discussed here will not work with earlier versions.

If you've never heard of "mix-ins" in programming before it refers to some functionality that can be added to (or mixed into) your code.
The original term came from an ice cream store around MIT in the 1980's that used to let you add "mix-ins" to your ice cream, such as
chocolate chips or nuts or M&Ms that would be mixed right into ice cream.
(I don't know if it's still there, but you can now get the same service in many other ice cream parlors).

In vui-ad-hoc-alexa-recognizer mix ins provide additional functionality beyond intent matching and slot value extraction.
They exist in two varieties - built in mix ins, and custom mix ins.
Currently there are only about seven built in mix ins, but more will be added as time goes on.  Here is the list with a short description for each:

* adddefaultslots - can be used to inject slot(s) with hard coded values
* changeintent - can be used to change the matched intent to another one
* charactercount - counts the characters in the matched utterance and attaches this count to the result
* countregexp - counts the occurence of the specified reg exp and attaches this count to the result
* noop - a simple logging mix in.  Does not modify the result in any way, simply logs it to console
* removeslots - removes all matched slots from the result
* wordcount counts the words in the matched utterance and attaches this count to the result

Here I'll demonstrate the use of some of the built in mix ins.

The biggest advantage of having mix ins is that you can implement custom mix ins by writing simple functions and use config.json file to "mix in" your
code into the matching/parsing process.

So, let's dive in

## Built in mix ins examples

Let's say you wanted to log whenever a particular intent was matched.  There is a mix in for that - noop (can be found in the builtinmixins directory).
Since it's already written, all you have to do is configure its use.  Simply add a this to the config.json file:

{% highlight json %}
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
      "intentMatchRegExString": "(TRANSCEND[.]StopIntent)"
    }
  ]
}
{% endhighlight %}

rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test:

{% highlight text %}
prompt> node index.js "stop"
noop built in mix in called
noop standardArgs:  {"intentName":"AMAZON.StopIntent","utterance":"stop","priorResult":{"name":"AMAZON.StopIntent","slots":{}}}
noop customArgs:  {"log":true}
{
  "name": "AMAZON.StopIntent",
  "slots": {}
}
{% endhighlight %}

Note the three lines that begin with "noop" - these are console.log outputs from the noop mix in and they are here because you've
configured noop to be called by making the update to config.json.

Now, imagine you would like to start treating any utterances that would trigger "TRANSCEND.StopIntent" as if the user said
something that would trigger "TRANSCEND.CancelIntent".  You might want to do this because you may want to keep the user
in the conversation instead of leaving (not a nice thing to do, btw, but under some circumstances that may be necessary).
Rather than changing your business logic to respond to StopIntent as if it's CancelIntent you can simply change the matched
intent via a simple mix in configuration:

{% highlight json %}
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
        },
        {
          "mixInBuiltInName": "changeintent",
          "arguments": {"newIntent": "TRANSCEND.CancelIntent"}
        }
      ]
    }
  ],
  "appliesTo": [
    {
      "bundleName": "loggingMixIn",
      "intentMatchRegExString": "(TRANSCEND[.]StopIntent)"
    }
  ]
}
{% endhighlight %}

rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test:

{% highlight text %}
prompt> node index.js "stop"
noop built in mix in called
noop standardArgs:  {"intentName":"AMAZON.StopIntent","utterance":"stop","priorResult":{"name":"AMAZON.StopIntent","slots":{}}}
noop customArgs:  {"log":true}
{
  "name": "TRANSCEND.CancelIntent",
  "slots": {}
}
{% endhighlight %}

Notice you now have a different result being returned!  In fact - the noop mix in still logs the TRANSCEND.StopIntent, but then changeintent
mix in is executed and it changes the intent to TRANSCEND.CancelIntent.

So, what are the different bits in the configuration?  There are two parts to it: configuring mix in bundles and then
specifying what the bundles apply to.
A mix in bundle is one or more pairs of code and custom arguments.  The code can reference a built in mix in (as in above examples) or custom.
The custom arguments will be passed to the code at run time along with standard arguments (more on these later).
As you've just seen, you can have multiple such pairs in a bundle.  They will be run in order of the declaration within the config file.

The "appliesTo" member specifies what each bundle will apply to.  You have two options:
1. specify an intent name regular expression
2. specify that a bundle should apply when there is no match

You've already seen how a bundle can be applied to a particular intent (TRANSCEND.StopIntent in our example).  To apply a bundle to
the result without a match do this in the config.json:

{% highlight json %}
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
      "unmatched": true
    }
  ]
}
{% endhighlight %}

rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test by entering something that will not match:

{% highlight text %}
prompt> node index.js "asdfasdf afsdfasf asdfasdfasdf"
noop built in mix in called
noop standardArgs:  {"utterance":"asdfasdf afsdfasf asdfasdfasdf","priorResult":{}}
noop customArgs:  {"log":true}
undefined
{% endhighlight %}

As you can see, there is no match (undefined is returned) and there IS logging - so we have just applied noop mix in to an unmatched result.

Also note that the intent name regular expression can specify any number of intents.  In fact, if you want some mix in to apply to ALL intents
then you can simply specify (.+) as your intentMatchRegExString

## Custom mix ins

The real power of the mix ins lies in the ability to write a custom mix in.  You should look at the builtinmixins directory for the source
code of the built in mix ins.  That's because they are written in the same way as custom ones.  Here is the source of the changeintent mix in:

{% highlight javascript %}
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
  let newIntent;
  if(typeof customArgs !== "undefined" && customArgs !== null){
    newIntent = customArgs.newIntent;
  }
  else {
    return;
  }
  if(typeof priorResult !== "undefined" && priorResult !== null){
    priorResult.name = newIntent;
  }
};
{% endhighlight %}

Several key points to note:

1. This file is written as an npm module - it exports one function that IS the mix in
2. The function takes two arguments - the first one is an object that contains standard arguments, the second one - custom arguments
3. The standard arguments have (at this time) 3 fields: intentName, utterance, and priorResult.  Technically, intentName is redundant
because you can get it from priorResult, but it's a nice convenience.  Utterance is the actual text the user entered, priorResult is
the match, possibly modified by previously applied mix ins.
4. The custom arguments are taken from the bundle portion of the config.json and passed "as is".
5. There is no return value
6. This code can modify the priorResult and that change will be propagated.  Even if priorResult is undefined or null, if the
mix in sets it to some new value, it will be used as the result later.

So, let's see a more realistic example.  Let's say you are asking your user how many soft drinks he'd like with his pizza.
You may have an SoftDrinkCountIntent with a SoftDrinkCountSlot defined like this:

{% highlight json %}
{
  "intent": "SoftDrinkCountIntent",
  "slots": [
    {
      "name": "SoftDrinkCountSlot",
      "type": "TRANSCEND.NUMBER"
    }
  ]
}
{% endhighlight %}

and a couple of utterances to go with it:
{% highlight text %}
SoftDrinkCountIntent I would like {SoftDrinkCountSlot} soft {drink|drinks}
SoftDrinkCountIntent I don't want any soft drinks
{% endhighlight %}

Both of these will match on the SoftDrinkCountIntent, but only the first one will actually return a slot value.
You can fix this by detecting that the user indicated 0 (by saying he doesn't want any) and populate the slot,
so that the business logic doesn't have to deal with this situation.

Here is an example of a mix in that will do this (save it as injectzeroslotvalue.js):

{% highlight javascript %}
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
    if(utterance === "I don't want any soft drinks"){
      priorResult.slots["SoftDrinkCountSlot"] = {
        "name": "SoftDrinkCountSlot",
        "value": "0"
      };
    }
  }
};
{% endhighlight %}

Now, all we need to do is update the config.json:

{% highlight json %}
"mixIns": {
  "bundles": [
    {
      "bundleName": "fixZeroDrinks",
      "mixInCode": [
        {
          "mixInSrcFileName": "./injectzeroslotvalue.js",
          "arguments": {}
        }
      ]
    }
  ],
  "appliesTo": [
    {
      "bundleName": "fixZeroDrinks",
      "intentMatchRegExString": "(SoftDrinkCountIntent)"
    }
  ]
}
{% endhighlight %}

then rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test:

{% highlight text %}
prompt> node index.js "I don't want any soft drinks"
{
  "name": "SoftDrinkCountIntent",
  "slots": {
    "SoftDrinkCountSlot": {
      "name": "SoftDrinkCountSlot",
      "value": "0"
    }
  }
}
{% endhighlight %}

You have now successfully relieved your business logic of having to worry about handling "special" cases, like no slot values.  Now, the business logic
will always get a slot value no matter what the user says.