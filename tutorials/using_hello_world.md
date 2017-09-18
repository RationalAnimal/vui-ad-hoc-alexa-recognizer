---
layout: page
title: Using Hello World with a Custom Script 
permalink: /Tutorials/UsingHelloWorld/
---

Now that you have seen how to create a simple "Hello World" recognizer.json file and use it with the provided matcher utility, let's see how it can be used in the code.
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
prompt> npm install --save tui-usinghelloworld
prompt> cp node_modules/tui-usinghelloworld/* .
{% endhighlight %}

As the documentation for vui-ad-hoc-alexa-recognizer states you only need to 2 lines of code to use it.  So, let's see how it's done.
First, load the module:

{% highlight javascript %}
// Load the vui-ad-hoc-alexa-recognizer so that we can use it
let vui = require('vui-ad-hoc-alexa-recognizer');
{% endhighlight %}

Second, load the recognizer.json file:

{% highlight javascript %}
// Now load and parse the recognizer.json file
let recognizer = require('./recognizer.json');
{% endhighlight %}

Third, use it:
{% highlight javascript %}
// Now make the actual call to match the text to intent 
let result = vui.Recognizer.matchText(stringToMatch, undefined, undefined, recognizer);
{% endhighlight %}

"Wait" you say - I am not stupid, that's 3 lines of code! Well, you are right - the second part (loading the recognizer.json file) is optional.
If this file is placed in the vui-ad-hoc-alexa-recognizer module's directory and it's named recognizer.json then vui-ad-hoc-alexa-recognizer will load it by default
and you won't need to provide it as an argument to matchText() call.
I simply showed you how to load it explicitly, using its path.

So, now let's add a few niceties, such as parsing out the arguments:
{% highlight javascript %}
// Call this function to display instructions on the console on how to call index.js
// This isn't necessary, but a nice touch to have in case you come back to it and forget
// how to use it.
let usage = function(){
  console.log('Usage: node ' + process.argv[1] + ' "string to match"');
}

// Simple error checking - make sure we got all the arguments on the command line.
if (process.argv.length < 3) {
  usage();
  process.exit(1);
}
// Get the actual string that we should be matching
let stringToMatch = process.argv[2];
{% endhighlight %}

And finally, let's log the result:
{% highlight javascript %}
// Finally, print the result out to console and exit
console.log(JSON.stringify(result, null, 2));
{% endhighlight %}

Putting it all together you should have this index.js file:
{% highlight javascript %}
'use strict'
// Load the vui-ad-hoc-alexa-recognizer so that we can use it
let vui = require('vui-ad-hoc-alexa-recognizer');

// Call this function to display instructions on the console on how to call index.js
// This isn't necessary, but a nice touch to have in case you come back to it and forget
// how to use it.
let usage = function(){
  console.log('Usage: node ' + process.argv[1] + ' "string to match"');
}

// Simple error checking - make sure we got all the arguments on the command line.
if (process.argv.length < 3) {
  usage();
  process.exit(1);
}
// Get the actual string that we should be matching
let stringToMatch = process.argv[2];

// Now load and parse the recognizer.json file
let recognizer = require('./recognizer.json');


// Now make the actual call to match the text to intent 
let result = vui.Recognizer.matchText(stringToMatch, undefined, undefined, recognizer);

// Finally, print the result out to console and exit
console.log(JSON.stringify(result, null, 2));
{% endhighlight %}

Now, let's test it:
{% highlight shell %}
prompt> node index.js "Hi, how are you?"
{
  "name": "GreetingIntent",
  "slots": {}
}
prompt> node index.js "Hi, blah blah blah"
undefined
{% endhighlight %}

And there you have it - a simple script that uses a recognizer file.


