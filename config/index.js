require('dotenv').config()

const config = {
    "TOKEN": process.env.TOKEN,
    "BOT_FILTER": process.env.BOT_FILTER === 'true',
    "BOT_BANNED_USERS": parseInt(process.env.BOT_BANNED_USERS),
    "COOLDOWN_PUTEADAS": parseInt(process.env.COOLDOWN_PUTEADAS),
    "MAXIMUM_AMOUNT_OF_VOTES": parseInt(process.env.MAXIMUM_AMOUNT_OF_VOTES),
    "EVENTS_PATH": process.env.EVENTS_PATH,
    "USERS_PATH": process.env.USERS_PATH,
    "AWS_API_URL": process.env.AWS_API_URL,
    "AWS_API_STAGE": process.env.AWS_API_STAGE
}

module.exports =  { config };