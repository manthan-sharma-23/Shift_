import { Injectable } from '@nestjs/common';
import { Cube } from '@prisma/client';
import SocketToContainerService from './socket-client.service';

export interface ContainerSocket {
  cube: Partial<Cube>;
  socket: SocketToContainerService;
}

@Injectable()
export default class SocketConnectionManagerService {
  express_available_ports: Map<number, ContainerSocket>;
  project_available_ports: Map<number, ContainerSocket>;
  express_cubeId_map: Map<number, string>;
  port = {
    express: {
      min: 3000,
      max: 5000,
    },
    project: {
      min: 12000,
      max: 15000,
    },
  };

  constructor() {
    this.express_available_ports = new Map();
    this.project_available_ports = new Map();
    this.express_cubeId_map = new Map();
  }

  is_port_available(port: number): boolean {
    if (port >= this.port.express.min && port <= this.port.express.max) {
      return !this.express_available_ports.has(port);
    } else if (port >= this.port.project.min && port <= this.port.project.max) {
      return !this.project_available_ports.has(port);
    }
    return false;
  }

  async find_express_port() {
    for (let i = this.port.express.min; i <= this.port.express.max; i++) {
      if (this.is_port_available(i)) {
        return i;
      }
    }
    return null;
  }

  async find_project_port() {
    for (let i = this.port.project.min; i <= this.port.project.max; i++) {
      if (this.is_port_available(i)) {
        return i;
      }
    }
    return null;
  }

  create_socket_connection({
    express_port,
    other_port,
    cube,
  }: {
    express_port: number;
    other_port: number;
    cube: Cube;
  }) {
    const socketService = new SocketToContainerService(express_port, cube);

    this.express_available_ports.set(express_port, {
      socket: socketService,
      cube,
    });

    this.project_available_ports.set(other_port, {
      socket: socketService,
      cube,
    });

    this.express_cubeId_map.set(express_port, cube.id);
  }
}
