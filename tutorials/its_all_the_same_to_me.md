---
layout: page
title: It's All the Same to Me
permalink: /Tutorials/ItsAllTheSameToMe/
---
You've seen simple custom slot types and used them in your intents.  But there is more to them than just a list of values.  You can create synonyms as well.

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
prompt> npm install --save tui-itsallthesametome
prompt> cp node_modules/tui-itsallthesametome/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

Imagine you are writing a skill or a chat bot that wants to ask people what kind of coffee they would like.  They might say "dark roast" or "medium decaf" or "strong", etc.  If you have been to
a typical chain coffee house you know the drill - there are hundreds of combinations.  Some of them you will deal with by defining multiple custom slots (e.g. one for the type of milk, one for the type
of syrup, etc).  But let's focus on the strength of the coffee.  Most of the time you have 3 "strengths" - dark, medium, and light.  But there is more than one way to say each one of them.
Now, you can enter each one as a separate value and then in your own code map that to one of the 3 levels.
However, a better way of doing it is to specify synonyms for each one.  So, for the dark you might accept these values:

* dark
* dark roast
* strong
* darkest
* darkest roast

for the medium you might accept these values:

* medium
* medium roast
* not too strong
* not too dark
* not too light
* in the middle
* in between

for the light roast you might accept these values:

* light
* light roast
* lightest
* lightest roast

So, how do you specify that these values are synonyms?  Furthermore, how do you specify which value to return when one of them matches?
You do that by defining a custom slot that uses json objects for some (all) of its values.
Specifically, instead of providing just a string value like you did before, now you will provide a json object that will have
at least two fields: value and synonyms.  Value field should contain the string that will be returned if it or any of its synonyms match.
Synonyms is an array of strings that may also match (but the returned string will be the one in the "value" field).

So, if you are defining it in your config.json file, this slot might look like this:

{% highlight json %}
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
  ]
}
{% endhighlight %}

Now you can use this slot in your intents and utterances.  First, update the intents:
{% highlight json %}
{
  "intent": "CoffeeRoastStrengthIntent",
  "slots": [
    {
      "name": "CoffeeRoastStrengthSlot",
      "type": "COFFEEROASTSTRENGTH"
    }
  ]
}
{% endhighlight %}

Second, update utterances to add something like this:
{% highlight text %}
CoffeeRoastStrengthIntent {I'd like |give me |I'll try |how about |}{your |}{CoffeeRoastStrengthSlot}{ please|}
{% endhighlight %}

Don't forget to rebuild recognizer.json after you make changes:

{% highlight shell %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and now lets test it:

{% highlight shell %}
prompt> node index.js "give me your darkest please"
{% endhighlight %}

you should get this answer:

{% highlight json %}
{
  "name": "CoffeeRoastStrengthIntent",
  "slots": {
    "CoffeeRoastStrengthSlot": {
      "name": "CoffeeRoastStrengthSlot",
      "value": "dark roast"
    }
  }
}
{% endhighlight %}

Note that you can mix and match the simple string values and json object values - the same array can contain both.
And just as with simple string lists, you can load these json objects from a file.  However, there is a small
restriction - if ANY of the values in your external file are json objects, then the entire set must be in a file
with a .json extension and contain valid json. If the file that's being loaded does NOT have a .json extension
then it will be loaded as plain strings, even if the contents are json formatted.  For example,
if you have the coffeeroaststrength.json file containing:

{% highlight json %}
[
  {
    "value": "pure coal",
    "synonyms": ["incinerated"]
  }
]
{% endhighlight %}

and you update your config.json file to include the use of this file, thusly:

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

then regenerate recognizer.json:

{% highlight shell %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test it:

{% highlight shell %}
prompt> node index "give me incinerated please"
{% endhighlight %}

you'll see

{% highlight json %}
{
  "name": "CoffeeRoastStrengthIntent",
  "slots": {
    "CoffeeRoastStrengthSlot": {
      "name": "CoffeeRoastStrengthSlot",
      "value": "pure coal"
    }
  }
}
{% endhighlight %}

Also note that other features, such as SOUNDEX matching (to be covered in a later tutorial) will apply to slots
with synonyms.

That's all there is to know about synonyms.  
