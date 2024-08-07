FROM ubuntu:22.04

# Install required packages
RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    build-essential

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Install Python
RUN apt-get install -y python3 python3-pip

# Verify installations
RUN node -v && python3 --version

# Install global npm packages
RUN npm i -g nodemon vite
RUN npm install -g create-react-app@5.0.1



# Set the working directory
WORKDIR /container

# Copy the project files
COPY . .

RUN npm install

# Make the initiate.sh script executable
RUN chmod +x /container/initiate.sh

# Make scripts executable
RUN chmod +x /container/scripts/*.sh

# Set the entrypoint to run the initiate.sh script
ENTRYPOINT ["/container/initiate.sh"]
