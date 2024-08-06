import { Server } from "http";
import * as Io from "socket.io";
import * as pty from "node-pty";
import { config } from "dotenv";

config();

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
    });

    try {
      this.listenToEvents(this.io);
    } catch (error) {
      console.error("Error initializing socket events:", error);
    }
  }

  private listenToEvents(io: Io.Server) {
    this.bash.onData((data) => {
      console.log(typeof data);
      console.log(data);
      this.io.emit("terminal:write", data);
    });
    io.on("connection", (socket) => {
      console.log("🔗 New client connected");

      socket.on("terminal:write", (data) => {
        this.bash.write(data + "\n"); // Ensure commands are executed
      });

      socket.on("disconnect", () => {
        console.log("🔌 Client disconnected");
      });
    });
  }
}
