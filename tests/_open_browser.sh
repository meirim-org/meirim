#!/usr/bin/env bash

wait_and_launch ()
{
    until curl --output /dev/null --silent --head --fail "$1"; do
        sleep 1
    done
    xdg-open $1
}


# Launch Meirim development portal
wait_and_launch http://localhost

# Launch web site
wait_and_launch http://localhost:3000
