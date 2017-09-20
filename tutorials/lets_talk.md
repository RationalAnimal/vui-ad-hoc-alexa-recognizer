---
layout: page
title: Let's talk 
permalink: /Tutorials/LetsTalk/
---

You've gotten to a pretty good spot so far - you have been able to generate a recognizer.json file that has multiple intents with many utterances, you can accept user input and
display it.  But your app isn't "real" - it's "programmer real".  You are printing out values showing that you are doing the right thing, but you don't actually have a chat bot.
So, let's proceed and make something that can "talk" with the user.

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
prompt> npm install --save tui-letstalk
prompt> cp node_modules/tui-letstalk/* .
{% endhighlight %}

So, what is it that you need to actually do?  Very little extra, as it turns out.  All you have to do is decide how to respond to the parsed intent/slot information.
Let's say that every time the user greets your bot (i.e. says something that maps to the GreetingIntent) the bot will respond with "Hello to you too".
Further more every time the user will say something that maps to MyFirstNameIntent, the bot with respond with "Hi <first name>".
And if the bot fails to parse the user input then it will respond with "Sorry, I didn't understand you.  Please try again"
This app should not stop after a single response, but should continue chatting with the user until he exits.

Let's create our app - we'll keep the existing index.js in case we want to verify our parsing works, and add the new talk.js file.  
At the beginning we'll have the usual:

{% highlight javascript %}
'use strict'
let vui = require("vui-ad-hoc-alexa-recognizer");
{% endhighlight %}

Now we need a way to read user input:

{% highlight javascript %}
// Needed to read user input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
{% endhighlight %}

Now we are ready for the actual "chat botty" portion.  We'll put it into a recursive function so that we can keep calling it
(not something you'll do in production but good for a tutorial demonstration):

{% highlight javascript %}
let recursiveUserInput = function (){
  rl.question('Please type something: ', function (answer) {
    let result = vui.Recognizer.matchText(answer);
    if(typeof result === "undefined"){
      console.log("Sorry, I didn't understand you.  Please try again");
    }
    else {
      switch(result.name){
      case "GreetingIntent":
        console.log("Hello to you too");
        break;
      case "MyFirstNameIntent":
        console.log("Hi " + result.slots.FirstNameSlot.value);
        break;
      default:
        console.log("Sorry, my programmer forgot to code this response");
      }
    }
    recursiveUserInput(); //Calling this function again to ask new question
  });
};
{% endhighlight %}

First, we ask the user to "Please type something" and get whatever he's typed in.
Then - and this is the simple part - we branch on the parsed out intent.
We test for "undefined" in case there was no match and if so respond with "Sorry, I didn't understand you.  Please try again".
Otherwise it's a simple switch/case statement.  For each intent that we want to handle we have a "case".


{% highlight shell %}
prompt> node talk.js
Please type something: hi there
Hello to you too
Please type something: My first name is John
Hi John
Please type something: 
{% endhighlight %}

So now you have a functioning little chat bot.  But let's add a little more to it to make it real.
Let's remember what the user said to us and use it when responding to the user later.
We'll also have a "safe word" to exit our bot - "EXIT".  Here is the complete updated talk.js:

{% highlight javascript %}
'use strict'

// Object that will keep track of values we've learned from the user
let state = {};

let vui = require("vui-ad-hoc-alexa-recognizer");

// Needed to read user input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let recursiveUserInput = function (){
  rl.question('Please type something: ', function (answer) {
    if (answer === 'EXIT'){
      return rl.close();
    }
    let result = vui.Recognizer.matchText(answer);
    if(typeof result === "undefined"){
      console.log("Sorry, I didn't understand you.  Please try again");
    }
    else {
      switch(result.name){
      case "GreetingIntent":
        if(typeof state.nickname !== "undefined"){
          console.log("Hello to you too " + state.nickname);
        }
        else if(typeof state.firstName !== "undefined"){
          console.log("Hello to you too " + state.firstName);
        }
        else {
          console.log("Hello to you too");
        }
        break;
      case "MyFirstNameIntent":
        state.firstName = result.slots.FirstNameSlot.value;
        if(typeof result.slots.NicknameSlot !== "undefined"){
          state.nickname = result.slots.NicknameSlot.value;
          console.log("Hi " + result.slots.FirstNameSlot.value + ", aka " + result.slots.NicknameSlot.value);
        }
        else {
          console.log("Hi " + result.slots.FirstNameSlot.value);
        }
        break;
      default:
        console.log("Sorry, my programmer forgot to code this response");
      }
    }
    recursiveUserInput(); //Calling this function again to ask new question
  });
};

recursiveUserInput();
{% endhighlight %}

Let's run it again:

{% highlight shell %}
prompt> node talk.js 
Please type something: hi there
Hello to you too
Please type something: My first name is John
Hi John
Please type something: hi there
Hello to you too John
Please type something: My first name is John but people call me Jack
Hi John, aka Jack
Please type something: hi there
Hello to you too Jack
Please type something: EXIT
{% endhighlight %}

At the beginning things didn't change.  But now, when the user typed "hi there" the second time (after giving his name) the bot's response is "Hello to you too John".
The bot remembered the user's name and used it in a later response!
And the third time the response was "Hello to you too Jack" (after the user gave his nickname as Jack).

So, the overall logic that is common to pretty much all chat bots is:
1. Get user input and parse it
2. Do something (e.g. update the state) based on the parsed intent, slot values, and state values
3. Respond back to the user with something based on - you guessed it - intent, slot values, and state values
4. *REPEAT*

