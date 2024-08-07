import { config } from "dotenv";
import path from "path";

config();
function GET_PORT() {
  const number = process.env.PORT;

  if (!number) {
    throw new Error("Couldn't load PORT variables from ENV");
  }

  return Number(number);
}

function PLAYGROUND_ID() {
  const playgroundId = process.env.PLAYGROUND_ID;

  if (!playgroundId) {
    throw new Error("Couldn't load PLAYGROUND_ID variables from ENV");
  }

  return playgroundId;
}
function PROJECT_NAME() {
  const playgroundId = process.env.PROJECT_NAME;

  if (!playgroundId) {
    throw new Error("Couldn't load PROJECT NAME variables from ENV");
  }

  return playgroundId;
}
function PROJECT_TYPE() {
  const playgroundId = process.env.PROJECT_TYPE;

  if (!playgroundId) {
    throw new Error("Couldn't load PROJECT TYPE NAME variables from ENV");
  }

  return playgroundId;
}

const docker_icon = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⣶⣶⣶⠀⣶⣶⣶⣶⠀⢰⣶⣶⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⣿⣿⣿⣿⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⣤⣤⣤⠀⢠⣤⣤⣤⠀⣤⣤⣤⣤⠀⢠⣤⣤⣤⠀⣰⣿⣿⣦⡀⠀⠀⠀⠀
⠀⢸⣿⣿⣿⠀⢸⣿⣿⣿⠀⣿⣿⣿⣿⠀⢸⣿⣿⣿⠀⣿⣿⠹⣿⣷⣀⠀⠀⠀
⠀⠘⠛⠛⠛⠀⠘⠛⠛⠛⠀⠛⠛⠛⠛⠀⠘⠛⠛⠛⢀⣿⣿⡀⠙⠿⠿⣿⣶⣆
⣴⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣿⣿⣿⠟⢁⣤⣴⣶⣾⡿⠋
⣿⣿⣿⣛⣛⣛⣛⣿⣟⣛⣛⣻⣿⣟⣛⣛⣻⣿⣟⣋⣉⣠⣤⣾⣿⣟⣻⣍⠀⠀
⢹⣿⣿⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⠋⠀⠀⠀⠀⠀
⠈⢻⣿⣿⣿⡿⠿⠿⠿⠛⠉⠀⠀⠀⠀⠀⢀⣠⣴⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠙⢿⣿⣿⣶⣦⣤⣤⣤⣤⣤⣴⣶⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠙⠛⠛⠿⠿⠿⠿⠿⠛⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

export const configurations = {
  env: {
    port: GET_PORT(),
    playgroundId: PLAYGROUND_ID(),
    project: {
      // projectName: PROJECT_NAME(),
      // projectType: PROJECT_TYPE(),
    },
  },
  factory: {
    icon: docker_icon,
  },
  shell: {
    type: "bash",
    name: "xterm-color",
  },
  fs: {
    root: path.join(__dirname + "/../"),
    project: path.join(__dirname + "/../project"),
  },
};
