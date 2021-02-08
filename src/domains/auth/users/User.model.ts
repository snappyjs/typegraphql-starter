import { Role } from "../roles/Role.model";

export class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roles: Role[];
}