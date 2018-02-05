---
layout: page
title: Better Way of Building Better Chatbots
permalink: /Articles/BetterWayOfBuildingBetterChatbots/
---
*February 3, 2018*

We are at an exciting point in voice/chat/phone service evolution.  It is no longer enough to simply build one.
In fact, the ability to build a production quality, reliable chatbot is now taken for granted, it has become "table stakes".

The focus now is on creating better chatbot. So, what is a "better" chatbot?  Without getting bogged down in definitions
it is the one that gives a better experience to the user.  It's that simple.  Having said that, here are some specific
things we can include in a list of features/qualities of a good chat bot (from the users perspective):

- gets to the answer/information the user wants quickly
- minimizes user confusion
- minimizes chatbot confusion
- allows easy corrections of user requests
- able to understand most common ways of accepting relevant user input
- able to transition to a human operator and know when it's time to do so
- knows the particular user and is able to customize the conversation for that user

So, how do you go about building these better chatbot? 
Admitting that you have a problem is the first step to correcting it.
And the current way (circa early 2018) of creating chatbots is quite problematic.
It typically involves primarily programmer activities, or at least activities that seem to be targeting programmers.
Typically, the initial conversation model will come from the business, will be presented in some sort of a flow chart diagram with copious notes.
This "work product" will then be handed over to developers, who will start by
defining and entering into various services voluminous sets of utterances, intents, entities/slot type, dialog models with their data to be collected...
Then writing code to handle the various conversation flows, testing the chatbot, fixing issues/adjusting conversation flows, then releasing the chatbot.

Almost everything about this process is, well.. very "water fall"-y, very 20th century.
It's not agile from either the business or development or the testing perspectives.
Most importantly **IT DOES NOT LEND ITSELF WELL TO RAPID INCREMENTAL IMPROVEMENTS**.
At best, the "improvements" will consist of manual edits to the utterances and prompts and possibly tweaking of "form entry-like intents/dialogs".
This problem is further compounded by the fact that people will naturally expect these conversational tools to become bigger and more encompassing.

So, now we are ready to discuss the solution, and there are two parts to it: **IMPROVING CHATBOTS** and **IMPROVING THE PROCESS OF BUILDING AND IMPROVING CHATBOTS**.
Actually, I lied, there is also a third part to it: **FOUNDATIONAL PREREQUISITES** for the first two.

# Improving Chatbots

There are multiple approaches to this and all of them should be utilized.

The first one is to describe the model of the conversation in a much more flexible way.
Writing prose or old style flow chart diagrams makes it hard to visualize the conversation.
It also makes it hard to make changes to it and to communicate that from product owners to developers.
Fortunately, we are in luck.  There is a much better way of describing the conversation - a state transition
diagram:

*insert a sample representative diagram here*

In simple terms, a state transition diagram is a connected graph.
The nodes represent a state in the conversation.
The arrows connect the start and end states. They also represent the triggers (i.e. utterances) and the actions (side effects and responses) that are associated with the transition from the starting to the end state.

A state transition diagram has many benefits:

* it actually models the conversation extremely well
* it allows the conversation to be viewed at any level of detail (zooming in to see more details, zooming out to see fewer)
* it allows visualizing almost immediately many typical problems within the defined conversational flow (e.g. not being able to get to some some state or going to the wrong state)
* it maps so well to the BDD (behavior driven development) that you could generate BDD scenarios automatically from a state transition diagram and vice versa.  That's because each BDD scenario simply describes the starting state (Given...), the trigger (When...), and the actions/responses and the end state (Then...).  In effect each BDD scenario is simply a slice of the entire state transition diagram.  But unlike BDDs, a state transition diagram is **complete** (or if it's not, then it's obvious that it's not).
* it allows for easy improvements (more about it in the section on improving the process of building a chatbot)
* it allows for composition of multiple conversations into a much bigger whole in a relatively easy way

The second approach to improving the chatbots is by using various machine learning and data mining tools to improve NLP/NLU (natural language processing/understanding).
Here are several things we can do:

* mining the historical conversational data to attempt to automatically determine the most common ways the users try to communicate what they want. This is in part the "utterance" mining and in part conversation flow mining.  Seeing utterances that are not being recognized isn't just a way to add a few more utterances.  It's also something that can point our a bad conversational flow where the user is attempting to ask for something the conversation wasn't designed for.
* building extensive data sets of synonyms and text equivalents based on existing sources as well as mining of the conversational data.  This also improves the utterance understanding

The third approach to improving the chatbots is to use sentiment analysis.  There are several parts to it:

* ability to change the conversational flow based on the sentiment of the user
* ability to mine the sentiment from the conversational data to detect flaws in the conversation flow
* ability to hand the conversation over to a human (if applicable) based on the user sentiment
* ability to do all of the above based not only on the "happiness" aspect of the sentiment, but also any number of other aspects, such as "confusion", "level of interest", etc

