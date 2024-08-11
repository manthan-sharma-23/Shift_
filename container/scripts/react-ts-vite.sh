#!/bin/bash

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <project-name> [port]"
  exit 1
fi

# Assign the project name and port
PROJECT_NAME=$1
PORT=$2

# Create the React app with TypeScript template
echo "Creating a new React app with TypeScript template..."

# Create the project using npx create-react-app with TypeScript template
npx create-react-app $PROJECT_NAME --template typescript
cd $PROJECT_NAME

# Install dependencies (not necessary as create-react-app installs them automatically)
echo "Installing dependencies..."
npm install &

# Run the React app on the specified port
npm pkg set scripts.dev="PORT=$PORT npm run start"

echo "Running React Scripts ..."
npm run dev
