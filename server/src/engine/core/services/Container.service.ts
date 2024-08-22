import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cube } from '@prisma/client';
import { configurations } from 'src/lib/config';
import SocketConnectionManagerService from './socket-connection-manager.service';
import * as Docker from 'dockerode';
import axios from 'axios';
import { FileObject } from 'src/engine/types/static/container';
import S3Service from './aws_s3.service';
import DatabaseService from 'src/engine/database/Database.service';

@Injectable()
export class ContainerService {
  private docker: Docker;
  container_state = {
    running: 'running',
    exited: 'exited',
  };
  networkName = 'server_lynx-network';

  constructor(
    private readonly socketConnectionManagerService: SocketConnectionManagerService,
    private readonly s3Service: S3Service,
    private readonly databaseService: DatabaseService,
  ) {
    this.docker = new Docker();
  }

  private image = configurations.container.user_container_image;

  async create_container(cube: Cube, REINIT: 0 | 1 = 0) {
    const container_name = this.getContainerName(cube.id);

    const port1 = await this.socketConnectionManagerService.find_express_port();
    const port2 = await this.socketConnectionManagerService.find_project_port();

    const container_options = this.getContainerOptions({
      image: this.image,
      containerName: container_name,
      port1,
      port2,
      cube,
      REINIT,
    });

    const _container = await this.docker.createContainer(container_options);
    // await _container.start();

    const network = await this.get_network();
    network.connect({
      Container: _container.id,
    });

    this.socketConnectionManagerService.create_socket_connection({
      express_port: port1,
      other_port: port2,
      cube: cube,
    });

    return { port1, port2, container: _container };
  }

  async burnContainers(cubeId: string, userId: string) {
    const containerName = this.getContainerName(cubeId);
    const port = this.socketConnectionManagerService.getCubePort(cubeId);

    await this.databaseService.cube.update({
      where: {
        id: cubeId,
      },
      data: {
        status: 'preparing',
      },
    });

    if (!port) {
      throw new GoneException('No cube found running');
    }
    const files = await this.fetchContainerFs(containerName, port.express);

    const isUploaded = await this.s3Service.uploadFiles(files, userId, cubeId);

    if (!isUploaded) {
      console.log(`Couldn't back up container`);
      throw new ConflictException(`Couldn't back up container`);
    }

    const { container } = await this.find_container_with_name(containerName);

    try {
      await container.stop();
    } catch (error) {
      throw new ConflictException(`Error stopping containers ${error}`);
    }

    try {
      await container.remove();
    } catch (error) {
      throw new ConflictException(`Error removing container ${error}`);
    }
    this.socketConnectionManagerService.remove_socket(cubeId);

    await this.databaseService.cube.update({
      where: {
        id: cubeId,
      },
      data: {
        status: 'stopped',
      },
    });

    return {
      message: 'Container Successfully remove and backedup',
      FsCheck: isUploaded,
    };
  }

  async fetchContainerFs(container_name: string, port: number) {
    const data = (await axios.get(`http://${container_name}:${port}/project`))
      .data as FileObject[];
    return data;
  }

  async run_container(cube: Cube) {
    const container_name = this.getContainerName(cube.id);
    const ports = {
      express_port: 0,
      other_port: 0,
    };

    await this.databaseService.cube.update({
      where: {
        id: cube.id,
      },
      data: {
        status: 'preparing',
      },
    });

    const { container, info } =
      await this.find_container_with_name(container_name);

    if (info.State !== this.container_state.running) {
      container.start();
      await this.delay(50 * 1000);
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

    this.socketConnectionManagerService.create_socket_connection({
      express_port: ports.express_port,
      other_port: ports.other_port,
      cube,
    });

    await this.databaseService.cube.update({
      where: {
        id: cube.id,
      },
      data: {
        status: 'running',
      },
    });

    return { info, ports };
  }

  async reinit_container(cube: Cube) {
    try {
      const containerName = this.getContainerName(cube.id);
      const { port1, container } = await this.create_container(cube, 1);
      const files = await this.s3Service.fetchFiles(cube.userId, cube.id);
      await container.start();
      await this.delay(7 * 1000);
      await axios.put(`http://${containerName}:${port1}/reinit`, { files });
      await this.delay(50 * 100);
      return { OK: 'OK' };
    } catch (error) {
      console.log(error);
      throw new GoneException(error);
    }
  }

  async get_network() {
    const networks = await this.docker.listNetworks();
    const info = networks.find((network) => network.Name === this.networkName);
    const network = this.docker.getNetwork(info.Id);
    return network;
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
    REINIT = 0,
  }: {
    image: string;
    containerName: string;
    port1: number;
    port2: number;
    REINIT?: 0 | 1;
    cube: Cube;
  }) {
    const options: Docker.ContainerCreateOptions = {
      Image: image,
      name: containerName,
      Tty: true,
      Hostname: containerName,
      Cmd: [
        `${port1}`,
        `${port2}`,
        `${cube.name}`,
        `${cube.type}`,
        `${cube.id}`,
        `${REINIT}`,
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

  getContainerName(cubeId: string) {
    return `project-${cubeId}`;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
