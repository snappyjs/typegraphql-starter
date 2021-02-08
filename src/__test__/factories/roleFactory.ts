import { Role, RoleLevel } from "~/domains/auth/roles/Role.model";
import faker from 'faker';

export const roleFactory = (data? : Partial<Role>) : Omit<Role, 'id'> => ({
    name: faker.random.arrayElement(Object.values(RoleLevel)),
    users: [],
    ...data
})