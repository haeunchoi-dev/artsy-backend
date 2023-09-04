#!/bin/bash

if sudo pm2 describe artsy-backend > /dev/null; then
    sudo pm2 stop artsy-backend
else
    echo "No running process named artsy-backend."
fi

exit 0