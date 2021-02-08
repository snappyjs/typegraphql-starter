import { gql } from "apollo-server-express";
import Container from "typedi";
import { ErrorCode } from "~/domains/common/ErrorCodes";
import { createTestServerContext, TestServerContext } from "~/__test__/createTestServerContext";
import { userFactory } from "~/__test__/factories/userFactory";
import { RoleLevel } from "../../roles/Role.model";
import { RoleRepository, RoleRepositoryTypeORM } from "../../roles/Role.repository";
import { UserRepository, UserRepositoryTypeORM } from "../User.repository";

const CREATE_USER = gql`
mutation createUser($firstName: String!, $lastName: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    createUser(input: {
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        password: $password,
        confirmPassword: $confirmPassword
    })
}
`;

const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

describe('User : Resolver', () => {
    let ctx : TestServerContext;
    let userRepo: UserRepository;

    beforeEach(async() => {
        ctx = await createTestServerContext();
        userRepo = Container.get<UserRepository>(UserRepositoryTypeORM);
    })

    afterEach(async () => {
        await ctx.close();
    })

    it('should not allow duplicate user to be created.', async () => {
        const user = userFactory();
        await userRepo.save(user);

        const res = await ctx.gql.mutate({
            mutation: CREATE_USER,
            variables: {
                ...user,
                confirmPassword: user.password
            }
        });

        expect(res.errors).toBeDefined();
        expect(res.errors![0].extensions!.code).toEqual(ErrorCode.EMAIL_ALREADY_EXISTS);
    });

    it('should successfully create a new user', async () => {
        const userModel = userFactory();
        const res = await ctx.gql.mutate({
            mutation: CREATE_USER,
            variables: {
               ...userModel, 
               confirmPassword: userModel.password
            } 
        })

       const id = res.data.createUser;
       expect(id).toBeTruthy();

       const roleRepo = Container.get<RoleRepository>(RoleRepositoryTypeORM);
       const clientUsers = await roleRepo.findUsersByLevel(RoleLevel.CLIENT);
       expect(clientUsers).toHaveLength(1);
    });

    it('should successfully login a user', async () => {
        const user = userFactory();
        await ctx.gql.mutate({
            mutation: CREATE_USER,
            variables: {
                ...user,
                confirmPassword: user.password
            }
        });

        const res = await ctx.gql.mutate({
            mutation: LOGIN,
            variables: {
                email: user.email,
                password: user.password
            }
        });
        expect(res.data.login).toBeDefined();
    });

    it('should not allow invalid email.', async () => {
       const res = await ctx.gql.mutate({
           mutation: LOGIN,
           variables: {
               email: 'invalid@mail.com',
               password: 'invalid'
           }
       }) 

       expect(res.errors![0].extensions!.code).toEqual(ErrorCode.USER_OR_PASSWORD);
    });

    it('should not allow invalid password.', async () => {
        const user = userFactory();
        await ctx.gql.mutate({
            mutation: CREATE_USER,
            variables: {
                ...user,
                confirmPassword: user.password
            }
        });


        const res = await ctx.gql.mutate({
            mutation: LOGIN,
            variables: {
                email: user.email,
                password: 'invalid'
            }
        });

        expect(res.errors![0].extensions!.code).toEqual(ErrorCode.USER_OR_PASSWORD);
    });
})