---
layout: page
title: Count on it 
permalink: /Tutorials/CountOnIt/
---
You've seen how to recognize a common first name (common to USA) in user's input and even built a small talk utility to chat with the user and respond to his name.
But that is hardly the most common thing the user might tell you.  What is? Well, a number or a count or a series of numbers, of course.

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
prompt> npm install --save tui-countonit
prompt> cp node_modules/tui-countonit/* .
{% endhighlight %}

If you decide not to install the tutorial module then don't forget to install vui-ad-hoc-alexa-recognizer:
{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

You get the numeric values from the user primarily using the built in NUMBER slot type (i.e. AMAZON.NUMBER or TRANSCEND.NUMBER).
Before we dive right into using this slot type, it's important to understand what is considered a number by vui-ad-hoc-alexa-recognizer.
A number in vui-ad-hoc-alexa-recognizer is NOT what you would strictly consider a number in Mathematics.  A number, instead, is any continuous
numeric or count input.  For instance "one two three" is considered a single number, rather than three separate consecutive numbers.
There is a reason to this madness.  And that reason is that in chat bots and especially voice services the users will often either spell
out a whole number digit by digit or by a group of digits.  For example, if you zip code is "12345" do you say
"my zip code is twelve thousand three hundred forty five"? No, you don't.  You say "my zip code is one two three four five".
Or for a phone number, if your phone number is "(123) 456-7890" you might say "my phone number is one two three four fifty six seventy eight ninety".
So, vui-ad-hoc-alexa-recognizer will do its best to string these together to form a single number.
It will also properly parse "proper" numbers, e.g. if the user says "one million five hundred thirty thousand eleven" vui-ad-hoc-alexa-recognizer
will return "1530011".  Furthermore, since the text may be produced by all sorts of sources, both words and numbers will be accepted.
Thus "my zip code is zero 1 2 thirty five" will produce 01235".  Also, both ordinal and cardinal numbers will be accepted.  Thus "second" and "two" will
both evaluate to 2.

Now, let's add a few intents that can understand numbers.  A zip code intent might be just a perfect first example. So, let's update the intents.json:

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
    }
  ]
}
{% endhighlight %}

and the updated utterances.txt file:

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
GreetingIntent {sup|what's up|what is up}
MyFirstNameIntent My first name is {FirstNameSlot}
MyFirstNameIntent My first name is {FirstNameSlot} but people call me {NicknameSlot}
ZipCodeIntent {|the |my }{zip|zip code|postal code} {|is }{ZipCodeSlot}
ZipCodeIntent {ZipCodeSlot} is {my|the} {zip|zip code|postal code}
{% endhighlight %}

This is NOT the whole story - you now need to ensure that the number you get makes sense.  If the user says "my zip code is 1" you have to reject this,
as well as rejecting "my zip code is 123456789".  And you need to give the user feedback about the error.  So, let's update the talk.js to
validate, store, and use zip codes:

{% highlight text %}
case "ZipCodeIntent":
  if(result.slots.ZipCodeSlot.value.length === 5){
    state.zipCode = result.slots.ZipCodeSlot.value;
    console.log("You said your zip code is " + result.slots.ZipCodeSlot.value);
  }
  else if(result.slots.ZipCodeSlot.value.length < 5){
    console.log("That can't be your zip code, it's too short");
  }
  else {
    console.log("That can't be right, it's too long");
  }
  break;
{% endhighlight %}

Now, when you run the talk.js you'll see this:

{% highlight text %}
prompt> node talk.js 
Please type something: my zip code is 2
That can't be your zip code, it's too short
Please type something: my zip code is 12345
You said your zip code is 12345
Please type something: my zip code is 1234556
That can't be right, it's too long
{% endhighlight %}
