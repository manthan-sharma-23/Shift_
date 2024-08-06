#!/bin/bash

# Check if the project name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <project-name>"
    exit 1
fi

PROJECT_NAME=$1
PROJECT_PATH="/app/projects/$PROJECT_NAME"

# Create the project directory
mkdir -p "$PROJECT_PATH"

# Initialize a new React app in the project directory
cd "$PROJECT_PATH" && npx create-react-app .

# Output the project directory path for confirmation
echo "React project $PROJECT_NAME created at $PROJECT_PATH"
