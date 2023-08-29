#!/bin/bash

if pm2 describe artsy-backend > /dev/null; then
    pm2 stop artsy-backend
else
    echo "No running process named artsy-backend."
fi

exit 0