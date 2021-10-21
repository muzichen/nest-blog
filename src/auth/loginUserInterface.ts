import { User } from 'src/users/user.schema';

export default interface ILoginUser {
  user: User;
  token: string;
  refreshToken: string;
}
