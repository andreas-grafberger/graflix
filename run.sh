#!/bin/bash

usage() {
    echo "Use: $0 [dev | prod | stop]" 1>&2
    exit 1
}

if [ "$1" = "development" ] || [ "$1" = "dev" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --renew-anon-volumes --build
elif [ "$1" = "production" ] || [ "$1" = "prod" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
elif [ "$1" = "stop" ]; then
    docker-compose stop
elif [ "$1" = "deploy" ]; then
    docker-compose push
else
    usage
fi
