export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

import { Request } from "express";
export interface AuthorizedRequest extends Request {
  userId: string;
}
