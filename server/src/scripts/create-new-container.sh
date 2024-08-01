#!/bin/bash

USER_ID=$1

CONTAINER_NAME="user-container-$USER_ID"

docker run -d --name $CONTAINER_NAME --network server_lynx-network user-container:latest
