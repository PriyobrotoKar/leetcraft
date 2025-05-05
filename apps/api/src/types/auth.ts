import { Role } from '@leetcraft/db';

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
};
