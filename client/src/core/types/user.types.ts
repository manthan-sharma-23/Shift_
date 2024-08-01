export interface User {
  email: string;
  image?: string;
  name?: string;
  id: string;
  createdAt: Date;
}

export type token = string;
export interface AuthenticateUser {
  name?: string;
  email: string;
  password: string;
}

export interface LoggedUser {
  token: token;
  message: string;
}
