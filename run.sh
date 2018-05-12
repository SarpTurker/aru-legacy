#!/bin/sh

export API_PORT='5000'
export MONGO_URL='mongodb://localhost:27017/aru'
export PREFIX='!aru '
export TIME_FORMAT='ddd MMM DD YYYY | kk:mm:ss'
export GAME_NAME='!aru help'
export STREAM_URL=''
export DISCORD_PW_KEY=''
export CARBONITEX_KEY=''
export DISCORDBOTS_KEY=''
export TMDB_KEY=''
export SENTRY_URL=''
export DISCORD_TOKEN=''

exec npm start
