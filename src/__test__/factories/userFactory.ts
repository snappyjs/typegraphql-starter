import { User } from "~/domains/auth/users/User.model";

import faker from 'faker';

/**
 * User data without a role. 
 * @param data Data to replace the default faked user information.
 */
export const userFactory = (data? : Partial<User>): Omit<User, 'id'> => ({
   firstName: faker.name.firstName(),
   lastName: faker.name.lastName(),
   email: faker.internet.email(),
   password: faker.internet.password(),
   roles: [],
   ...data
})