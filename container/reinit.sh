#!/bin/bash

# Check if the PROJECT_NAME argument is provided
if [ -z "$1" ]; then
    echo "Error: PROJECT_NAME argument is required"
    exit 1
fi

PROJECT_NAME=$1

# Change to the project directory
cd "project/$PROJECT_NAME" || {
    echo "Failed to change directory"
    exit 1
}

# Install dependencies
npm install || {
    echo "npm install failed"
    exit 1
}

# Run the development server
npm run dev || {
    echo "npm run dev failed"
    exit 1
}
