import { Injectable } from '@nestjs/common';
import { Cube } from '@prisma/client';
import { exec } from 'child_process';
import { configurations } from 'src/lib/config';

@Injectable()
export class ContainerService {
  private image = configurations.container.user_container_image;
  private available_express_server_ports = new Map<number, string>();
  private available_other_ports = new Map<number, string>();

  async run_containers(cube: Cube) {
    const container_name = `project-${cube.id}`;

    const port1 = 3203;
    const port2 = 4034;

    const docker_run_project_container_command = `
      docker run -d --name ${container_name} \
      -p ${port1}:${port1} -p ${port2}:${port2} \
      ${this.image} ${port1} ${port2} \
      ${cube.name} ${cube.type} ${cube.id} --y
    `;

    exec(docker_run_project_container_command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }
}
