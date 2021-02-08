import { User } from "../users/User.model"
import jwt from 'jsonwebtoken';

export const generateToken = (user : User) : string => {
    // TODO: Make sure to set a real secret for the token.
    return jwt.sign({id: user.id, roles: user.roles.map(r => r.name)}, 'SECRET');
}