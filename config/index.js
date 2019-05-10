require('dotenv').config()

const config = {
    "TOKEN": process.env.TOKEN,
    "BOT_FILTER": process.env.BOT_FILTER === 'true',
    "BOT_BANNED_USERS": parseInt(process.env.BOT_BANNED_USERS),
    "COOLDOWN_PUTEADAS": parseInt(process.env.COOLDOWN_PUTEADAS),
    "MAXIMUM_AMOUNT_OF_VOTES": parseInt(process.env.MAXIMUM_AMOUNT_OF_VOTES)
}

module.exports =  { config };