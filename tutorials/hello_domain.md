---
layout: page
title: Hello Domain
permalink: /Tutorials/HelloDomain/
---
You've seen before how to create a recognizers and how to enhance them with all sorts of features and functions.
And while recognizers are important, they for the "lower" layer of functionality of vui-ad-hoc-alexa-recognizer.
The domain layer builds on top of the recognizer functionality to enable writing bigger and better chatbots and
voice services and do it easier, faster, and more reliably.
Domains do NOT add any parsing features to what recognizers do.  So what DO they do and why are they important?
Fundamentally, domains allow you to reduce complexity, ease cross team development, increase code reuse, reduce the amount of code needed and replace code with simple configuration.
More specifically:
* define a list of recognizers to be used
* define application state-based conditions for using a particular match (e.g. only test against a particular recognizer if you are in a specific state)
* allow returning of results in addition to simply matching on an intent (e.g. if the user says "How are you doing?", not only will it match on a greeting intent, but also will return "Good, and you?")
* allow updating of the application state right within the matching code rather than having to write the extra code to do it (e.g. if the user says "My name is Bob" then some portion of the state will be set to "Bob" by the domain handling code)
* allow nesting of the domains. This is particularly useful as whole types of interactions can be encapsulated as domains and then reused. It also allows breaking large apps into smaller chunks, i.e. domains.

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
prompt> npm install --save tui-hellodomain
prompt> cp node_modules/tui-hellodomain/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

If you are doing this in a directory that already has vui-ad-hoc-alexa-recognizer installed, please install the latest version - some of the
features discussed here will not work with earlier versions.

**IMPORTANT** Almost all of this tutorial's files are in the chitchat subdirectory.  You'll need to cd into it to go through it.  The reason for
this will become clear in the future tutorials where we'll be using multiple domains.

At the most basic level, domains simply reuse recognizers.  But they allow you to add to that.  For instance, with a recognizer you get the match
but you still have to write the code to respond to that match.  With a domain, you can specify an optional response that should be generated when the match happens.  Then your code can be much simpler - it will just check to see if there is a response, and if so send it back.
Thus you can replace code with configuration for many of your responses.
Next, domains can keep track of your application state.
So you are now free to create smaller recognizers and use domains to apply specific recognizers only when the state passes a specific criteria.
This greately reduces complexity - whenever you break up a large project into a collection of smaller parts the complexity goes down.
In addition, it will also improve performance and reduce the likelyhood of false matches.
State manipulation also works both ways - they can read the state and update it as well.  This allows you to specify how the state is updated after
the match.
Finally, domains also can be nested within other domains.  This means that once you configure a domain, you can reuse it within other domains.
Thus you could write a common domain, such as "ChitChat" domain or "GatherUserInfo" domain and use it within other chat bot or voice service
that needs that functionality.  Domains have support for trusted and untrusted nested domains.  So, if you find a 3rd party "ChitChat" domain, you can include it, but mark it as non-trusted.  It will still have the same functionality, but its state will be kept separate from your main application state and won't be able to read it.  On the other hand, if you write your own "GatherUserInfo" domain, you can mark it as trusted and it will be able to share your
main application state.  Thus, once the user info is gathered, other domains that need it can access it directly.
Note that your trusted domains WILL be able to read the state of untrusted domains.

## Your first domain

So, let's create your first domain.  Since you don't have any other domains to use as nested domains, you'll have to create a recognizer first.
We'll create a greetings or a chit chat domain and a recognizer to go with it. Something that is very very simple, yet can show at least one of the
features of domains.

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
