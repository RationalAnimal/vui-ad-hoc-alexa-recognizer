---
layout: page
title: That Sounds Like You
permalink: /Tutorials/ThatSoundsLikeYou/
---
Sometimes your user will provide some values which are not "quite right".  This could be because you are using a voice-to-speech translation and the user 
is trying to say one word, but the voice-to-speech uses a different one.  Or it may be a chat bot and the user's spell checker picked a similar sounding but wrong word.
Either way, users input "sounds like" what he is trying to say, but isn't spelled that way.  For example, if the user says "male" trying to specify his gender, many
voice-to-speech systems will translate it as "mail".  And some users might even misspell it that way in a chat bot.  This tutorial will show you how to user
SOUNDEX matching to process such input. 

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
prompt> npm install --save tui-thatsoundslikeyou
prompt> cp node_modules/tui-thatsoundslikeyou/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

You've already seen the use of slot flags in the previous tutorial - "Wild (Card) Thing" - where you used INCLUDE_WILDCARD_MATCH flag.
Here you will use SOUNDEX_MATCH to set up a match of words that sound similar to the slot values.
You don't even need to define any new intents nor new slots.  All you have to do is define a new utterance and use SOUNDEX_MATCH flag with the slot:

{% highlight text %}
IceCreamFlavorIntent I think that ice cream {|flavor} is called {IceCreamFlavorSlot:SOUNDEX_MATCH}
{% endhighlight %}

rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

and test:

{% highlight text %}
prompt> node index.js "I think that ice cream is called chokolat"
{
  "name": "IceCreamFlavorIntent",
  "slots": {
    "IceCreamFlavorSlot": {
      "name": "IceCreamFlavorSlot",
      "value": "chocolate"
    }
  }
}
{% endhighlight %}

If your slot value consists of multiple words, each will be converted to a SOUNDEX value and matched.

Note that SOUNDEX_MATCH only applies to custom list based slots.  Also, vui-ad-hoc-alexa-recognizer will silently remove flags that are not compatible with each other
(more on the rules for doing this in a later tutorial). However you shouldn't specify unnecessary flags anyway because sometimes the choices that vui-ad-hoc-alexa-recognizer
might make for you aren't what you want.

SOUNDEX_MATCH will work with custom slots that use synonyms just as well as the ones without synonyms.

That's all there is to it.  As features go it's a useful one, but there isn't really that much to be said about it.

