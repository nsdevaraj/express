exports.handler = async (event) => { 
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

     

     if (event.session.application.applicationId !== "amzn1.ask.skill.3ee38daf-527d-494a-8cda-b809c5b151ae") {
         return "Invalid Application ID";
     }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, 
						event.session, 
						function callback(sessionAttributes, speechletResponse) {
							context.succeed(buildResponse(sessionAttributes, speechletResponse));
						});
            context.succeed();
        }
    } catch (e) {
        return "Exception: " + e;
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId); 
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // handle yes/no intent after the user has been prompted
    if (session.attributes && session.attributes.userPromptedToContinue) {
        delete session.attributes.userPromptedToContinue;
        if ("AMAZON.NoIntent" === intentName) {
            handleFinishSessionRequest(intent, session, callback);
        } else if ("AMAZON.YesIntent" === intentName) {
            handleRepeatRequest(intent, session, callback);
        }
    }  
    // dispatch custom intents to handlers here
    if ("open" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("View" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("Zoom" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("Kpi" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("Locationfilter" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("Filter" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("ExplainDashboard" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("Whatdowesee" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("thankyou" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.YesIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.NoIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session, callback) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);
	sayByeResponse(callback);
    // Add any cleanup logic here
}
 
function sayByeResponse(callback) {
    var sessionAttributes = {},
        speechOutput = "Thank you for visiting us!! Dont forget to look onto our VBX extensions",
        shouldEndSession = false,   
  
    sessionAttributes = {
        "speechOutput": speechOutput 
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}  


function getWelcomeResponse(callback) {
    var sessionAttributes = {},
        speechOutput = "Welcome to Visualbi Alexa APP",
        shouldEndSession = false,  
        repromptText = "Say a command",
  
    sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": repromptText
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}  

function handleAnswerRequest(intent, session, callback) {
    var speechOutput = "";
    var sessionAttributes = {};
    var gameInProgress = session.attributes && session.attributes.questions; 

    if (!gameInProgress) { 
        sessionAttributes.userPromptedToContinue = true;
        speechOutput = "There is no active session in progress. Do you want to start a new session? ";
        callback(sessionAttributes,
		buildSpeechletResponse(CARD_TITLE, speechOutput, speechOutput, false));
	} else {  
		if (intent.name == "open") {
		  // The Intent "TurnOn" was successfully called
		  speechOutput = "Welcome " + dashboardname.username + ",you are looking at the " + dashboardname.name + " from " + dashboardname.lasttime;
		} else if (intent.name == "View") {
		  if (intent.slots.showview.value) {
			speechOutput = "Showing the view of " + intent.slots.showview.value;
		  }
		} else if (intent.name == "Zoom") {
		  if (intent.slots.zoomlevel.value) {
			speechOutput = "Showing the zoom level of " + intent.slots.zoomlevel.value;
		  }
		} else if (intent.name == "Kpi") {
		  if (intent.slots.kpisummary.value) {
			speechOutput = "Showing the kpi summary of " + intent.slots.kpisummary.value;
		  }
		} else if (intent.name == "Locationfilter") {
		  if (intent.slots.locationtype.value) {
			speechOutput = "Showing only the location with " + intent.slots.locationtype.value + " sales";
		  }
		} else if (intent.name == "Filter") {
		  if (intent.slots.Measurelist.value && intent.slots.MeasureValue.value) {
			speechOutput = "Displaying the" + intent.slots.Measurelist.value + " for " + intent.slots.MeasureValue.value;
		  }
		} else if (intent.name == "ExplainDashboard") {
		  // The Intent "TurnOff" was successfully called
		  speechOutput = "This dashboard shows  " + dashboardname.title1 + " and  " + dashboardname.title2;
		} else if (intent.name == "Whatdowesee") {
		  // The Intent "TurnOff" was successfully called
		  speechOutput = 'We are looking at the all sales channel and all sales division';
		} else if (intent.name == "thankyou") {
		  // The Intent "TurnOff" was successfully called
		  speechOutput = "Thank you for visiting us!! Don't forget to look onto our VBX extensions";
		}
		var repromptText = speechOutput;
            sessionAttributes = {
                "speechOutput": repromptText,
                "repromptText": repromptText
            };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
        }
    }
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.

    // Set a flag to track that we're in the Help state.
    session.attributes.userPromptedToContinue = true;

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "I will ask you " + GAME_LENGTH + " multiple choice questions. Respond with the number of the answer. "
        + "For example, say one, two, three, or four. To start a new game at any time, say, start game. "
        + "To repeat the last question, say, repeat. "
        + "Would you like to keep playing?",
        repromptText = "To give an answer to a question, respond with the number of the answer . "
        + "Would you like to keep playing?";
        var shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
} 

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}