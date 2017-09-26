---
layout: page
title: Known Intentions
permalink: /Tutorials/KnownIntentions/
---
You've seen built in slot types and simple custom slot types used in your intents.  But in addition to the intents that you yourself create, there are also some built in intents as well.
Here we'll go over them and what you can do with them and even to them.

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
prompt> npm install --save tui-knownintentions
prompt> cp node_modules/tui-knownintentions/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

If you try to type some common responses into your previous tutorials (using index.js to see what your answers parse as) you might discover something unexpected:

{% highlight shell %}
prompt> node index.js "yes"
{
  "name": "AMAZON.YesIntent",
  "slots": {}
}
{% endhighlight %}

What's going on here? You have NOT defined any intents to parse "yes" and yet here it is - parsed without an error.  And there are other utterances that will parse, e.g.:

{% highlight shell %}
prompt> node index.js "stop"
{
  "name": "AMAZON.StopIntent",
  "slots": {}
}
prompt> node index.js "cancel"
{
  "name": "AMAZON.CancelIntent",
  "slots": {}
}
{% endhighlight %}

It's actually quite simple - there are some "built in" intents, just like there are "built in slot types".  A built in intent is just that - it's an intent that has been predefined for you.
There are currently a little over a dozen of these, here is the current list of all such intents:

* TRANSCEND.CancelIntent
* TRANSCEND.HelpIntent
* TRANSCEND.LoopOffIntent
* TRANSCEND.LoopOnIntent
* TRANSCEND.NextIntent
* TRANSCEND.NoIntent
* TRANSCEND.PauseIntent
* TRANSCEND.PreviousIntent
* TRANSCEND.RepeatIntent
* TRANSCEND.ResumeIntent
* TRANSCEND.ShuffleOffIntent
* TRANSCEND.ShuffleOnIntent
* TRANSCEND.StartOverIntent
* TRANSCEND.StopIntent
* TRANSCEND.YesIntent

Most of these use exactly the type of "utterances" that you would expect - "cancel" will trigger TRANSCEND.CancelIntent, "help" will trigger "Transcend.HelpIntent", and so on.
You can and should use these for the common utterances when it makes sense.
Sometimes, however, you may not want these to be activated.  So, there is a way to configure that.  All you have to do is put an entry into the config.json for every built in
intent you wish to configure.  For example, you might update your config.json like this:

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
    }
  ],
  "builtInIntents":[
    {
      "name": "TRANSCEND.RepeatIntent",
      "enabled": false
    }
  ],
  "builtInSlots": []
}
{% endhighlight %}

What this will do is disable matching on the TRANSCEND.RepeatIntent.  You can test it. Use node index.js "repeat" with and
without the above change.  Don't forget to rebuild recognizer.json after you make changes to config.json:

{% highlight shell %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

There is another bit of customization you can do to the built in intents - you can add utterances that will trigger them.  You can add these either
directly in the config.json file and/or in a separate file.  vui-ad-hoc-alexa-recognizer will combine both sets and use them. So,
let's edit config.json again:

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

and add stopIntentExtendedUtterances.txt containing "leave me alone" as the only text.

Now, regenerate the recognizer.json again:

{% highlight shell %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test.  Try using any of the values you've just specified in the config file or in the stopIntentExtendedUtterances.txt, e.g.:

{% highlight text %}
prompt> node index.js "leave me alone"
{
  "name": "AMAZON.StopIntent",
  "slots": {}
}
{% endhighlight %}

As you can see it works, well, sort of works.  It matches on AMAZON.StopIntent, not on TRANSCEND.StopIntent.  That's due to historical/compatibility issues.
In a future tutorial I'll show you how to configure the recognizer.json to return intents, slots, etc. appropriate for a particular platform.