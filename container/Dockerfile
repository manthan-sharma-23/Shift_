# docker pull manthan23s/lynx-user-container
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    build-essential

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs


RUN apt-get install -y python3 python3-pip
RUN node -v && python3 --version

RUN npm i -g nodemon vite

WORKDIR /app

CMD ["bash"]
