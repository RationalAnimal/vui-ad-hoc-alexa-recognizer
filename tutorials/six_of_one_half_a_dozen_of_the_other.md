---
layout: page
title: Six of One, Half a Dozen of the Other
permalink: /Tutorials/SixOfOneHalfADozenOfTheOther/
---
One of the biggest issues in natural language processing is understanding different ways of saying the same thing.  For example, if the user is trying to order a
pizza he may say "I would like a large pizza" or "I want a large pizza" or "I wish to order a large pizza", etc - you get the idea.
vui-ad-hoc-alexa-recognizer does give you the ability to specify option lists in the utterances providing a lot of variety without too much effort.
However, in many cases you would have to repeat the same option lists between utterances.  It's labor consuming, error prone, and creates maintenance issues.
Luckily for you vui-ad-hoc-alexa-recognizer has a feature that removes the need for this - text equivalents.

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
prompt> npm install --save tui-sixofonehalfadozenoftheother
prompt> cp node_modules/tui-sixofonehalfadozenoftheother/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

If you are doing this in a directory that already has vui-ad-hoc-alexa-recognizer installed, please install the latest version - some of the
features discussed here will not work with earlier versions.

So what is a text equivalent? It's exactly what it sounds like - some text that's equivalent to another text.  Such text may be bundled into a
text equivalents set.  Then you can specify in your config.json file which one(s) to use to generate your recognizer.json file.
vui-ad-hoc-alexa-recognizer comes with two small sets - default.json and misspelings.json.  Default is a tiny (at this time) set designed more
as an example than a real set.  Misspellings.json is a text equivalent set of common misspelings.  You can also create your own set and use it.
Multiple sets can be used together.  Using these sets is very easy.  All you have to do is enclose the text you wish to use the sets with
in a set of curly brackets with a tilde character.

# Single word equivalents

Lets use our pizza example.  We'll create an IWantPizzaIntent:
{% highlight json %}
{
  "intent": "IWantPizzaIntent",
  "slots": []
}
{% endhighlight %}

and an utterance for it:
{% highlight text %}
IWantPizzaIntent {~I want a large pizza}
{% endhighlight %}

rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test:

{% highlight text %}
prompt> node index.js "I want a large pizza"
{
  "name": "IWantPizzaIntent",
  "slots": {}
}
{% endhighlight %}

So far so good, but there is really nothing new here.  Now try testing a different utterance:
{% highlight text %}
prompt> node index.js "I would like a large pizza"
{
  "name": "IWantPizzaIntent",
  "slots": {}
}
{% endhighlight %}

It still matches!  That's because you specified that the text in the utterance use text equivalent matching by
surrounding it with {~  }

So, which equivalents sets are used by default?  default.json and misspellings.json, both found in the equivalents folder
of vui-ad-hoc-alexa-recognizer.
If you look at the default.json you'll see the following in it:
{% highlight json %}
{
  "words":["want","wish", "like", "need"],
  "synonyms":[
    {"fitRating":1, "values":["want", "wish", "like", "would like", "need"]},
    {"fitRating":0.9, "values":["prefer"]}
  ]
}
{% endhighlight %}

What this snippet shows is that when any of these: "want","wish", "like", "need" are present in the
equivalent matched string, a string containing instead any of these: "want", "wish", "like", "would like", "need", "prefer" will match as well.
That's why "I want a large pizza" and "I would like a large pizza" both match.

You can create your own equivalents data sets as well.  You may want this because you have a special domain specific vocabulary (e.g. medical, insurance, etc)
or because what you are looking for isn't in any of the existing ones.

Let's say you want to create a set of medical terms, you may want to start with a json file (e.g. medicalequivalents.json) containing this:

{% highlight json %}
{
  "singleWordSynonyms":[
    {
      "words":["pills", "medication"],
      "synonyms":[
        {"fitRating":1, "values":["pills", "medication"]}
      ]
    }
  ]
}
{% endhighlight %}

now you can create an intent and utterances that use these words:
{% highlight json %}
{
  "intent": "INeedMedicineIntent",
  "slots": []
}
{% endhighlight %}

and an utterance for it:
{% highlight text %}
INeedMedicineIntent {~I need some medication}
{% endhighlight %}

You also need to do one more thing - update your config.json file to include reference to your new equivalents data set:

