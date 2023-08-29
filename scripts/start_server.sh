#!/bin/bash

env_source="/home/ubuntu/env"
build_source="/home/ubuntu/build"

sudo cp $backup_source/.env $build_source/.env

cd $build_source

sudo pm2 describe artsy-backend > /dev/null 2>&1

if [ $? -eq 1 ]; then
  sudo pm2 --name "artsy-backend" start npm -- run start
else
  sudo pm2 restart artsy-backend
fi

exit 0