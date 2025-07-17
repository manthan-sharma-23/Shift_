# Shift_ - An Online Code Editor
---

https://github.com/user-attachments/assets/3bf5fc95-01b0-49bb-b3e9-fc1034919391


## Tech Stack

### Server-Side Development
- **Shell Scripting**: Manages projects, automating tasks related to container management and environment setup.
- **Docker Containers**: Powers the underlying infrastructure, enabling isolated environments for each project.
- **Container Orchestration**: Self-designed APIs using Dockerode and shell environments to manage containers efficiently.
- **NestJS**: Serves as a reverse proxy and container engine, routing requests to appropriate services and managing container lifecycles.
- **WebSockets**: Facilitates real-time communication between the client and server.
- **PostgreSQL**: Used as the primary database to store user data, project configurations, and logs.
- **AWS S3**: Provides persistent file storage, ensuring data is preserved even during container downtimes.

### Container Image Development
- **Express Server**: Routes requests within the containerized environment.
- **Sockets**: Manages real-time communication within containers.
- **File System Manager**: Handles file operations, ensuring data integrity and consistency within the container.
- **node-pty**: Utilizes `node-pty` to spawn processes like `child_process` for executing commands, allowing for parallel processing in the otherwise single-threaded Node.js environment.

### Client-Side Development
- **React**: The front-end framework used to build a dynamic and responsive user interface.
- **Shadcn UI & Tailwind CSS**: Provides a modern and customizable UI, enhancing the user experience with utility-first CSS.
- **Recoil**: Manages application state efficiently, providing a scalable solution for complex state management.
- **WebSockets**: Enables real-time updates and communication between the client and server.

