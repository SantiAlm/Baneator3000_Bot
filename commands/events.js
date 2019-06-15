/* 
    {
        "id": "",
        "type": "",
        "date": "",
        "description": ""
    }
*/

const fs = require('fs');
const joi = require('joi');
const Telegram = require('telegram-node-bot'); 
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;

const { addEventForm } = require('../utils/forms/events');
const EVENTS_LIST = require('../utils/moks/events_moks.json');

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
        const filterType = (type) => {
            const filteredList = EVENTS_LIST.filter(item => item.type === type);
                            
            const builtString = filteredList.reduce(( acum, item) => {
                return acum+`\nDate: ${item.date} | ${item.description}`;
            }, 'List: \n');
            
            return builtString;
        }
        
        if($.options){
            switch($.options[0]){
                case 'list':
                    switch($.options[1]){
                        case 'test':
                            $.sendMessage(filterType('test'));
                        break;

                        case 'schedule':
                            $.sendMessage(filterType('schedule'));
                        break;

                        case 'homework':
                            $.sendMessage(filterType('homework'));
                        break;

                        case 'other':
                            $.sendMessage(filterType('other'));
                        break;

                        default:
                            $.sendMessage('Usage: \n/events list [test, schedule, homework, other]');
                        break;
                    }
                break;

                case 'add':
                    $.runForm(addEventForm, (result) => {
                        $.sendMessage(`${result.type}\n ${result.date}\n ${result.description}`);
                    });
                break;

                case 'remove':
                    
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