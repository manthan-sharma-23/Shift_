import { configuration } from "../config/config";
import axios from "axios";
import { AuthenticateUser, LoggedUser, User } from "../types/user.types";
import { CreateCubeInput, Cube } from "../types/cube.types";

export default class Server {
  private server_url = configuration.server.http_url;
  private token = "Bearer " + window.localStorage.getItem("token");

  // user controllers
  private async get_user() {
    const data = (
      await axios.get(this.server_url + "/v1/user/", {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as User;
    return data;
  }
  private async login_user(user: AuthenticateUser) {
    const data = (await axios.post(this.server_url + "/v1/user/login", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  }
  private async register_user(user: AuthenticateUser) {
    const data = (await axios.post(this.server_url + "/v1/user/register", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  }

  // cube controllers
  private async get_user_cubes() {
    const data = (
      await axios.get(this.server_url + "/v1/cube/", {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as Cube[];

    return data;
  }
  private async create_user_cube(input: CreateCubeInput) {
    const data = (
      await axios.post(this.server_url + "/v1/cube/create-cube", input, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data;
    return data;
  }

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
    };
  }
}