The forth approach to improving the chatbots is making the conversation specific to the user.
Amongst other things this means:

* keeping track of the previous conversations to provide different responses/actions
* using information available through other channels to improve the conversation (any from information availabe in the user's account to data minable from elsewhere *may* be a source for this, but be careful not to be creepy)

The fifth and last major approach to improving the chatbots that I will discuss here is conversation composition.
Currently most chatbot are "siloed" - a small chatbot is designed by one group and then slowly expanded to include more functionality.
The problem is that many such groups are designing these chatbots (i.e. conversation) with no easy path to combine them.
There are two things that are needed to solve this:

* using the "state transition model" so that connecting two conversations is no more difficult than connecting two parts of the same conversation
* designing the conversation state properly.  The primary concern will be to ensure that the conversation state that is common to multiple conversation is shared
and the state that is not common is not shared.  By sharing I mean not only accessibility but common and standard structure.

# Improving the Process of Building and Improving Chatbots

Now that we've seen some of the main ways to improve a particular chatbot (meaning improve the conversation the user can have with it) let's talk about how we should go about
achieving these improvements.
The best way to do so is to change the process.  Here are several steps to it:

* the most important change is to **EMPOWER THE PRODUCT OWNERS** to design and incrementally improve the conversational flow.  This means the product owners should be able to design
the conversational model using tool(s) that can represent it as a state transion flow and enter whatever level of information they choose to enter into it.
* **product owners should be able to modify the conversation and test the change on the fly in real time as well as create multiple versions of the conversation for focus group testing, A/B deployments, etc.**
* another change is to make sure that the same tool(s) will also be usable by developers so that the changes made by the product owners feed directly into the chatbot code/service/etc.  It also means that developers can add both technical details to the same model as well as update/modify/complete the information entered by the product owners.
* yet another change is to make sure that testing (both human and automated) is driven by this model.  This means that automated tests (BDD, UAT, unit tests) can be generated from the model.  It also means that human testers can test specific subflows and be able to pause/resume/retest any path or any subflow.
* the conversational model should also be able to accept changes from various automated and semiautomated processes.  This refers to the ability to accept (with or without human intervention) improvements to the model from data mining, machine learning, and customer information mining described in the previous section.  This should be possible at
any stage - development, testing, or production.

# Foundational Prerequisites

Well, if the discussion so far have seemed like a "wish list" - it's not meant to be.
The "Improving Chatbots" are specific prescriptions that are either already being used or soon will be.
The "Improving the Process of Building and Improving Chatbots" seems to call for a magical tool, except that
there is nothing magical nor particularly difficult about such a tool.  To my knowledge it does not yet
exist, though I am in the process of writing one myself for my own needs.  If you are aware of one, please let me know.
Other teams should be able to write one in house in a reasonable amount of time if one isn't available yet when they need one.

However, such a tool aside, there has to be foundational support for it.  And that is that the code base
for implementing the actual conversation at run time has to be configuration based.
Meaning that whatever your engine is, it must as much as possible **BE BASED ON CONFIGURATION** rather than writing code.
Otherwise you will be in the business of creating a tool that writes code and that is a Pandora's box that simply does not need to be opened here.

Now, many people will use commercially available services for implementing their chatbots and voice services (e.g. Lex, Alexa, Microsoft Chatbot Framework/Luis, API.ai, etc).
To some extent they are already configuration based - you load the interaction model and some other configuration into them and they take care of most of the processing.
Usually leaving only fulfillment API calls to be handled in code.
In those use cases where such services is all that you use, you are all set.
All you need to do is create an export module to extract the needed configuration for each target platform (or platform combination, such as Lex with Facebook front end).
Having your conversation defined using a "state transition model" will make exporting to different platforms much faster and easier.

However, we are moving into a more interconnected world that sometimes may be "disconnected".  This means that your customers should be able to have a chat with your chatbot or voice service not only on your web site, but on their mobile (even if the connection is slow or intermittent or even off) and within other various devices, including IoT.
Having all these channels rely on an "always on" backend service that may be slow or unavailable is not a good customer experience.
Additionally, many problems are more properly handled on customer devices. Examples of this include:
* informational chats that don't require real time backend data access
* conversations where the customer may not want your company/institution to know the question they are asking.  You can tell them that their questions never leave the mobile phone and are answered from the device-local database.
* conversation where backend access isn't needed and may be asked by a lot of customers.  Even the largest companies have to pay something for each call.  If this chatbot "engine" is built into the app (as an example) then all parts of the conversation that don't need to call the service such as Lex can be handled locally on the device.  Multiply this by lots of conversations by lots of users and you are talking real savings here.

So, sooner or later you will find yourself using embeddable conversation code.
The important part is that such code must also be **configuration based**.
If it's not, you will have a hard time converting your beatiful conversation design into running code.