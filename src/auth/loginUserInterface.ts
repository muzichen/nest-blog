import { User } from 'src/users/user.schema';

export interface RefreshUser {
  user: User;
  token: string;
}

export interface LoginUser extends RefreshUser {
  refreshToken: string;
}
