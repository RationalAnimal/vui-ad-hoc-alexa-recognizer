---
layout: page
title: Express Yourself Regularly
permalink: /Tutorials/ExpressYouselfRegularly/
---
There are some cases of user input that still can't be handled by the means you've seen in the previous tutorials. There are no built-in slot types for them,
you can't define a custom slot type for them, and wildcards don't allow you to be specific enough.  Things like an account number or policy number where the
values are well structured, but change frequently.

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
prompt> npm install --save tui-expressyourselfregularly
prompt> cp node_modules/tui-expressyourselfregularly/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

Imagine you are writing a chat bot for a bank or some other financial institution, may be a mutual fund, or an insurance company,
or even a utility company.
You may be asking the user to enter his account number, or a policy number, or some other specially formatted string.  Furthermore,
let's say this company existed for quite a while and has previously merged with other similar companies, absorbing their customers
with their account numbers.  So, there are now many different formats to deal with.  Let's say we have 3 different formats for an
account number:

* letter a, followed by either 8 digits, or one letter and then 7 digits, or two letters and then 6 digits.
* twelve digit number
* one of these 4 letter sequences: chck, svng, mmrk followed by 10 digits

Additionally, let's say there is another "number", say "incident number" that has the following structure:

* 3 digits, followed by 8 characters, that are a combination of digits and numbers.

And you still want to be able to collect these "numbers" by themselves, without forcing the user to say "my account number is ..." or
"my incident number is ..."

In this example there is definitely "structure" to these account numbers, but there is also enough variability that you couldn't
easily use a trick (like two separate slots, one for the prefix one for the number) and you would like the vui-ad-hoc-alexa-recognizer
to automatically differentiate between the two numbers.

Well, if you haven't used regular expressions this might look like a hard problem.  But if you have used them then you
realize that you could solve this using regular expressions.  Brief explanation - regular expressions are sequences of characters that
define a search pattern.  For example, to search for a single letter you would use this (javascript) regular expression:

{% highlight text %}
/[a-zA-Z]{1}/
{% endhighlight %}

or alternatively

{% highlight text %}
/[a-z]{1}/i
{% endhighlight %}

To search for a single letter followed by 8 numbers use this regular expression:

{% highlight text %}
/[a-zA-Z]{1}[0-9]{8}/
{% endhighlight %}

Since people with different backgrounds may be using vui-ad-hoc-alexa-recognizer, I will not attempt to teach you regular expressions
here.  If you already know them you should be able to follow this tutorial.  If you don't - don't worry.  It's not a particularly
difficult subject to learn.  A web search engine (Google or whatever your preference is) is your friend.  Just search for "javascript regular expressions tutorial"
or something similar to get the basics.  Also, find yourself an online regular expression checker, like regex101.com,
it will make constructing these regular expressions much easier (make sure you select javascript regular expressions if it allows multi-language variations).
A good one will explain to you what the different parts of your regular expression match so you can tell why
your regular expression works the way it does.

So, to cut to the chase, here are the two complete regular expressions, first the account number:

{% highlight text %}
/(a{1}[0-9]{8}|a[a-zA-Z]{1}[0-9]{7}|a[a-zA-Z]{2}[0-9]{6}|[0-9]{12}|(?:chck|svng|mmrk)[0-9]{10})/
{% endhighlight %}

and now the incident number:

{% highlight text %}
/([0-9]{3}[a-zA-Z0-9]{8})/
{% endhighlight %}

Now we can define two custom slot types based on these regular expressions.  To do that, open your config.json file,
and add the following to define ACCOUNTNUMBER:

{% highlight json %}
{
  "name": "ACCOUNTNUMBER",
  "customRegExpString": "(a{1}[0-9]{8}|a[a-zA-Z]{1}[0-9]{7}|a[a-zA-Z]{2}[0-9]{6}|[0-9]{12}|(?:chck|svng|mmrk)[0-9]{10})",
  "customWildCardRegExpString": "(a{1}[0-9]{8}|a[a-zA-Z]{1}[0-9]{7}|a[a-zA-Z]{2}[0-9]{6}|[0-9]{12}|(?:chck|svng|mmrk)[0-9]{10})"
}
{% endhighlight %}

and to define INCIDENTNUMBER add this:

{% highlight json %}
{
  "name": "INCIDENTNUMBER",
  "customRegExpString": "([0-9]{3}[a-zA-Z0-9]{8})",
  "customWildCardRegExpString": "([0-9]{3}[a-zA-Z0-9]{8})"
}
{% endhighlight %}

If you have followed the previous tutorials, your config.json should look something like this:

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
  "builtInSlots": []
}
{% endhighlight %}

Now update intents.json to use these two custom slot types:

{% highlight json %}
{
  "intents": [
    {
      "intent": "GreetingIntent",
      "slots": []
    },
    {
      "intent": "MyFirstNameIntent",
      "slots": [
        {
          "name": "FirstNameSlot",
          "type": "TRANSCEND.US_FIRST_NAME"
        },
        {
          "name": "NicknameSlot",
          "type": "TRANSCEND.US_FIRST_NAME"
        }
      ]
    },
    {
      "intent": "ZipCodeIntent",
      "slots": [
        {
          "name": "ZipCodeSlot",
          "type": "TRANSCEND.NUMBER"
        }
      ]
    },
    {
      "intent": "IceCreamFlavorIntent",
      "slots": [
        {
          "name": "IceCreamFlavorSlot",
          "type": "ICECREAMFLAVOR"
        }
      ]
    },
    {
      "intent": "CoffeeRoastStrengthIntent",
      "slots": [
        {
          "name": "CoffeeRoastStrengthSlot",
          "type": "COFFEEROASTSTRENGTH"
        }
      ]
    },
    {
      "intent": "AccountNumberIntent",
      "slots": [
        {
          "name": "AccountNumberSlot",
          "type": "ACCOUNTNUMBER"
        }
      ]
    },
    {
      "intent": "IncidentNumberIntent",
      "slots": [
        {
          "name": "IncidentNumberSlot",
          "type": "INCIDENTNUMBER"
        }
      ]
    }
  ]
}
{% endhighlight %}

