# Use the official Ubuntu base image
FROM ubuntu:22.04

# Update package lists and install required packages
RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    build-essential \
    python3 \
    python3-pip

# Install Node.js from the NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Install global npm packages
RUN npm install -g nodemon vite

# Verify installations
RUN node -v && python3 --version

# Set the working directory
WORKDIR /app

# Copy scripts into the container
COPY ./scripts /app/scripts

# Make scripts executable
RUN chmod +x /app/scripts/*

# Default command
CMD ["bash"]
