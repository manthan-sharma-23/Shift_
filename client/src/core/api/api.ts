import { configuration } from "../config/config";
import axios from "axios";
import { AuthenticateUser, LoggedUser, User } from "../types/user.types";
import { CreateCubeInput, Cube, Ports } from "../types/cube.types";

export default class Server {
  private server_url: string;
  private token: string | null;

  constructor() {
    this.server_url = configuration.server.http_url;
    this.token = "Bearer " + window.localStorage.getItem("token");
  }

  // user controllers
  private get_user = async (): Promise<User> => {
    const data = (
      await axios.get(this.server_url + "/v1/user/", {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as User;
    return data;
  };

  private login_user = async (
    user: AuthenticateUser
  ): Promise<LoggedUser & { isLoggedIn: boolean }> => {
    console.log("route -- ", this.server_url);

    const data = (await axios.post(this.server_url + "/v1/user/login", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      this.token = "Bearer " + data.token;
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  };

  private register_user = async (
    user: AuthenticateUser
  ): Promise<LoggedUser & { isLoggedIn: boolean }> => {
    const data = (await axios.post(this.server_url + "/v1/user/register", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      this.token = "Bearer " + data.token;
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  };

  // cube controllers
  private get_user_cubes = async (): Promise<Cube[]> => {
    const data = (
      await axios.get(this.server_url + "/v1/cube/", {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as Cube[];

    return data;
  };

  private create_user_cube = async (input: CreateCubeInput): Promise<Cube> => {
    const data = (
      await axios.post(this.server_url + "/v1/cube/create-cube", input, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as Cube;
    return data;
  };

  private run_cube = async (input: { cubeId: string }) => {
    const data = (
      await axios.put(this.server_url + "/v1/cube/run-cube", input, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as Ports;

    return data;
  };

  private burn_cube = async ({ cubeId }: { cubeId: string }) => {
    const data = (
      await axios.delete(this.server_url + `/v1/cube/stop/${cubeId}`, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data;

    return data;
  };
  private reinit_cube = async ({ cubeId }: { cubeId: string }) => {
    const data = (
      await axios.put(this.server_url + `/v1/cube/reinit/${cubeId}`, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data;

    return data;
  };

  get user() {
    return {
      get_user: this.get_user,
      login_user: this.login_user,
      register_user: this.register_user,
    };
  }

  get cube() {
    return {
      get_user_cubes: this.get_user_cubes,
      create_user_cube: this.create_user_cube,
      run_cube: this.run_cube,
      burn_cube: this.burn_cube,
      reinit_cube: this.reinit_cube,
    };
  }
}
