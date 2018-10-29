/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const helperFunctions = require('helper');
const config = require('config');

const STATION_CODE = config.STATION_CODE;
const API_KEY = config.API_KEY;
const API_BASE_URL = "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx";
const API_CALL = API_BASE_URL+"?key="+API_KEY+"&mapid="+STATION_CODE;

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Tell me which way you are going?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const TrainArrivalEstimatesRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TrainArrivalEstimatesRequest';
  },
  handle(handlerInput) {
      const {attributesManager} = handlerInput;
      const { request } = handlerInput.requestEnvelope;

      let outputText = '';
      let direction = '';
      let trainDestination = '';
      let slots = request.intent.slots;
      if(slots.eastDirection.hasOwnProperty('value')){
          direction = slots.eastDirection.value;
          trainDestination = 'Service toward 63rd St';
      }else if(slots.westDirection.hasOwnProperty('value')){
          direction = slots.westDirection.value;
          trainDestination = 'Service toward Harlem/Lake';
      }else{
          const speechText = 'Sorry, I don\'t know that destination. Try saying it again, or another phrase like: get me the next train toward the city.';
          return handlerInput.responseBuilder
              .speak(speechText)
              .withShouldEndSession(false)
              .getResponse();
      }

    //get the next train times here
    let trainXMLData = helperFunctions.getJsonObjectFromXMLFeed(API_CALL);
    let estimateData = trainXMLData.then(function(jsonArrivalTimes){
        let etas = jsonArrivalTimes.ctatt.eta;
        let etaEstimates = {};
        for(let eta of etas){
          console.log(eta);
          eta.prdt = eta.prdt[0];
          eta.arrT = eta.arrT[0];
          let currentTime = helperFunctions.convertDateTimeToTime(eta.prdt);
          let arrivalTime = helperFunctions.convertDateTimeToTime(eta.arrT);
          let waitingTime = helperFunctions.convertMillisecondsToMinutes(helperFunctions.getTimeDifference(currentTime, arrivalTime));
          waitingTime = helperFunctions.minutesToHumanHearable(parseInt(waitingTime));

          let standardArrivalTime = helperFunctions.convertMiltaryTimeToStandardTime(arrivalTime);
          console.log('standardArrivalTime:', standardArrivalTime);

          eta.stpDe = eta.stpDe[0];
          eta.isApp = eta.isApp[0];
          eta.isDly = eta.isDly[0];
          if(etaEstimates.hasOwnProperty(eta.stpDe)){
              etaEstimates[eta.stpDe].push({
                      'wait': waitingTime,
                      'arrival_time': standardArrivalTime,
                      'is_approaching': eta.isApp,
                      'is_delayed':  eta.isDly
                  });
          }else{
              etaEstimates[eta.stpDe] = [{
                'wait': waitingTime,
                'arrival_time': standardArrivalTime,
                'is_approaching': eta.isApp,
                'is_delayed':  eta.isDly
              }];
          }

        };

        //get the data of the direction the train is going
        etaEstimates = etaEstimates[trainDestination];
        return [direction, etaEstimates];

    });

    let outputString = estimateData.then(function (destinationData) {
        let direction = destinationData[0];
        let estimates = destinationData[1];
        let speechOutput = 'The next train towards '+direction+ ' is ';
        speechOutput += estimates[0].wait + ' away';
        speechOutput += ', and due to arrive at '+ estimates[0].arrival_time+'.' ;
        speechOutput += (estimates[0].is_approaching === '1' ? ' It is approaching.': '');
        speechOutput +=  (estimates[0].is_delayed === '1' ? ' It is currently delayed.': '');
        if(estimates.length == 2){
            speechOutput += ' There is a following train ';
            speechOutput += estimates[1].wait + ' away';
            speechOutput += ', and due to arrive at '+ estimates[1].arrival_time+'.' ;
            speechOutput += (estimates[1].is_approaching === '1' ? ' It is approaching.': '');
            speechOutput +=  (estimates[1].is_delayed === '1' ? ' It is currently delayed.': '');
        }

        return speechOutput;

    }).then(function(speechText){
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    });

    return outputString;


  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me: when is the next train toward Harlem. Or, when is the next train towards 63rd';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
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
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

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

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    TrainArrivalEstimatesRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
