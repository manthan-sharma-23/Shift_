import { configuration } from "../config/config";
import axios from "axios";
import { AuthenticateUser, LoggedUser, User } from "../types/user.types";

export default class Server {
  private server_url = configuration.server.http_url;
  private token = "Bearer " + window.localStorage.getItem("token");

  async get_user() {
    const data = (
      await axios.get(this.server_url + "/v1/user/", {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as User;

    return data;
  }
  async login_user(user: AuthenticateUser) {
    const data = (await axios.post(this.server_url + "/v1/user/login", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  }
  async register_user(user: AuthenticateUser) {
    const data = (await axios.post(this.server_url + "/v1/user/register", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  }
}
