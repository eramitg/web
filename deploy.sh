#!/bin/bash

ENV=$1

echo "Building webpage"
PROD_ENV=0 webpack

if [ "$ENV" == "prod" ] ; then
  HOST="ubuntu@core.modum.io"
else
  HOST="ubuntu@dev.modum.io"
fi

echo "Deploying to $HOST"

#clean
ssh $HOST 'rm -rf /tmp/bin /tmp/src /tmp/index.html'
ssh $HOST 'rm -rf /var/www/assets /var/www/index.html'


#copy
scp -r bin/ $HOST:/tmp
scp -r index.html $HOST:/tmp
scp -r src/ $HOST:/tmp

#setup
ssh $HOST 'mkdir -p /var/www/assets'
ssh $HOST 'mv /tmp/bin/* /var/www/assets'
ssh $HOST 'mv /tmp/src/assets/* /var/www/assets'
ssh $HOST 'mv /tmp/index.html /var/www/index.html'