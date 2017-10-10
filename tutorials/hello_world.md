---
layout: page
title: Hello World
permalink: /Tutorials/HelloWorld/
---

In the grand tradition of creating a "Hello World" application, we will show here how to do so with the vui-ad-hoc-alexa-recognizer.

First, you will need to make sure that you have Node.js and npm installed. Execute node -v and npm -v commands to confirm:

{% highlight shell %}
prompt> node -v
v6.9.4
prompt> npm -v
3.10.10
{% endhighlight %}

Now, create a directory for your "Hello World" project and cd to it.  Then run npm init command, accepting the defaults (you can change them later):

{% highlight shell %}
prompt> npm init
{% endhighlight %}

you can now see a package.json file in your directory that will have content similar to this:

{% highlight json %}
{
  "name": "helloworld",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Ilya Shubentsov (https://github.com/RationalAnimal)",
  "license": "ISC"
}
{% endhighlight %}

Now you need to add vui-ad-hoc-alexa-recognizer to your project:

{% highlight shell %}
prompt> npm install --save vui-ad-hoc-alexa-recognizer
{% endhighlight %}

Take a look at your package.json file.  It should now have an extra section in it, referencing vui-ad-hoc-alexa-recognizer:

{% highlight json %}
{
  "name": "helloworld",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Ilya Shubentsov (https://github.com/RationalAnimal)",
  "license": "ISC",
  "dependencies": {
    "vui-ad-hoc-alexa-recognizer": "^1.0.494"
  }
}
{% endhighlight %}

You are now ready to "write your code".  I put quotes around "write your code" because you'll really only be configuring vui-ad-hoc-alexa-recognizer to do its work.
You will need 3 files: configuration file, file containing intents, and file containing utterances.  Let's call them config.json, intents.json, and utterances.txt.
What are these files? Well, to understand that you'll need to understand how most voice skill/chat bot systems work.  What they do is parse input text into
user "intents" and some values (depending on the system they may be called slots or entities or something else).

Intents are designations for what the user wants to do/accomplish/say/communicate/ask... For example, if the user says "Hi, how are you?" the user's intent is to greet you.
Intents are programmer defined (but there are also some built in intents, but more about it later).
Meaning, YOU define what the intents are.  You also define which slots/entities are used with each intent.
So, for our example of "Hi, how are you?" we may want to have an intent called GreetingIntent.
Let's create the intents.json file containing this text:

{% highlight json %}
{
  "intents": [
    {
      "intent": "GreetingIntent",
      "slots": []
    }
  ]
}
{% endhighlight %}

All that this file says is that there is only one intent, its name is GreetingIntent and it has no slots (entities).

We now need to add utterances.  What are utterances you say?  Well, it's simply text that will trigger a particular intent.
In our example the utterance is "Hi, how are you?"
Let's create the utterances.txt file containing this text:

{% highlight text %}
GreetingIntent Hi, how are you
{% endhighlight %}

Notice that this is a simple text file where each line simply has the name of an intent at the beginning of the line, then a white space, then
the utterance.

Now we can attempt to generate a recognizer file.  What's a recognizer file you ask? Well, let's step back.
The way vui-ad-hoc-alexa-recognizer works is a two step process.

* First, you create a recognizer.json file that contains all the information
needed to match user's text to an intent (and possibly slots).
* Second, you use the recognizer.json file to actually match the text and get parsed intent and slot values

Back to generating the recognizer.json file.  We'll cd into the node_modules/vui-ad-hoc-alexa-recognizer directory where
the various utilities are located and run the generator utility:

{% highlight shell %}
prompt> cd node_modules/vui-ad-hoc-alexa-recognizer/
prompt> node generator.js --intents ../../intents.json --utterances ../../utterances.txt
{% endhighlight %}

You should see a fairly long json output and at the end of it a message "Was saved to recognizer.json"
That's it - your recognizer.json file was generated.

Now for the second step - matching user text.  Instead of writing your own program (which is quite easy, but let's leave that for another tutorial)
we will user matcher utility:

{% highlight shell %}
prompt> node matcher.js "Hi, how are you"
{% endhighlight %}

You should see this output:

{% highlight json %}
{
  "name": "GreetingIntent",
  "slots": {}
}
{% endhighlight %}

Yep, that's all there is to it - the result is a json object with the name of the matched intent and slots (if any).

Just for laughs and giggles, type something different:
{% highlight shell %}
prompt> node matcher.js "Blah blah blah"
{% endhighlight %}

You should see this output:

{% highlight text %}
undefined
{% endhighlight %}

So, when you try to match on an utterance that you have not configured for then there will be no match.
You might think that this is quite limiting - you have to provide all the possible matches.  Don't worry, vui-ad-hoc-alexa-recognizer
makes this easy with all sorts of features.

If you list the directory, you will see recognizer.json file - this is the file that you will need to parse the intents that you've configured.
By default it's named recognizer.json, but you can rename it to any other file name with a json extension when you'll use it in your code.

That's it for "Hello World" example... "But wait" you say, what about the config.json file? Well, technically you don't have to have it
if your configuration is quite simple, as it is in this example.  We will touch on it in a future tutorial.
