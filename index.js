var express = require('express')
, app = express()
, server = require('http').createServer(app)
, port = process.env.PORT || 3000
, fs = require('fs')
, util = require('util');
var io = require('socket.io')(server);
var cors = require('cors');
app.use(cors());

//DYNAMIC VARIABLES FROM THE DASHBOARD
var stopRequest=false;
var dashboardname={username:"",name:"Retail Analytics",lasttime:"Sep 2016",title1:"Location View",title2:"Sales Group view"};

// Creates the website server on the port #
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


io.on('connection', function(socket){

  socket.on('userdashboardinfo', function(data){
    var info=data.split(';')
    dashboardname.username=info[0],
    dashboardname.name=info[1],
    dashboardname.lasttime=info[2];
    dashboardname.title1=info[3];
    dashboardname.title2=info[4];
  });

});

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Express Routing
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

// Helper function to format the strings so that they don't include spaces and are all lowercase
var FormatString = function(string)
{
  var lowercaseString = string.toLowerCase();
  var formattedString = lowercaseString.replace(/\s/g,'');
  return formattedString;
};

// Handles the route for echo apis
app.post('/api/echo', function(req, res){
  console.log("received echo request");
  var requestBody = "";

  // Will accumulate the data
  req.on('data', function(data){
    requestBody+=data;
  });

  // Called when all data has been accumulated
  req.on('end', function(){
    var responseBody = {};

    // parsing the requestBody for information
    var jsonData = JSON.parse(requestBody);
    stopRequest=false;
    if(jsonData.request.type == "LaunchRequest")
    {
      // crafting a response
      responseBody = {
        "version": "0.1",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Welcome to Visualbi Alexa APP"
          },
          "reprompt": {
            "outputSpeech": {
              "type": "PlainText",
              "text": "Say a command"
            }
          },
          "shouldEndSession": false
        }
      };
    }

    //intent.slots.Answer
    else if(jsonData.request.type == "IntentRequest")
    {

      var outputSpeechText = "";
      var cardContent = "";
      if (jsonData.request.intent.name == "open")
      {
        // The Intent "TurnOn" was successfully called
        outputSpeechText = "Welcome "+dashboardname.username+",you are looking at the "+dashboardname.name+" from "+dashboardname.lasttime;
        cardContent = "Welcome "+dashboardname.username+",you are looking at the "+dashboardname.name+" from "+dashboardname.lasttime;
		     io.emit('open', outputSpeechText);
      }


      else if(jsonData.request.intent.name == "View"){
          outputSpeechText = "Showing the view of "+jsonData.request.intent.slots.showview.value;
          cardContent = "Showing the view of "+jsonData.request.intent.slots.showview.value;
          io.emit('view',jsonData.request.intent.slots.showview.value);
      }
      else if(jsonData.request.intent.name == "Zoom"){
          outputSpeechText = "Showing the zoom level of "+jsonData.request.intent.slots.zoomlevel.value;
          cardContent = "Showing the zoom level of "+jsonData.request.intent.slots.zoomlevel.value;
          io.emit('zoom',jsonData.request.intent.slots.zoomlevel.value);
      }
      else if(jsonData.request.intent.name == "Kpi"){
            outputSpeechText = "Showing the kpi summary of "+jsonData.request.intent.slots.kpisummary.value;
            cardContent = "Showing the kpi summary view of "+jsonData.request.intent.slots.kpisummary.value;
            io.emit('kpi',jsonData.request.intent.slots.kpisummary.value);
      }
      else if(jsonData.request.intent.name == "Locationfilter"){
          outputSpeechText = "Showing only the location with "+jsonData.request.intent.slots.locationtype.value+" sales";
          cardContent = "Showing only the location with "+jsonData.request.intent.slots.locationtype.value+" sales";
          io.emit('locationfilter',jsonData.request.intent.slots.locationtype.value);
      }

      //s
      else if(jsonData.request.intent.name == "Filter"){
          outputSpeechText = "Displaying the"+jsonData.request.intent.slots.Measurelist.value+" for "+jsonData.request.intent.slots.MeasureValue.value;
          cardContent = "Displaying the"+jsonData.request.intent.slots.Measurelist.value+" for "+jsonData.request.intent.slots.MeasureValue.value;
          io.emit('filter',jsonData.request.intent.slots.Measurelist.value+':'+jsonData.request.intent.slots.MeasureValue.value);

      }

      else if (jsonData.request.intent.name == "ExplainDashboard")
      {
        // The Intent "TurnOff" was successfully called
        outputSpeechText =  "This dashboard shows  "+dashboardname.title1+" and  "+dashboardname.title2;
        cardContent =  "This dashboard shows  "+dashboardname.title1+" and  "+dashboardname.title2;
		    io.emit('ExplainDashboard', outputSpeechText);
      }
      else if (jsonData.request.intent.name == "Whatdowesee")
      {
        // The Intent "TurnOff" was successfully called
        outputSpeechText =  'We are looking at the all sales channel and all sales division';
        cardContent =  'We are looking at the all sales channel and all sales division';
		    io.emit('Whatdowesee', outputSpeechText);
      }
      else if (jsonData.request.intent.name == "thankyou")
      {
        // The Intent "TurnOff" was successfully called
        outputSpeechText =  "Thank you for visiting us!! Don't forget to look onto our VBX extensions";
        cardContent =  "Thank you for visiting us!! Don't forget to look onto our VBX extensions";
        io.emit('stop','Stopped');
      }else if (jsonData.request.intent.name="AMAZON.StopIntent") {
        handlestopRequest();
        io.emit('stop','Stopped');
      } else if(jsonData.request.intent.name="AMAZON.CancelIntent") {
         handlestopRequest();
         io.emit('stop','Stopped');
      }else{
        outputSpeechText = "Sorry! I could not understand you properly! can you try again with proper command";
        cardContent = "Sorry! I could not understand you properly! can you try again with proper command";
      }


      function handlestopRequest(){
        outputSpeechText =  "Thank you for visiting us!! Don't forget to look onto our VBX extensions";
        cardContent =  "Thank you for visiting us!! Don't forget to look onto our VBX extensions";
        stopRequest=true;
      }


      responseBody = {
          "version": "0.1",
          "response": {
            "outputSpeech": {
              "type": "PlainText",
              "text": outputSpeechText
            },
            "card": {
              "type": "Simple",
              "title": "Open Smart Hub",
              "content": cardContent
            },
            "shouldEndSession": stopRequest
          }
        };
    }else{
      // Not a recognized type
      responseBody = {
        "version": "0.1",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Could not parse data"
          },
          "card": {
            "type": "Simple",
            "title": "Error Parsing",
            "content": JSON.stringify(requestBody)
          },
          "reprompt": {
            "outputSpeech": {
              "type": "PlainText",
              "text": "Say a command"
            }
          },
          "shouldEndSession": stopRequest
        }
      };
    }

    res.statusCode = 200;
    res.contentType('application/json');
    res.send(responseBody);
  });
});
