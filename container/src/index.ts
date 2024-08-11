import e from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { configurations } from "./config";
import { Server } from "http";
import { SocketService } from "./services/socket.service";
import { router } from "./api/routes";

const app = e();
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

// http routes
app.use(router);

const server = new Server(app);

// socket server
new SocketService(server);

server.listen(configurations.env.port, () => {
  console.log(
    `🐳 Playground Container Started for ${configurations.env.playgroundId} at ${configurations.env.port}`
  );
});
