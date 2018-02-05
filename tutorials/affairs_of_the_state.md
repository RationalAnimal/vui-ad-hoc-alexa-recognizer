---
layout: page
title: Affairs of the State
permalink: /Tutorials/AffairsOfTheState/
---
In the previous tutorial you saw how to create a simple domain that can respond to the user without having to write conversational code.
But, the responses were very simple - either a single canned response for each intent or a list of canned responses for each intent from which one was chosen at random.
Here we will learn how to use application state to enhance our domain in many ways.

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
prompt> npm install --save tui-affairsofthestate
prompt> cp node_modules/tui-affairsofthestate/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

If you are doing this in a directory that already has vui-ad-hoc-alexa-recognizer installed, please install the latest version - some of the
features discussed here will not work with earlier versions.

**IMPORTANT** Almost all of this tutorial's files are in the chitchat subdirectory.  You'll need to cd into it to go through it.  The reason for
this will become clear in the future tutorials where we'll be using multiple domains.

## Brief overview of the state configuration

In the last tutorial we have configured the domain but we haven't looked too closely at what we were actually doing.  So let's revisit the configuration.
At the top level, you've seen 3 members of a domain.json:

* description
* recognizers
* states

description is self explanatory - it's just a human readable text describing the domain.

recognizers is also pretty clear - it's where you define all the recognizers that MIGHT be used within the domain.  There isn't that much to it - you specify the location
of a recognizer file you'd like to use and the "key" (or alias) that you will refer to it by later.

states - here is where the bulk of the configuration happens and it really has to do with the state management/handling.  Here we'll only discuss the features that
you've seen or are about to see. "states" field is an array of objects.  Each of them has two fields "matchCriteria" and "matchSpec".

### matchCriteria
This field declares what application states this applies to.  So far you've only seen one value here: "default".  Think of it as a "default" in the switch statement - it matches if
no other matchCriteria matches.  For now, we'll continue to use it, but in the future tutorials you will see how to configure a domain section that will apply only when
some state condition is satisfied.

### matchSpec
This field declares what should happen when we do have a state match (or "default" if it
exists and there are no state matches).  This is an array.  Note that ALL "matchSpec" elements will be used when there is a state match.

## Remember your responses

We have used either hard coded or random responses so far.  This acceptable but not very refined.  With hard coded responses your chat bot responds in the same
way every time the user invokes a particular intent.  Random responses are better, but they may still repeat themselves frequently, especially if you have only coded a small
number of replies.  A better way would be to "cycle" through responses in order and start repeating only once you've used all of them.  Similarly, you may pick a response at random, but not reuse again it until all of the responses have been used.  In order to do either of these, we must remember our responses.  And that means we have to have a
persistent "state" that will keep track of them.

A state in vui-ad-hoc-alexa-recognizer is conceptually a JSON object.  I say "conceptually" because it's only the structure that is that of a JSON object.  Your code will NOT
interact directly with the state, only through state accessors.  In fact, there may not even be a JSON state object anywhere.  It's only to ease the mental model that you
should think of it as a JSON representation.  There are two main accessor classes distributed with vui-ad-hoc-alexa-recognizer: a read only and a read/write accessors.
They do, in fact, use a backing JSON object.  But you can write your own accessor to use a SQL or a no-SQL database, a collection of files, a RESTful API call(s) or any other storage mechanism.
For some of the values there may not even be any storage.  You may write an accessor that will return a purely computational value.  For example, you can write an accessor
that, when you attempt to read myState.time.current will simply return the current system time.



### Chit chat recognizer

Our recognizer will be able to parse a number of different greetings.  Utterances such as "Hi", "Hello", "How are you", "What's up", etc.
We'll configure our domain so that it will be able to respond to them in different ways.

Let's first put together a list of utterances (and the corresponding intents) that this recognizer will handle:

