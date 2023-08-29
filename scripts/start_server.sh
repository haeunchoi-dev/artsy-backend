#!/bin/bash

if ! command -v pm2 &> /dev/null; then
    echo "pm2 could not be found. Please install it first."
    exit 1
fi

env_source="/home/ubuntu/env"
build_source="/home/ubuntu/build"

cp $backup_source/.env $build_source/.env

cd $build_source

pm2 describe artsy-backend > /dev/null 2>&1

if [ $? -eq 1 ]; then
  pm2 --name "artsy-backend" start npm -- run start
else
  pm2 restart artsy-backend
fi

exit 0