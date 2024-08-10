import { Injectable } from '@nestjs/common';
import { Cube } from '@prisma/client';
import { configurations } from 'src/lib/config';
import SocketConnectionManagerService from './socket-connection-manager.service';
import * as Docker from 'dockerode';

@Injectable()
export class ContainerService {
  private docker: Docker;

  constructor(
    private readonly socketConnectionManagerService: SocketConnectionManagerService,
  ) {
    this.docker = new Docker();
  }

  private image = configurations.container.user_container_image;

  async run_containers(cube: Cube) {
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

    return { port1, port2 };
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
}
