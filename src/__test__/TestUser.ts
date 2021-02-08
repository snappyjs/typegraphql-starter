import faker from 'faker';
import { User } from '~/domains/auth/users/User.model';

export class TestUser implements User {
    id: number = faker.random.number();
    email: string = faker.internet.email();
    firstName: string = faker.name.firstName();
    lastName: string = faker.name.lastName();
    password: String = faker.internet.password();
}