{% highlight text %}
HelloIntent {Hi|hello|hey|hi there|howdy}
HowAreYouDoingIntent {how are you doing|how do you do}
HowAreYouIntent how are you
HowIsItGoing {how's it going|how is it going}
GoodPartOfDayIntent good {PartOfDaySlot}{| to you}
HaveAGoodPartOfDayIntent have a good {PartOfDaySlot}
WhatsUpIntent {sup|what's up|what is up}
{% endhighlight %}

This shows the contents of the utterances.txt file.  If you've downloaded the tutorial source this file is located in a chitchat subdirectory,
which is where all the chit chat recognizer related files are.  And here is the intents.json to go along with it:

{% highlight json %}
{
  "intents": [
    {
      "intent": "HelloIntent",
      "slots": []
    },
    {
      "intent": "HowAreYouDoingIntent",
      "slots": []
    },
    {
      "intent": "HowAreYouIntent",
      "slots": []
    },
    {
      "intent": "HowIsItGoingIntent",
      "slots": []
    },
    {
      "intent": "GoodPartOfDayIntent",
      "slots": [
        {
          "name": "PartOfDaySlot",
          "type": "PARTOFDAY"
        }
      ]
    },
    {
      "intent": "HaveAGoodPartOfDayIntent",
      "slots": [
        {
          "name": "PartOfDaySlot",
          "type": "PARTOFDAY"
        }
      ]
    },
    {
      "intent": "WhatsUpIntent",
      "slots": []
    }
  ]
}
{% endhighlight %}

Note that ordinarily most of these intents would be collapsed into one or two - they are too similar to warrant writing different code for.
But here we actually want to separate them so that we can configure different responses for them.  And since this will not require writing code,
there is no reason to "economize" by reducing their number.

Finally, we just need a recognizer config file to wrap up its definition.  Here it is:

{% highlight json %}
{
  "customSlotTypes":[
    {
      "name": "PARTOFDAY",
      "values": [
        "morning",
        "day",
        "afternoon",
        "evening",
        "night"
      ]
    }
  ],
  "builtInIntents":[
    {
      "name": "TRANSCEND.CancelIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.HelpIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.LoopOffIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.LoopOnIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.NextIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.NoIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.PauseIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.PreviousIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.RepeatIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.ResumeIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.ShuffleOffIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.ShuffleOnIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.StartOverIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.StopIntent",
      "enabled": false
    },
    {
      "name": "TRANSCEND.YesIntent",
      "enabled": false
    }
  ]
}
{% endhighlight %}

Note that the bulk of it is the section that turns off built in intents matching. That's because we want our design to be modular.  Thus,
built in intents will be handled separately.
The remainder is a single custom slot used in the "part of day" greetings, e.g. "good afternoon to you".

Assuming that you have downloaded the tutorial code you can now build the recognizer.json file like this:

{% highlight shell %}
propmt> cd chitchat
propmt> npm run build
{% endhighlight %}

If you haven't downloaded the tutorial code then built the recognizer.json file using:

{% highlight text %}
prompt> node ./node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase '.' --runtimeexebase '.' --runtimevuibase './node_modules/vui-ad-hoc-alexa-recognizer' --intents intents.json --utterances utterances.txt --config config.json
{% endhighlight %}

And now, just to verify it:
{% highlight shell %}
propmt> node ./node_modules/vui-ad-hoc-alexa-recognizer/matcher.js "good evening " ../../recognizer.json
{% endhighlight %}

you will see:
{% highlight json %}
{
  "name": "GoodPartOfDayIntent",
  "slots": {
    "PartOfDaySlot": {
      "name": "PartOfDaySlot",
      "value": "evening"
    }
  }
}
{% endhighlight %}

If you get any npm errors, make sure you've done "npm install" command.

Now you have the initial recognizer you are finally ready to configure your first domain.

### Chit chat domain

As the first "pass" at creating our first domain we will add only one feature - hard coded response.
This will produce the same response to each intent.  Here is the updated chitchatdomain.json:

{% highlight json %}
{
  "description": "Chit chat domain",
  "recognizers": [
    {
      "key": "chitchat",
      "pathSpec": {
        "type": "RELATIVE_TO_DOMAIN",
        "path": "./recognizer.json"
      }
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "chitchat",
          "responder": {
            "result": {
              "directValue": {"text": "Hello to you too"}
            }
          }
        }
      ]
    }
  ]
}
{% endhighlight %}

