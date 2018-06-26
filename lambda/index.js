/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server);

var dashboardname={username:"",name:"Retail Analytics",lasttime:"September 2016",title1:"Location View",title2:"Sales Group view"};
io.on('connection', function(socket){

  socket.on('userdashboardinfo', function(data){
    var info=data.split(';')
    dashboardname.username=info[0],
    dashboardname.name=info[1],
    dashboardname.lasttime="September 2016";
    dashboardname.title1=info[3];
    dashboardname.title2=info[4];
  });

});

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Visualbi Alexa APP!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  },
};

const OpenIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'open';
  },
  handle(handlerInput) {
    const speechText = "Welcome "+dashboardname.username+",you are looking at the "+dashboardname.name+" from "+dashboardname.lasttime;
	io.emit('open', speechText);
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  },
};

const ViewHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'View';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.showview.value;
    const speechText = "Showing the view of "+itemSlot;
	io.emit('view', itemSlot);
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask details about the dashboard!'; 
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Thank you for visiting us!! Dont forget to look onto our VBX extensions!';
	io.emit('stop','Stopped');
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
	io.emit('stop','Stopped');
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const LocationHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Locationfilter';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.locationtype.value;
    const speechText = "Showing only the location with " +itemSlot+ " sales";
	io.emit('locationfilter', itemSlot);
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};		
				 		
const ZoomHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Zoom';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.zoomlevel.value;
    const speechText = "Showing the zoom level of "+itemSlot;
	io.emit('zoom', itemSlot);
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};
		
const KPIHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Kpi';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.kpisummary.value;
    const speechText = "Showing the kpi summary of " +itemSlot;
	io.emit('kpi', itemSlot);
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};

	
const FilterHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Filter';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const measureList = handlerInput.requestEnvelope.request.intent.slots.Measurelist.value;
    const measureValue = handlerInput.requestEnvelope.request.intent.slots.MeasureValue.value;
    const speechText = "Displaying the "+measureList+" for "+measureValue;
	io.emit('filter', measureList+':'+measureValue);
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};

		
const DashboardHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ExplainDashboard';
  },
  handle(handlerInput) { 
    const speechText = "This dashboard shows  " + dashboardname.title1 + " and  " + dashboardname.title2;
	io.emit('ExplainDashboard', speechText);
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};

		
const ExplainHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Whatdowesee';
  },
  handle(handlerInput) { 
    const speechText = 'We are looking at the all sales channel and all sales division';
	io.emit('Whatdowesee', speechText);
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};

		
const ThankHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'thankyou';
  },
  handle(handlerInput) { 
    const speechText = "Thank you for visiting us!! Don't forget to look onto our VBX extensions";
	io.emit('stop','Stopped');
	return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VBX Alexa', speechText)
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    ThankHandler,
	FilterHandler,
	ExplainHandler,
	DashboardHandler,
    LaunchRequestHandler,
	ViewHandler,
	LocationHandler,
    OpenIntentHandler,
	ZoomHandler,
    HelpIntentHandler,
	KPIHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();