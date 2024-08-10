import { Injectable, NotFoundException } from '@nestjs/common';
import { Cube } from '@prisma/client';
import { configurations } from 'src/lib/config';
import SocketConnectionManagerService from './socket-connection-manager.service';
import * as Docker from 'dockerode';

@Injectable()
export class ContainerService {
  private docker: Docker;
  container_state = {
    running: 'running',
    exited: 'exited',
  };

  constructor(
    private readonly socketConnectionManagerService: SocketConnectionManagerService,
  ) {
    this.docker = new Docker();
  }

  private image = configurations.container.user_container_image;

  async create_container(cube: Cube) {
    const container_name = `project-${cube.id}`;

    const port1 = await this.socketConnectionManagerService.find_express_port();
    const port2 = await this.socketConnectionManagerService.find_project_port();

    const container_options = this.getContainerOptions({
      image: this.image,
      containerName: container_name,
      port1,
      port2,
      cube,
    });

    const container = await this.docker.createContainer(container_options);
    await container.start();

    this.socketConnectionManagerService.create_socket_connection({
      express_port: port1,
      other_port: port2,
      cube: cube,
    });

    return { port1, port2 };
  }

  async run_container(cubeId: string) {
    const container_name = `project-${cubeId}`;
    const ports = {
      express_port: 0,
      other_port: 0,
    };

    const { container, info } =
      await this.find_container_with_name(container_name);

    if (info.State === this.container_state.exited) {
      await container.start();
      await this.delay(100 * 1000);
    }

    info.Ports.forEach((port) => {
      if (
        this.socketConnectionManagerService.port.express.min <=
          port.PublicPort &&
        port.PublicPort <= this.socketConnectionManagerService.port.express.max
      ) {
        ports.express_port = port.PublicPort;
      } else if (
        this.socketConnectionManagerService.port.project.min <=
          port.PublicPort &&
        port.PublicPort <= this.socketConnectionManagerService.port.project.max
      ) {
        ports.other_port = port.PublicPort;
      }
    });

    return { info, ports };
  }

  async find_container_with_name(containerName: string) {
    const nameToFind = containerName.startsWith('/')
      ? containerName
      : `/${containerName}`;

    const containers = await this.docker.listContainers({ all: true });

    const containerInfo = containers.find((container) =>
      container.Names.includes(nameToFind),
    );

    if (!containerInfo) {
      throw new NotFoundException('Container not found');
    }

    const container = await this.docker.getContainer(containerInfo.Id);

    return { container, info: containerInfo };
  }

  private getContainerOptions({
    image,
    containerName,
    port1,
    port2,
    cube,
  }: {
    image: string;
    containerName: string;
    port1: number;
    port2: number;
    cube: Cube;
  }) {
    const options: Docker.ContainerCreateOptions = {
      Image: image,
      name: containerName,
      Tty: true,
      Cmd: [
        `${port1}`,
        `${port2}`,
        `${cube.name}`,
        `${cube.type}`,
        `${cube.id}`,
        '--y',
      ],
      ExposedPorts: {
        [`${port1}/tcp`]: {},
        [`${port2}/tcp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${port1}/tcp`]: [{ HostPort: `${port1}` }],
          [`${port2}/tcp`]: [{ HostPort: `${port2}` }],
        },
      },
    };
    return options;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
