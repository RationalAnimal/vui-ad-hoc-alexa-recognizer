---
layout: page
title: Great Intrinsic Value 
permalink: /Tutorials/GreatIntrinsicValue/
---

So you've come up with lots of ways to let the user say... well... "Hello".  That's nice as far as toy applications go, but you want more.  You want the user
to tell you something important, something of value!

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
prompt> npm install --save tui-greatintrinsicvalue
prompt> cp node_modules/tui-greatintrinsicvalue/* .
{% endhighlight %}

So, how does a user tell you something of value?  Or more precisely tell you A value?  By using an utterance that contains a slot (or, as some call it, an entity).
You've already had a glimpse of the slots before - in the intents.json file.  There is a field there called slots with a value of an array.  But so far that array has
been empty.  This is where you would add slots.  After they are added to intents.json you would also add them to utterances.txt by adding utterances that use them.

Now then, let's see this in action.  You may want the user to tell you his name after he has greeted you and you've responded.  So, in addition to all the "hello"s
you would like to be able to understand when he tells you his name.  Specifically, if the user says "My name is Bob" we want to understand that the user is trying to
communicate his first name and that his name is "Bob".

Let's updated the intents.json first to include that intent:
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
        }
      ]
    }
  ]
}
{% endhighlight %}

So, what is this?  We've defined a second intent - MyFirstNameIntent - and it has a "slot" (aka entity) named FirstNameSlot, apparently of "type" TRANSCEND.US_FIRST_NAME.
A slot type is like a variable type - it specifies what type of value the slot can accept.  This particular type specifies a first name common in the USA.  Where did this
type come from?  It's a "built-in" type.  You can recognize built-in types because they begin with "TRANSCEND." or "AMAZON."
Note that for compatibility and historical reasons you can also specify the slot type as "AMAZON.US_FIRST_NAME".  This is true for any built in slot types that exist in both Amazon slot type list and Transcend slot type list.
For a complete up to date list of currently supported built-in slot types please see README.md file that is distributed with vui-ad-hoc-alexa-recognizer.

A slot name (not to be confused with the slot type) is arbitrary and string and the programmer can pick a name he likes.  If you are using vui-ad-hoc-alexa-recognizer for work that also
crosses over to Alexa, Lex, or other voice/chat related services then you should probably use the names that won't conflict with those used by such services.

Now that we have this intent has been added we need to use it in an utterance, so let's update the utterances.txt:

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
GreetingIntent {sup|what's up|what is up}
MyFirstNameIntent My first name is {FirstNameSlot}
{% endhighlight %}

What we have done here is say that when the user says "My first name is Bob" (or ...Mike or ...Jim) this utterance will be mapped to the MyFirstNameIntent and the value Bob (or Mike or Jim) will be mapped to the FirstNameSlot.
Let's try this:
{% highlight shell %}
prompt> npm index.js "My first name is Bob"
{% endhighlight %}

you will get:

{% highlight json %}
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

As you can see, slots are specified in utterances very similarly to the option lists - by surrounding slot name with a set of curly brackets.

You can have more than one slot per intent.  You can even have more than one slot of the same type per intent.  Let's see how we can do it.
Imagine that you want the person to tell you his nickname, if he has one.  He may say something like this:

{% highlight text %}
My first name is John but people call me Jack
{% endhighlight %}

To make that work we need to update intents.json and utterances.txt
First, update the intents.json thusly:

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
    }
  ]
}
{% endhighlight %}

So now the MyFirstNameIntent has two slots, both of type TRANSCEND.US_FIRST_NAME.  Continuing onto utterances.txt:

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
GreetingIntent {sup|what's up|what is up}
MyFirstNameIntent My first name is {FirstNameSlot}
MyFirstNameIntent My first name is {FirstNameSlot} but people call me {NicknameSlot}
{% endhighlight %}

Now (after you go  again through the steps of generating the new recognizer.json file) when you enter:

{% highlight shell %}
prompt> npm index.js "my first name is john but people call me jack"
{% endhighlight %}

you will see:

{% highlight json %}
{
  "name": "MyFirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "John"
    },
    "NicknameSlot": {
      "name": "NicknameSlot",
      "value": "Jack"
    }
  }
}
{% endhighlight %}

Since you have NOT removed the original utterance that only had one slot in it, it will continue to work.  Test it
by entering:

{% highlight shell %}
prompt> npm index.js "my first name is john"
{% endhighlight %}

just as before you will see:

{% highlight json %}
{
  "name": "MyFirstNameIntent",
  "slots": {
    "FirstNameSlot": {
      "name": "FirstNameSlot",
      "value": "John"
    }
  }
}
{% endhighlight %}

