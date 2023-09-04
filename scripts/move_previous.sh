#!/bin/bash

current_date=$(date +"%Y%m%d%H%M%S")
backup_source="/home/ubuntu/build"
backup_dest_base="/home/ubuntu/backup"

backup_dest="$backup_dest_base/$current_date"

rm -rf $backup_dest_base
mkdir -p $backup_dest

mv $backup_source $backup_dest

mkdir -p $backup_source

exit 0