#!/bin/bash

if ! command -v pm2 &> /dev/null; then
    echo "pm2 could not be found. Please install it first."
    exit 1
fi

if pm2 describe artsy-backend > /dev/null; then
    pm2 stop artsy-backend
else
    echo "No running process named artsy-backend."
fi

exit 0