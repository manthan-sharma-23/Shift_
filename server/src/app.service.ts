import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as Docker from 'dockerode';

@Injectable()
export class AppService {
  private docker: Docker;
  private network: Docker.Network;
  public network_name = 'server_lynx-network';

  constructor() {
    this.docker = new Docker();
    this.docker.listNetworks().then((networks) => {
      networks.forEach(async (network) => {
        if (network.Name === this.network_name) {
          const network_ = this.docker.getNetwork(network.Id);
          this.network = network_;
        }
      });
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async createUserContainer(req: Request): Promise<string> {
    const containerId = req.body.containerId as string;

    const container = await this.docker.createContainer({
      Image: 'manthan23s/lynx-user-container',
      name: `user-container-${containerId}`,
      Tty: true,
    });

    await this.network.connect({
      Container: container.id,
    });

    await container.start();

    return `New Container spinned up with id ${containerId}`;
  }
}