if you now run your domain (cd to the chitchat directory if not there):

{% highlight shell %}
propmt> node node_modules/vui-ad-hoc-alexa-recognizer/domainrunner.js --domain ../../chitchatdomain.json --state ../../state.json --outputState true --builtinaccessor basic
{% endhighlight %}

you should see:

{% highlight text %}
Please type user text:
{% endhighlight %}

go ahead and type any of the utterances that you've entered in your utterance.txt file, e.g. "Hello".  You should get:

{% highlight text %}
Your text was: "Hello"
Domain response:  {
  "match": {
    "name": "HelloIntent",
    "slots": {}
  },
  "result": {
    "text": "Hello to you too"
  }
}
State object:  {}
{% endhighlight %}

What you are seeing within the domain response is the recongnizer match (containing intent name and slots) and the result object which
contains the text you've configured in the chitchatdomain.json to be returned.
So, returning a hard coded response is quite simple.  And if your recognizer only contained a single intent it might even be useful.

You are not limited to a single hard coded result - you can specify multiple results and have one picked at random.
Here is the updated chitchatdomain.js that does that:

{% highlight json %}
{
  "description": "Chit chat domain",
  "recognizers": [
    {
      "key": "chitchat",
      "pathSpec": {
        "type": "RELATIVE_TO_DOMAIN",
        "path": "./recognizer.json"
      }
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "chitchat",
          "responder": {
            "result": {
              "directValues": {
                "pickMethod": "random",
                "values": [
                  {"text": "Hello to you too"},
                  {"text": "Good afternoon"},
                  {"text": "How are you?"}
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
{% endhighlight %}

if you re-run the domain runner again:
{% highlight shell %}
propmt> node node_modules/vui-ad-hoc-alexa-recognizer/domainrunner.js --domain ../../chitchatdomain.json --state ../../state.json --outputState true --builtinaccessor basic
{% endhighlight %}

you should see the 3 hard coded values being returned at random.

Note that at the bottom of the output from the domain runner you also see "State object: {}".  We will cover this in a later tutorial, but
this is one part of what's going to make hard coded responses useful.  You'll be able to apply a particular result only when your chat bot or voice service is in a particular state.  But, importantly, even for the same state you can still generate different results from the same configuration.
You can do that with response functions.  There are 3 types of such functions: built in, inline, and modules.  Inline and module functions are
custom functions that you would write to create whatever output you would like.  Built in response functions let you create most common types of
dynamic responses.
There are, in fact, built in functions that can select the response based on the intent name.  Here we'll use one of them - intentDirectValue - to create a domain that give different responses for different intents.

See below the updated chitchatdomain.json:

{% highlight json %}
{
  "description": "Chit chat domain",
  "recognizers": [
    {
      "key": "chitchat",
      "pathSpec": {
        "type": "RELATIVE_TO_DOMAIN",
        "path": "./recognizer.json"
      }
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "chitchat",
          "responder": {
            "result": {
              "builtInResponderFunction": "intentDirectValue",
              "functionArguments": {
                "directValue": {
                  "HelloIntent": {"text": "Hello to you too"},
                  "HowAreYouDoingIntent" : {"text": "I am doing well, and you?"},
                  "HowAreYouIntent": {"text": "I'm good, thanks"},
                  "HowIsItGoing": {"text": "Pretty well. What about you?"},
                  "GoodPartOfDayIntent": {"text": "Thanks, same to you"},
                  "HaveAGoodPartOfDayIntent": {"text": "Thank you, you as well"},
                  "WhatsUpIntent": {"text": "Not much, what's up with you?"}
                }
              }
            }
          }
        }
      ]
    }
  ]
}
{% endhighlight %}

The "buildInResponderFunction" field names the function to use, and the "functionArguments" member allows us to
define the value to be returned for each intent.

Go ahead, rerun the domain runner:

{% highlight shell %}
propmt> node node_modules/vui-ad-hoc-alexa-recognizer/domainrunner.js --domain ../../chitchatdomain.json --state ../../state.json --outputState true --builtinaccessor basic
{% endhighlight %}

and you'll see the responses in action:
{% highlight text %}
Please type user text: hello
Your text was: "hello"
Domain response:  {
  "match": {
    "name": "HelloIntent",
    "slots": {}
  },
  "result": {
    "text": "Hello to you too"
  }
}
State object:  {}
Please type user text: how are you
Your text was: "how are you"
Domain response:  {
  "match": {
    "name": "HowAreYouIntent",
    "slots": {}
  },
  "result": {
    "text": "I'm good, thanks"
  }
}
State object:  {}
Please type user text: sup
Your text was: "sup"
Domain response:  {
  "match": {
    "name": "WhatsUpIntent",
    "slots": {}
  },
  "result": {
    "text": "Not much, what's up with you?"
  }
}
State object:  {}
{% endhighlight %}

The last thing we'll do in this introductory domain tutorial is use another simple built in responder function - intentDirectValues - to
return a result at random from intent depended list of results.

Here is the update chitchatdomain.json:

{% highlight json %}
{
  "description": "Chit chat domain",
  "recognizers": [
    {
      "key": "chitchat",
      "pathSpec": {
        "type": "RELATIVE_TO_DOMAIN",
        "path": "./recognizer.json"
      }
    }
  ],
  "states": [
    {
      "matchCriteria": "default",
      "matchSpecs": [
        {
          "recognizer": "chitchat",
          "responder": {
            "result": {
              "builtInResponderFunction": "intentDirectValues",
              "functionArguments": {
                "directValues": {
                  "HelloIntent": {
                    "pickMethod": "random",
                    "values": [
                      {"text": "Hello to you too"},
                      {"text": "Hi"},
                      {"text": "Hey there"}
                    ]
                  },
                  "HowAreYouDoingIntent" : {
                    "pickMethod": "random",
                    "values": [
                      {"text": "I am doing well, and you?"},
                      {"text": "I am doing pretty well, thanks for asking"}
                    ]
                  },
                  "HowAreYouIntent": {
                    "pickMethod": "random",
                    "values": [
                      {"text": "I'm good, thanks"},
                      {"text": "pretty good, thanks"}
                    ]
                  },
                  "HowIsItGoing": {
                    "pickMethod": "random",
                    "values": [
                      {"text": "Pretty well. What about you?"},
                      {"text": "Rather well, considering..."}
                    ]
                  },
                  "GoodPartOfDayIntent": {
                    "pickMethod": "random",
                    "values": [
                      {"text": "Thanks, same to you"},
                      {"text": "Yes, it is"}
                    ]
                  },
                  "HaveAGoodPartOfDayIntent": {
                    "pickMethod": "random",
                    "values": [
                      {"text": "Thank you, you as well"},
                      {"text": "Will do, thanks"}
                    ]
                  },
                  "WhatsUpIntent": {
                    "pickMethod": "random",
                    "values": [
                      {"text": "Not much, what's up with you?"},
                      {"text": "Sup"}
                    ]
                  }
                }
              }
            }
          }
        }
      ]
    }
  ]
}
{% endhighlight %}
 
Now rerun the domain runner and experiment with different answers, repeating them to see the domain returning different results:

{% highlight shell %}
propmt> node node_modules/vui-ad-hoc-alexa-recognizer/domainrunner.js --domain ../../chitchatdomain.json --state ../../state.json --outputState true --builtinaccessor basic
{% endhighlight %}

To sum up - you've seen how to create a whole interaction (although a very simple one) without writing any conversation specific code.
