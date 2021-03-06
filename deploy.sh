#!/bin/bash

ENV=$1

echo "Building webpage"
node build/build.js

if [ "$ENV" == "prod" ] ; then
  HOST="ubuntu@core.modum.io"
else
  HOST="ubuntu@dev.modum.io"
fi

echo "Deploying to $HOST"

#clean
ssh $HOST 'rm -rf /tmp/static /tmp/index.html'
ssh $HOST 'rm -rf /var/www/static/* /var/www/index.html'

#copy
scp -r dist/* $HOST:/tmp
#scp -r index.html $HOST:/tmp
#scp -r src/assets $HOST:/tmp

#setup
ssh $HOST 'mkdir -p /var/www/static'
#ssh $HOST 'cp /tmp/bin/* /var/www/assets'
ssh $HOST 'cp -r /tmp/static/* /var/www/static'
ssh $HOST 'cp /tmp/index.html /var/www/index.html'
