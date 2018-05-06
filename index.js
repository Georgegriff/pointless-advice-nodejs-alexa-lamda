/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const POINTLESS = 'Pointless Advice';
const fetch = require('node-fetch');
let advice;
function getAdvice() {
    return fetch('http://api.adviceslip.com/advice')
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(json => json.slip.advice)
}



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(advice)
            .withSimpleCard(POINTLESS, advice)
            .getResponse();
            
    }
};

const AdviceIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AdviceIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(advice)
            .withSimpleCard(POINTLESS, advice)
            .getResponse();
            
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = `You can get some advice`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(POINTLESS, speechText)
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
            .withSimpleCard(POINTLESS, speechText)
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
            .speak('Sorry, I can\'t create pointless advice from that command. Please say again.')
            .reprompt('Sorry, I can\'t create pointless advice from that command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

let skill;

exports.handler = async function (event, context) {
    advice = await getAdvice();                
    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
            LaunchRequestHandler,
            AdviceIntentHandler,
            HelpIntentHandler,
            CancelAndStopIntentHandler,
            SessionEndedRequestHandler,
        )
            .addErrorHandlers(ErrorHandler)
            .create();
    }

    return skill.invoke(event, context);
}