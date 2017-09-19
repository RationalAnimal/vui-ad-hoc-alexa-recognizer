---
layout: page
title: You Have Options... Option Lists, that is 
permalink: /Tutorials/YouHaveOptions/
---

Now that you have created and used in your own code a simple "Hello World" recognizer.json file you are ready to enhance it.
As in the previous tutorials, ensure that you have node and npm installed, create a new directory and initialize npm project there (accepting default values):
{% highlight shell %}
prompt> node -v
v6.9.4
prompt> npm -v
3.10.10
prompt> npm init
{% endhighlight %}

Note: if you don't want to type in all the source code, you don't have to.  This tutorial is available as an npm module.  Simply load the module, then copy all the files to your current directory:

{% highlight shell %}
prompt> npm install --save tui-youhaveoptions
prompt> cp node_modules/tui-usinghelloworld/* .
{% endhighlight %}

When you created the Hello World recognizer.json file, it only contained a single utterance that it could understand. Wouldn't it be nice if all sorts of greetings
could be understood and mapped to the GreetingIntent?  That's easy to do, you can simply add more lines, like these to the utterances.txt file:

{% highlight text %}
GreetingIntent Hello
GreetingIntent Hi there
GreetingIntent Hello, how are you
GreetingIntent Hi there, how are you
{% endhighlight %}

and so on.  While this would work, it's hardly elegant.  It requires you to keep adding every possible permutation of simple greetings.
Luckily for you, vui-ad-hoc-alexa-recognizer gives you an ability to specify many variations at once.  This feature is called option lists.
In the usual spirit of simplicity, it's rather easy and intuitive to use.  Let's say that you wanted to replace the above 4 utterance with just
one that uses option lists.  We'll do it in two steps.  First, we'll create a simple utterance that comibines these two into one:

{% highlight text %}
GreetingIntent Hello
GreetingIntent Hi there
{% endhighlight %}

now becomes:

{% highlight text %}
GreetingIntent {Hello|Hi there}
{% endhighlight %}

What the funny curly bracket expression means is "any of the individual strings separated by \| will match".

Now, let's replace all 4 of the utterances with just a single one using 2 separate option lists:

{% highlight text %}
GreetingIntent {Hello|Hi there}{|, how are you}
{% endhighlight %}

The second set of curly brackets looks a little funny - it still has a "\|" in it but there is only one string inside - ", how are you".
This is intentional.  What that means is that this string is optional - if it's not in the text being matched, the match will not fail because this string isn't there.
Go ahead and try it. Assuming you've downloaded the tui-youhaveoptions tutorial source (or kept you index.js from the privious tutorials), let's test it:

{% highlight shell %}
prompt> node index.js "Hi there, how are you?"
{
  "name": "GreetingIntent",
  "slots": {}
}
prompt> node index.js "Hi there"
{
  "name": "GreetingIntent",
  "slots": {}
}
prompt> node index.js "Hi, blah blah blah"
undefined
{% endhighlight %}

So, how many variations will a single utterance with option lists match?  It's easy to compute - simply multiply the number of options within each list (counting the empty options) by
the number of options in each other option list.  So, here we have 2 * 2 = 4, exactly as designed.  How about this utterance (found in the tutorial source):

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
{% endhighlight %}

The answer is 8 * 2 * 3 = 48.  Now, that's an efficient way to generate utterances.  Here is a list of utterances that you would have had to enter by hand to create
equivalent matches:

{% highlight text %}
GreetingIntent Hi, 
GreetingIntent Hi, how are you
GreetingIntent Hi, how are you doing
GreetingIntent Hi 
GreetingIntent Hi how are you
GreetingIntent Hi how are you doing
GreetingIntent hello, 
GreetingIntent hello, how are you
GreetingIntent hello, how are you doing
GreetingIntent hello 
GreetingIntent hello how are you
GreetingIntent hello how are you doing
GreetingIntent hey, 
GreetingIntent hey, how are you
GreetingIntent hey, how are you doing
GreetingIntent hey 
GreetingIntent hey how are you
GreetingIntent hey how are you doing
GreetingIntent hi there, 
GreetingIntent hi there, how are you
GreetingIntent hi there, how are you doing
GreetingIntent hi there 
GreetingIntent hi there how are you
GreetingIntent hi there how are you doing
GreetingIntent good morning, 
GreetingIntent good morning, how are you
GreetingIntent good morning, how are you doing
GreetingIntent good morning 
GreetingIntent good morning how are you
GreetingIntent good morning how are you doing
GreetingIntent good evening, 
GreetingIntent good evening, how are you
GreetingIntent good evening, how are you doing
GreetingIntent good evening 
GreetingIntent good evening how are you
GreetingIntent good evening how are you doing
GreetingIntent good afternoon, 
GreetingIntent good afternoon, how are you
GreetingIntent good afternoon, how are you doing
GreetingIntent good afternoon 
GreetingIntent good afternoon how are you
GreetingIntent good afternoon how are you doing
GreetingIntent good day, 
GreetingIntent good day, how are you
GreetingIntent good day, how are you doing
GreetingIntent good day 
GreetingIntent good day how are you
GreetingIntent good day how are you doing
{% endhighlight %}

Btw, vui-ad-hoc-alexa-recognizer DOES NOT generate these unfolded lists internally - it's more intelligent than that and simply matches on a single utterance with "variations".
This is important for performance reasons - matching on a single utterance with variations is faster than matching on many separate utterances.

Of course, if you have completely unrelated utterances, there is no need to try to get them into a single one using option lists.  You can still list multiple ones on separate lines:

{% highlight text %}
GreetingIntent {Hi|hello|hey|hi there|good morning|good evening|good afternoon|good day}{,|} {|how are you|how are you doing}
GreetingIntent {sup|what's up|what is up}
{% endhighlight %}
