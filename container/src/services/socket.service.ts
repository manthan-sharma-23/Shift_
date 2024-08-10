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

        this.bash.write(data);
      });

      socket.on("get:fs", async (data: any, cb: SocketCallback) => {
        console.log("Get file system", data);

        const struct = await getDirStructure();
        cb(struct);
      });

      socket.on("get:file", async (path, cb: SocketCallback) => {
        const fullPath = configurations.fs.project + path;
        const data = await fs.readFile(fullPath, "utf-8");
        cb(data);
      });

      socket.on("change:file:content", async ({ path, file }) => {
        const fullPath = configurations.fs.project + path;
        await fs.writeFile(fullPath, file);
      });

      socket.on("create:file", async (data) => {
        const { path, name } = data;
        const fullPath = configurations.fs.project + path + "/" + name;
        console.log(fullPath);

        await fs.writeFile(fullPath, "");
        this.sendFileTree(socket);
      });

      socket.on("create:dir", async ({ name, path }) => {
        const fullPath = configurations.fs.project + path + "/" + name;
        await fs.mkdir(fullPath);
        this.sendFileTree(socket);
      });

      socket.on("delete:file", async ({ path }) => {
        const fullPath = configurations.fs.project + path;
        try {
          await fs.rm(fullPath, { recursive: true, force: true });
        } catch (err) {
          console.error(`Failed to delete ${fullPath}:`, err);
        }
        this.sendFileTree(socket);
      });

      socket.on("disconnect", () => {
        socket.disconnect();
        console.log("🔌 Client disconnected");
      });
    });
  }
  private async sendFileTree(socket: Io.Socket) {
    const tree = await getDirStructure();
    socket.emit("file:tree", tree);
  }
}
