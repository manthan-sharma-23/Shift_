import { Server } from "http";
import * as Io from "socket.io";
import * as pty from "node-pty";
import { config } from "dotenv";
import { configurations } from "../config";
import { getDirStructure } from "../controllers/dir";
import { promises as fs } from "fs";

config();

interface SocketCallback {
  (response: any): void;
}

export class SocketService {
  private io: Io.Server;
  private bash;

  constructor(server: Server) {
    this.io = new Io.Server(server, {
      cors: {
        origin: "*",
      },
    });
    console.log("🔌 Socket server initialized successfully");

    this.bash = pty.spawn("bash", [], {
      name: "vt100",
      rows: 40,
      cols: 30,
      env: process.env,
      cwd: configurations.fs.root + "/project",
    });

    try {
      this.listenToEvents(this.io);
    } catch (error) {
      console.error("Error in socket events:", error);
    }
  }

  private listenToEvents(io: Io.Server) {
    io.on("connection", (socket) => {
      console.log("🔗 New client connected ", socket.id);

      this.bash.onData((data) => {
        console.log(data);

        socket.emit("terminal:written", data);
      });

      socket.on("terminal:write", (data) => {
        console.log("Terminal data recv ", data);

        this.bash.write(data + "\n");
      });

      socket.on("get:fs", async (data: any, cb: SocketCallback) => {
        console.log("Get file system", data);

        const struct = await getDirStructure();
        // return struct;
        cb(struct);
      });

      socket.on("get:file", async (path, cb: SocketCallback) => {
        const fullPath = configurations.fs.project + path;
        const data = await fs.readFile(fullPath, "utf-8");
        cb(data);
      });

      socket.on("disconnect", () => {
        socket.disconnect();
        console.log("🔌 Client disconnected");
      });
    });
  }
}
