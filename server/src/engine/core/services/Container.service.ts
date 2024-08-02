import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { configurations } from 'src/lib/config';

@Injectable()
export class ContainerService {
  docker: Docker;
  private image = configurations.container.user_container_image;
  private network: Docker.Network;
  private network_name = configurations.container.network;

  constructor() {
    this.docker = new Docker();

    this.docker.listNetworks().then((networks) => {
      networks.forEach(async (network) => {
        if (network.Name === this.network_name) {
          this.network = this.docker.getNetwork(network.Id);
        }
      });
    });
  }

  async spawn_container(containerName: string) {
    const container = await this.docker.createContainer({
      Image: this.image,
      Tty: true,
      name: containerName,
    });
    await this.network.connect({ Container: container.id });
    await container.start();
  }
}
