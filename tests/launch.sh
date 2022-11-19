#!/usr/bin/env bash

if ! command -v terminator &> /dev/null
then
    echo "Error: Terminator could not be found. Go here https://command-not-found.com/terminator"
    exit
fi

# Launch Terminator with docker-compose command, to spawn all dockers
terminator --config-json ./terminator/meirim.json &

# Launch Meirim development portal
until curl --output /dev/null --silent --head --fail "http://localhost"; do
    sleep 1
done
xdg-open http://localhost
