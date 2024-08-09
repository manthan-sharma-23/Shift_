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
        socket.emit("terminal:write", data);
      });

      socket.on("terminal:write", (data) => {
        this.bash.write(data + "\n");
      });

      socket.on("get:filesystem", async (_, cb: SocketCallback) => {
        const struct = await getDirStructure();
        cb(struct);
      });

      socket.on("get:file", async (path, cb: SocketCallback) => {
        const fullPath = configurations.fs.project + path;
        const data = await fs.readFile(fullPath, "utf-8");
        cb(data);
      });

      socket.on("disconnect", () => {
        console.log("🔌 Client disconnected");
      });
    });
  }
}