and finally update your utterances.txt file:

{% highlight text %}
AccountNumberIntent {AccountNumberSlot}
IncidentNumberIntent {IncidentNumberSlot}
{% endhighlight %}

Don't forget to rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

If you now test your new recognizer.json you should be able to match on your account numbers and incident numbers:

{% highlight text %}
prompt> node index.js "ab1234567"
{
  "name": "AccountNumberIntent",
  "slots": {
    "AccountNumberSlot": {
      "name": "AccountNumberSlot",
      "value": "ab1234567"
    }
  }
}
prompt> node index.js "123a1b1c1d1"
{
  "name": "IncidentNumberIntent",
  "slots": {
    "IncidentNumberSlot": {
      "name": "IncidentNumberSlot",
      "value": "123a1b1c1d1"
    }
  }
}
{% endhighlight %}

Notice that you DIDN'T have to define any "additional" text to differentiate the utterances for the account and incident numbers from other text.
That's because the regular expressions themselves are sufficiently "unique".

So now you can match a line containing JUST the account number or JUST the incident number.  What if you wanted to match ANY text that the user entered
as long as that text contained either the account number or the incident number?
You could define a custom slot with a regular expression that would match anything and use it in combination with your previous two regular expressions.
Let's see how you would do that.

First, edit config.json to add another custom slot:

{% highlight json %}
{
  "name": "ANYTHING",
  "customRegExpString": "(.*)",
  "customWildCardRegExpString": "(.*)"
}
{% endhighlight %}

and now the intents.json to update the two intents:

{% highlight text %}
{
  "intent": "AccountNumberIntent",
  "slots": [
    {
      "name": "AccountNumberSlot",
      "type": "ACCOUNTNUMBER"
    },
    {
      "name": "AnythingBeforeSlot",
      "type": "ANYTHING"
    },
    {
      "name": "AnythingAfterSlot",
      "type": "ANYTHING"
    }        
  ]
},
{
  "intent": "IncidentNumberIntent",
  "slots": [
    {
      "name": "IncidentNumberSlot",
      "type": "INCIDENTNUMBER"
    },
    {
      "name": "AnythingBeforeSlot",
      "type": "ANYTHING"
    },
    {
      "name": "AnythingAfterSlot",
      "type": "ANYTHING"
    }        
  ]
}
{% endhighlight %}

and finally update the utterances.txt:

{% highlight text %}
AccountNumberIntent {AnythingBeforeSlot}{AccountNumberSlot}{AnythingAfterSlot}
IncidentNumberIntent {AnythingBeforeSlot}{IncidentNumberSlot}{AnythingAfterSlot}
{% endhighlight %}

Rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test your creation:

{% highlight text %}
prompt> node index.js "blah blah blah ab1234567 bleh bleh bleh"
{
  "name": "AccountNumberIntent",
  "slots": {
    "AnythingBeforeSlot": {
      "name": "AnythingBeforeSlot",
      "value": "blah blah blah "
    },
    "AccountNumberSlot": {
      "name": "AccountNumberSlot",
      "value": "ab1234567"
    },
    "AnythingAfterSlot": {
      "name": "AnythingAfterSlot",
      "value": " bleh bleh bleh"
    }
  }
}
prompt> node index.js "foo foo foo 123a1b1c1d1 bar bar bar"
{
  "name": "IncidentNumberIntent",
  "slots": {
    "AnythingBeforeSlot": {
      "name": "AnythingBeforeSlot",
      "value": "foo foo foo "
    },
    "IncidentNumberSlot": {
      "name": "IncidentNumberSlot",
      "value": "123a1b1c1d1"
    },
    "AnythingAfterSlot": {
      "name": "AnythingAfterSlot",
      "value": " bar bar bar"
    }
  }
}
{% endhighlight %}

Now you have made a recognizer.json file that will let you match on anything the user might type and extract an account number or an incident number.

Note that you can use the techniques described here with multiple utterances and multiple recognizer files to create an app/skill/chat bot that is both
very specific and at the same time very flexible.  You can even parse the same utterance multiple times to extract separate pieces of information.
For example, let's say you've defined a separate recognizer.json file (you'll name it something else or put it in a different directory) that can
scan user text for signs of frustration.  For instance, you can have an intent that looks for any swear words:

{% highlight text %}
SwearIntent {AnythingBeforeSlot}{SwearSlot}{AnythingAfterSlot}
{% endhighlight %}

So, if the user says something like:

{% highlight text %}
here it is ab1234567 you idiots
{% endhighlight %}

you'll be able to extract the account number using the first pass with a regular recognizer.json and you can also detect that the user is frustrated
by running it again through the second recognizer that detects swear words.

In case you've forgotten, here is the code in the index.js that specifies which recognizer to use:

{% highlight javascript %}
// Now load and parse the recognizer.json file
let recognizer = require('./recognizer.json');

// Now make the actual call to match the text to intent 
let result = vui.Recognizer.matchText(stringToMatch, undefined, undefined, recognizer);
{% endhighlight %}

In later tutorials you will see how to use domains - they build on top of the recognizer functionality - that make using multiple recognizer files
easy.  They even make it easy to use them conditionally.