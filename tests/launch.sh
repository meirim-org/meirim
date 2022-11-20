#!/usr/bin/env bash

if ! command -v tmuxinator &> /dev/null
then
    echo "Error: Tmuxinator could not be found. Go here https://command-not-found.com/tmuxinator"
    exit
fi

./_open_browser.sh &

# Launch Terminator with docker-compose command, to spawn all dockers
tmuxinator
