import { Request } from 'express';
import { User } from 'src/users/user.schema';

export default interface RequestWithUser extends Request {
  user: User;
}
