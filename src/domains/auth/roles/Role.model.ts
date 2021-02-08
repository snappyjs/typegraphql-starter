import { User } from "../users/User.model";

export enum RoleLevel {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export interface Role {
  id: number;
  name: RoleLevel;
  users: User[];
}
