const { config } = require('../config/index');
const unicodeIcons = require('./unicodeIcons');
const getUserTagById = require('./getUserTagById');

const MAXIMUM_AMOUNT_OF_VOTES = config.MAXIMUM_AMOUNT_OF_VOTES;

let CURRENT_POLL = { pollId: null, userToBeKickedId: null};
let POLL_VOTES = [];
let POLL_TIMEOUT;

function generatePollStateIcons(){
    var icons = '';

    for(var x = 0 ; x < MAXIMUM_AMOUNT_OF_VOTES ; x++){
        if(POLL_VOTES[x]){
            if(POLL_VOTES[x].vote){
                icons += unicodeIcons.UNICODE_TICK + ' '
            }else{
                icons += unicodeIcons.UNICODE_CROSS + ' '
            }
        }else{
            icons += unicodeIcons.UNICODE_CLOCK + ' '
        }
    }

    return icons;
}

function resetPoll(){
    clearTimeout(POLL_TIMEOUT);
    CURRENT_POLL = { pollId: null, userToBeKickedId: null};
    POLL_VOTES = [];
}

function checkPollState($){
    if(POLL_VOTES.length >= MAXIMUM_AMOUNT_OF_VOTES - 1){
        var positiveVotes = 0;
        var positiveVotesPercentageOfTotal;

        POLL_VOTES.map(({ vote }) => {
            if(vote) positiveVotes++;
        });
        positiveVotesPercentageOfTotal = (positiveVotes*100) / MAXIMUM_AMOUNT_OF_VOTES;
        
        if(positiveVotesPercentageOfTotal >= 80){
            $.sendMessage('Adioooos idiota!', { reply_markup: JSON.stringify({ remove_keyboard: true }) });
            $.kickChatMember(CURRENT_POLL.userToBeKickedId);
            $.unbanChatMember(CURRENT_POLL.userToBeKickedId);
            resetPoll();
        }else{
            if(POLL_VOTES === MAXIMUM_AMOUNT_OF_VOTES){
                $.sendMessage('Votacion rechazada...', { reply_markup: JSON.stringify({ remove_keyboard: true }) });
                resetPoll();
            }
        }
    }
}

module.exports = {
    setUpPoll: (pollId, userToBeKickedId, pollTimeOutId) => {
        CURRENT_POLL.pollId = pollId;
        CURRENT_POLL.userToBeKickedId = userToBeKickedId;
        POLL_TIMEOUT = pollTimeOutId;
    },

    checkIsAVote: (messageReplyId) => {
        return CURRENT_POLL.pollId && messageReplyId === CURRENT_POLL.pollId;
    },
    
    resetPoll,

    makeVote: ($, messageSenderId, vote) => {
        const messageSenderTag = getUserTagById(messageSenderId);

        if(messageSenderTag){
            POLL_VOTES.push( { messageSenderId,  vote: vote } );
            $.sendMessage(`${messageSenderTag} voted ${vote ? unicodeIcons.UNICODE_TICK+' F1' : unicodeIcons.UNICODE_CROSS+' F2'}\nCurrent: ${generatePollStateIcons()}`);
            checkPollState($);
        }
    },

    checkIfAlreadyVoted: (messageSenderId) => {
        for(const voteObject of POLL_VOTES){
            if(voteObject.messageSenderId == messageSenderId){
                return true;
            }
        }
        return false;
    },

    generatePollStateIcons
}