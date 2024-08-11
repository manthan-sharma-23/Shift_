#!/bin/bash

# Save arguments as environment variables
export PORT1=$1
export PORT2=$2
export PROJECT_NAME=$3
export PROJECT_TYPE=$4
export PLAYGROUND_ID=$5
REINIT=${6:-0} # Default to 0 if not provided

# Print the received arguments and environment variables
echo "PORT1: $PORT1"
echo "PORT2: $PORT2"
echo "PLAYGROUND_ID: $PLAYGROUND_ID"
echo "Starting the container with ports $PORT1 and $PORT2, and setting up project $PROJECT_NAME of type $PROJECT_TYPE"

# Install and start the Express app
echo "Installing dependencies for Express app..."
npm install

echo "Starting the Express app on port $PORT1..."
PORT=$PORT1 npm run dev &

# Check if REINIT is set to 1
if [ "$REINIT" -eq 1 ]; then
  echo "REINIT is set to 1. Skipping the rest of the script."
  mkdir -p "/container/project"
else
  # Create project directory for React app if it doesn't exist
  mkdir -p "/container/project/$PROJECT_NAME" || {
    echo "Project directory already initialized"
  }

  # Change to the React app directory
  cd "/container/project/$PROJECT_NAME" || exit

  # Run the appropriate initialization script based on PROJECT_TYPE
  case "$PROJECT_TYPE" in
  react-js-vite)
    /container/scripts/react-js-vite.sh "$PROJECT_NAME" "$PORT2"
    ;;
  react-ts-vite)
    /container/scripts/react-ts-vite.sh "$PROJECT_NAME" "$PORT2"
    ;;
  *)
    echo "Unknown project type: $PROJECT_TYPE"
    exit 1
    ;;
  esac
fi

# Keep the container running
echo "Keeping the container running..."
tail -f /dev/null
