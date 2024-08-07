#!/bin/bash

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

# Assign the project name
PROJECT_NAME=$1

# Create the React app using Vite
echo "Creating a new React app with Vite..."

# Create the project using npm create vite@latest
npm create vite@latest . -- --template react-ts

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Project $PROJECT_NAME created successfully!"
echo "To get started:"
echo "cd $PROJECT_NAME"
echo "npm run dev"