{% highlight json %}
{
  "customSlotTypes":[
    {
      "name": "ICECREAMFLAVOR",
      "values": [
        "vanilla",
        "chocolate",
        "strawberry"
      ],
      "filename": "ice_cream_flavors.txt"
    },
    {
      "name": "COFFEEROASTSTRENGTH",
      "values": [
        {
          "value": "dark roast",
          "synonyms": ["dark", "strong", "darkest", "darkest roast"]
        },
        {
          "value": "medium roast",
          "synonyms": ["medium", "not too strong", "not too light", "not too dark", "in the middle", "in between"]
        },
        {
          "value": "light roast",
          "synonyms": ["light", "lightest roast", "lightest"]
        }
      ],
      "filename": "coffeeroaststrength.json"
    },
    {
      "name": "ACCOUNTNUMBER",
      "customRegExpString": "(a{1}[0-9]{8}|a[a-zA-Z]{1}[0-9]{7}|a[a-zA-Z]{2}[0-9]{6}|[0-9]{12}|(?:chck|svng|mmrk)[0-9]{10})",
      "customWildCardRegExpString": "(a{1}[0-9]{8}|a[a-zA-Z]{1}[0-9]{7}|a[a-zA-Z]{2}[0-9]{6}|[0-9]{12}|(?:chck|svng|mmrk)[0-9]{10})"
    },
    {
      "name": "INCIDENTNUMBER",
      "customRegExpString": "([0-9]{3}[a-zA-Z0-9]{8})",
      "customWildCardRegExpString": "([0-9]{3}[a-zA-Z0-9]{8})"
    },
    {
      "name": "ANYTHING",
      "customRegExpString": "(.*)",
      "customWildCardRegExpString": "(.*)"
    }
  ],
  "builtInIntents":[
    {
      "name": "TRANSCEND.RepeatIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.StopIntent",
      "enabled": true,
      "extendedUtterances": ["enough already", "quit now", "be gone from my sight"],
      "extendedUtterancesFilename": "stopIntentExtendedUtterances.txt"
    }
  ],
  "builtInSlots": [],
  "textEquivalents": [
    {
      "equivalentSetBuiltInName": "default"
    },
    {
      "equivalentSetBuiltInName": "misspellings"
    },
    {
      "equivalentSetSrcFilename": "./medicalequivalents.json"
    }
  ]
}
{% endhighlight %}

rebuild the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test:

{% highlight text %}
prompt> node index.js "I need some pills"
{
  "name": "INeedMedicineIntent",
  "slots": {}
}
prompt> node index.js "I need some medication"
{
  "name": "INeedMedicineIntent",
  "slots": {}
}
{% endhighlight %}

# Phrases equivalents

Single words equivalents are all good and fine, but they are not enough.  You can use phrases (multi-word equivalents) too.  You can even
combine them with single word equivalents even when some of those single words are present in the phrases.
And using them is just as simple as using single word equivalents. Continuing our "medical" theme,
imagine if you wanted to detect the user saying he's got a fever.  He might say "I have a fever",
or "I am running a fever", or "I have high temperature".  Now, you could use option lists for all
three of them, but you would have to have the same option list in every place where the user can say
that he (or somebody else) has a fever.  Again, if this is something used in many places in your app
then you could simply define it as a custom text equivalence (assuming there isn't one already defined)
and ask for equivalence matching.

now you can create an intent and utterances that use these phrases:
{% highlight json %}
{
  "intent": "IHaveFeverIntent",
  "slots": []
}
{% endhighlight %}

and an utterance for it:
{% highlight text %}
IHaveFeverIntent {~I have a fever}
{% endhighlight %}

Update your medicalequivalents.json:
{% highlight json %}
{
  "singleWordSynonyms":[
    {
      "words":["pills", "medication"],
      "synonyms":[
        {"fitRating":1, "values":["pills", "medication"]}
      ]
    }
  ],
  "equivalentPhrases":[
    {
      "phrases":["am running a fever", "have a fever", "have high temperature"],
      "equivalents":[
        {"fitRating":1, "values":["am running a fever", "have a fever", "have high temperature"]}
      ]
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
prompt> node index.js "i have a fever"
{
  "name": "IHaveFeverIntent",
  "slots": {}
}
prompt> node index.js "i have high temperature"
{
  "name": "IHaveFeverIntent",
  "slots": {}
}
{% endhighlight %}

# Fit ratings

You probably noticed that there is a "fitRating" field in the data set json.
It is not currently used by the code, but might be in the future.  The intention is
to allow different levels of "equivalence" and then using a threshold for discarding poor
matches.  Many other NLU/NLP services do this, however, I have learned from experience that
this is a bad practice - it allows for sloppy matches based on criteria which usually doesn't
have any real world meaning.  Thus, it is unlikely that I will be implementing the use of
fitRating unless I see something that convinces me otherwise.

# Special tricks using text equivalents

There are many problems that can be solved using text equivalent matching - typos, short hand,
variations, special vocabularies, etc.

### Typos

Included with vui-ad-hoc-alexa-recognizer are two data sets (currently, probably will be more in the future).
One is a small default set, the other is misspellings.json which contains common misspellings and typos.
By using such data sets you don't have to guard every utterance against all possible typos with
option lists.  As long as you have an equivalence between a word/phrase and potentional typos, these typos
will be understood at run time.  So you don't have to worry about the user typing "aer" instead of "are"
into your chat bot as long as you build the recognizer for your chat bot using text equivalents and there
is an equivalence set up between "aer" and "are".

### Short/long versions

Your users may be using words such as "please", or "if you could", or other "skippable" words that are mostly
pleasantries or flowery language.  You can create a data set that makes an equivalence between all such
words and an empty string.  That would effectively allow all such words to be skipped in user input.

### Homophones 

Homophones are words that sound the same but have different spelling.  You could use a data set that
contains homophones and still be able to process user input (for slot values you could use SOUNDEX matching).

### Chatbots vs voice services

You may even build different recognizers to handle voice services vs chatbots.  In a voice service you may
use a homophones data set, while in a chat bot you might use misspellings data set.

# Future sets

There will be more values added to the currently included data sets as well as additional data sets added as time goes on.
If yo would like to contribute - by all means, create a pull request on GitHub and add a data set or some values to a data set.
