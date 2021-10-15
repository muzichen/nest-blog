import { Request } from 'express';
import { User } from 'src/users/user.entity';

export default interface RequestWithUser extends Request {
  user: User;
}
