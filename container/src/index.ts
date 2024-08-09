import e from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { configurations } from "./config";
import { Server } from "http";
import { SocketService } from "./services/socket.service";
import { getDirStructure } from "./controllers/dir";

const app = e();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.get("/", (_, res) => {
  return res.json({ status: "ALIVE 200 🟢" });
});

app.get("/fs", async (_, res) => {
  const struct = await getDirStructure();
  return res.json(struct);
});

const server = new Server(app);

new SocketService(server);

server.listen(configurations.env.port, () => {
  //   console.info(configurations.factory.icon);
  console.log(
    `🐳 Playground Container Started for ${configurations.env.playgroundId} at ${configurations.env.port}`
  );
  console.log(configurations.fs.root);
});
