const fs = require('fs');
const path = require('path')
const joi = require('joi');
const Telegram = require('telegram-node-bot'); 
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;
const { config } = require('../config');

const EVENTS_LIST = require(config.EVENTS_PATH);
const { addEventForm, removeEventForm } = require('../utils/forms/events');
const { typeSchema, idSchema } = require('../utils/schemas/events');
const orderEventsByDate = require('../utils/orderEventsByDate');

class EventsControler extends TelegramBaseController {
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');
        
        if(scopes !== -1){
            scopes = scope._message._text.substring(scope._message._text.indexOf(' ')+1 , scope._message._text.length);
            scope.options = scopes.split(' ');
        }

        return scope;
    }
    
    eventsHandlerFilter($){
        usageFilter($, this.eventsHandler);
    }

    eventsHandler($) {
        const buildEventsString = (eventsList, type = 'events') => {
            eventsList = orderEventsByDate(eventsList);
            let builtString = '';

            if(eventsList.length){
                builtString = eventsList.reduce(( acum, item) => {
                    return acum+`\nId: ${item.id} | Date: ${item.date.day}/${item.date.month} | ${item.description}\n`;
                }, '');
            }else{
                builtString = `No ${type} found`;
            }

            return builtString;
        }

        const filterType = (type) => {
            const filteredList = EVENTS_LIST.filter(item => item.type === type);
            return buildEventsString(filteredList, type);
        }

        const writeEvents = (action) => {
            fs.writeFile(config.EVENTS_PATH, JSON.stringify(EVENTS_LIST, null, 4), (err) => {
                if(err){
                    console.error(err);
                    $.sendMessage('Somethig really bad happened...')
                }
                $.sendMessage(`Succesfully ${action}!`);
            });
        }

        if($.options){
            switch($.options[0]){
                case 'list':
                    const {error: error_list} = joi.validate($.options[1], typeSchema);

                    if(!error_list){
                        if(!$.options[1]){
                            $.sendMessage(buildEventsString(EVENTS_LIST));
                        }else{
                            $.sendMessage(filterType($.options[1]));
                        }
                    }else{
                        $.sendMessage('Usage: \n/events list [test, schedule, homework, other]');
                    }
                break;

                case 'add':
                    $.runForm(addEventForm, (result) => {
                        const randId = Math.floor((Math.random() * 999) + 1);
                        const dateArray = result.date.split('/');
                        const eventObj = {
                            id: randId,
                            type: result.type,
                            date: {
                                day: dateArray[0],
                                month: dateArray[1],
                                year: new Date().getFullYear().toString()
                            },
                            description: result.description
                        };
                        EVENTS_LIST.push(eventObj);
                        writeEvents('added');
                    });
                break;

                case 'remove':
                    const { error: error_remove} = joi.validate($.options[1], idSchema);
                    
                    if(!error_remove){
                        const eventId = parseInt($.options[1]);
                        const [ eventObj ] = EVENTS_LIST.filter((item) => item.id === eventId);
                        
                        $.runForm(removeEventForm(eventObj), (result) => {
                            if(result.removeConfirmation){
                                for(let [index, item] of EVENTS_LIST.entries()){
                                    if(item.id === eventId){
                                        EVENTS_LIST.splice(index, 1);
                                        writeEvents('removed');
                                        break;
                                    }
                                };
                            }else{
                                $.sendMessage('Canceled!');
                            }
                        });
                    }else{
                        $.sendMessage('Usage: \n/events remove [Id]');
                    }
                break;

                default:
                    $.sendMessage('Error!\nOptions: [list, add, remove]');
                break;
            }
        }else{
            $.sendMessage('Error!\nUsage -> /events [Options] [Scope?]');
        }
    }

    get routes() {
        return {
            'eventCommand': 'eventsHandlerFilter'
        }
    }
}

module.exports = EventsControler;