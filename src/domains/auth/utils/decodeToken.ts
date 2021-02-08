import jwt from 'jsonwebtoken';
import { Role } from '../roles/Role.model';

type UserContext = {
    id: number;
    roles: string[];
}

export const decodeToken = (token: string) : UserContext => {
    return jwt.verify(token, 'SECRET') as UserContext;
}