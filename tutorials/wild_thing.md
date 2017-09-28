---
layout: page
title: Wild (Card) Thing
permalink: /Tutorials/WildThing/
---
So you have seen how to use various built in and custom slots.  You can accomplish a lot with that, but there is often a problem - these slots will capture only
certain specific values.  So, how do you capture a value that is NOT part of the "accepted" set of values?

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
prompt> npm install --save tui-wildthing
prompt> cp node_modules/tui-wildthing/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

The solution to being able to get the values from the user that are NOT part of the "accepted" set is to use a wildcard flag on the specific slot.
You would like an example of this use case? Sure - consider this line from the utterances.txt that you've already seen from previous tutorials:

{% highlight text %}
MyFirstNameIntent My first name is {FirstNameSlot}
{% endhighlight %}

You've seen it "at work".  Go ahead, test it:

{% highlight text %}
prompt> node index.js "my first name is bob"
{
  "name": "MyFirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "Bob"
    }
  }
}
{% endhighlight %}

As you can see, the first name matched.  That's because "Bob" is one of the names this slot type "knows" about.  Now try something similar but with an unusual name:

{% highlight text %}
prompt> node index.js "my first name is klaudia"
undefined
{% endhighlight %}

There is no match!  But what if the user's first name IS Klaudia?  Well, here is where wildcard matches come in.  You can modify your utterances.txt file to add
INCLUDE_WILDCARD_MATCH flag:

{% highlight text %}
MyFirstNameIntent My first name is {FirstNameSlot:INCLUDE_WILDCARD_MATCH}
{% endhighlight %}

Don't forget to rebuilt the recognizer.json file:

{% highlight text %}
prompt> node node_modules/vui-ad-hoc-alexa-recognizer/generator.js --sourcebase . --config config.json --intents intents.json --utterances utterances.txt
{% endhighlight %}

Now try the "missing" name again:

{% highlight text %}
prompt> node index.js "my first name is klaudia"
{
  "name": "MyFirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "klaudia"
    }
  }
}
{% endhighlight %}

It now works.  Just to double check, retry the "accepted" name again:

{% highlight text %}
prompt> node index.js "my first name is bob"
{
  "name": "MyFirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "Bob"
    }
  }
}
{% endhighlight %}

So, as you can see it still works as well.

But, not all is the same - in both cases we supplied all lower case inputs.  In the case of klaudia, klaudia was returned back.
But in the case of bob, Bob (notice the capitalization) was returned back.  That's because vui-ad-hoc-alexa-recognizer will go over
all provided values and return back the original capitalization, but only if it can find it.  Otherwise, it will return whatever
the user typed.

So, what slot types can you use wildcard matching with?  Many, but not all.  Basically, wherever it makes sense, vui-ad-hoc-alexa-recognizer
will let you use it, but where it doesn't it won't.  For instance, using wildcards with a numeric slot type does not make sense.  But with a
first name slot it does.  Some slots are more "gray area": US_STATE is a textual slot, but it does not allow wildcard matches since there is
a fixed and unchanging list.  On the other hand Corporation, Airline, Airport, and other similar large frequently changing sets do allow
wildcard matching.  Since the slot type list is changing often, I will not try to put these specifications here.  Instead, specific slot types
will be covered in their own documentation pages.  Custom slot types that are based on lists do allow wildcard matching.

When should you NOT use wildcard matching? Aside from the places where you are not allowed to, is any place that is likely to result in
false positive matches.
Here is an example. Imagine if you wanted to make it even easier for people to enter their first names.  So, you could add a line to your
utterances.txt to allow the user to speak just their first name and have it recognized even if it's not in the "accepted" list:

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
GreetingIntent {sup|what's up|what is up}
MyFirstNameIntent {FirstNameSlot:INCLUDE_WILDCARD_MATCH}
MyFirstNameIntent My first name is {FirstNameSlot:INCLUDE_WILDCARD_MATCH}
MyFirstNameIntent My first name is {FirstNameSlot} but people call me {NicknameSlot}
ZipCodeIntent {|the |my }{zip|zip code|postal code} {|is }{ZipCodeSlot}
ZipCodeIntent {ZipCodeSlot} is {my|the} {zip|zip code|postal code}
IceCreamFlavorIntent {my favorite|the best} ice cream {|flavor} is {IceCreamFlavorSlot}
CoffeeRoastStrengthIntent {I'd like |give me |I'll try |how about |}{your |}{CoffeeRoastStrengthSlot}{ please|}
{% endhighlight %}

Looks promising, right? So, you rebuild your recognizer.json and run the new test:

{% highlight text %}
prompt> node index.js "bob"
{
  "name": "MyFirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "Bob"
    }
  }
}
{% endhighlight %}

Success! **NOT SO FAST**
Now try a zip code utterance:

{% highlight text %}
node index.js "my zip code is 12345"
{
  "name": "MyFirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "my zip code is 12345"
    }
  }
}
{% endhighlight %}

What happened here?  Well, the new match on the first name wild card is evaluated first (more on the order of evaluation in a future tutorial).
But this match says "treat anything that the user says as the first name".  So, no matter what the user will say it will match.
This is NOT an error within vui-ad-hoc-alexa-recognizer, rather a programmer error trying to use this incorrectly.

What is the correct way to do this?  If you are going to use a single recognizer.json file, then you should use wildcards only within utterances with other
text to make sure that at least some other part of the utterance will make it match the desired one.  So, change your utterances.txt file to look like this:

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
GreetingIntent {sup|what's up|what is up}
MyFirstNameIntent {FirstNameSlot}
MyFirstNameIntent My first name is {FirstNameSlot:INCLUDE_WILDCARD_MATCH}
MyFirstNameIntent My first name is {FirstNameSlot} but people call me {NicknameSlot}
ZipCodeIntent {|the |my }{zip|zip code|postal code} {|is }{ZipCodeSlot}
ZipCodeIntent {ZipCodeSlot} is {my|the} {zip|zip code|postal code}
IceCreamFlavorIntent {my favorite|the best} ice cream {|flavor} is {IceCreamFlavorSlot}
CoffeeRoastStrengthIntent {I'd like |give me |I'll try |how about |}{your |}{CoffeeRoastStrengthSlot}{ please|}
{% endhighlight %}

Now you will have something very close to the desired case:
* if the user says "bob" (or "john" or any other typical first name) it will be recognized
* if the user says "my first name is klaudia" (or any other name, typical or not) it will be recognized
* if the user says other utterances, such as zip code ones, they will still match.

This doesn't solve the problem of saying JUST the unusual first name and have it recognized, but there are techniques you can use for that case too, more on them in later tutorials.
