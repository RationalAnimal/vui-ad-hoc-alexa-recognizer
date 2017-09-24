---
layout: page
title: He spoke bespoke
permalink: /Tutorials/HeSpokeBespoke/
---
You've now see a couple of different built in slot types and used them in a mini chat bot.  There are a lot more of these built in
slot types - several dozen or so, with more coming.  For the latest list see the bottom of the README.md file of the vui-ad-hoc-alexa-recognizer.
However, no system can hope to provide built in slot types for every conceivable use.  When you need a special slot type you will turn to
custom slot types.  Here we will go through the most common way to create one.

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
prompt> npm install --save tui-hespokebespoke
prompt> cp node_modules/tui-hespokebespoke/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

The simplest type of a custom slot is a list based custom slot.  What that means is that you can provide a list of possible values for a slot type and give it a slot type name and, voila - you have a custom slot type.
For example, let's say you want to have a slot type of ice cream flavors.  You can create a list of such flavors and give it a slot type name of ICECREAMFLAVOR (or any other acceptable name you like) and you'll have
a custom slot type that you can use in your app, skill, or chat bot.

You will use your config file to specify a custom slot, like this:

{% highlight json %}
{
  "customSlotTypes":[
    {
      "name": "ICECREAMFLAVOR",
      "values": [
        "vanilla",
        "chocolate",
        "strawberry"
      ]
    }
  ],
  "builtInIntents":[],
  "builtInSlots": []
}
{% endhighlight %}

Now you could define an intent and use this slot type in it by inserting the following into intents.json:

{% highlight json %}
{
  "intent": "IceCreamFlavorIntent",
  "slots": [
    {
      "name": "IceCreamFlavorSlot",
      "type": "ICECREAMFLAVOR"
    }
  ]
}
{% endhighlight %}
 
and don't forget to update the utterances:

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
GreetingIntent {sup|what's up|what is up}
MyFirstNameIntent My first name is {FirstNameSlot}
MyFirstNameIntent My first name is {FirstNameSlot} but people call me {NicknameSlot}
ZipCodeIntent {|the |my }{zip|zip code|postal code} {|is }{ZipCodeSlot}
ZipCodeIntent {ZipCodeSlot} is {my|the} {zip|zip code|postal code}
IceCreamFlavorIntent {my favorite|the best} ice cream {|flavor} is {IceCreamFlavorSlot}
{% endhighlight %}

if you haven't downloaded the tutorial module don't forget to regenerate recognizer.json: 
{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

Now if you run the index.js you can to verify that you are getting your values back:

{% highlight text %}
prompt> node index.js "my favorite ice cream is vanilla"
{% endhighlight %}
{% highlight json %}
{
  "name": "IceCreamFlavorIntent",
  "slots": {
    "IceCreamFlavorSlot": {
      "name": "IceCreamFlavorSlot",
      "value": "vanilla"
    }
  }
}
{% endhighlight %}

So, as you can see it's very easy to define a list based custom slot type.  The only annoying part is that the values have to be entered into
the config file.  Luckily, you can specify the extra values in a separate text file (one value per line) and simply reference that file within
the config file.  In fact, you can even combine the two methods - specify some values in the config file itself and others in a separate text file.
Whatever works for you!

So, let's add a few more flavors using ice_cream_flavors.txt:

{% highlight text %}
banana
rocky road
{% endhighlight %}

and update the config.json too:

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
  "builtInIntents":[],
  "builtInSlots": []
}
{% endhighlight %}

So, let's verify that this works.  First, make sure you have regenerated the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

Note the "--sourcebase ." arguments.  What that means is "use the current directory - '.' - as the source directory to look for other files".  Any files
specified on the command line or in the config.json file will be relative to this directory.

Now, if everything went well, you should have a brand new recognizer.json file in your current directory. (If you got an error, make sure you have 
installed at least v1.0.621 version of vui-ad-hoc-alexa-recognizer as prior versions don't fully support --sourcebase argument).
So, go ahead and test your project:

{% highlight text %}
prompt> node index.js "my favorite ice cream is vanilla"
{
  "name": "IceCreamFlavorIntent",
  "slots": {
    "IceCreamFlavorSlot": {
      "name": "IceCreamFlavorSlot",
      "value": "vanilla"
    }
  }
}
prompt> node index.js "my favorite ice cream is banana"
{
  "name": "IceCreamFlavorIntent",
  "slots": {
    "IceCreamFlavorSlot": {
      "name": "IceCreamFlavorSlot",
      "value": "banana"
    }
  }
}
prompt> node index.js "my favorite ice cream is rocky road"
{
  "name": "IceCreamFlavorIntent",
  "slots": {
    "IceCreamFlavorSlot": {
      "name": "IceCreamFlavorSlot",
      "value": "rocky road"
    }
  }
}
prompt> node index.js "my favorite ice cream is blueberry"
undefined
{% endhighlight %}

Now, if you'd like go ahead and update talk.js to respond to this new intent.
