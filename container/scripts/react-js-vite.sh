#!/bin/bash

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

# Assign the project name
PROJECT_NAME=$1
PORT=$2

# Create the React app using create-react-app
echo "Creating a new React app with create-react-app..."

# Create the project using npx create-react-app
npx create-react-app ./
# Install dependencies (not necessary as create-react-app installs them automatically)
echo "Installing dependencies..."
npm install &
# npm install (This line is optional because create-react-app already installs dependencies)

echo "Running React Scripts ..."
PORT=$PORT npm run start