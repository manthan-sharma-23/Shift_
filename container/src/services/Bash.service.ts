import * as pty from "node-pty";
import { configurations } from "../config";
import os from "os";

export class BashService {
  private ptyProcess = pty.spawn(configurations.shell.type, [], {
    name: configurations.shell.name,
    cols: 100,
    rows: 40,
    cwd: os.homedir()+"/users",
    env: process.env,
  });

  constructor() {
    this.ptyProcess.onData((data) => {
      process.stdout.write(data);
      console.log(data);
    });
  }

  exec(command: string) {
    this.ptyProcess.write(command);
  }
}
