import { ApolloError } from "apollo-server-express";
import { IsEmail, IsString, Length } from "class-validator";
import { Arg, Field, InputType, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { Inject, Service } from "typedi";
import { AppError } from "~/domains/common/AppError";
import { ErrorCode } from "~/domains/common/ErrorCodes";
import { RoleLevel } from "../roles/Role.model";
import { RoleRepository, RoleRepositoryTypeORM } from "../roles/Role.repository";
import { User } from "./User.model";
import { UserRepository, UserRepositoryTypeORM } from "./User.repository";
import { UserService } from "./User.service";
import { UserType } from "./User.type";


@InputType()
class CreateUserInput {

    @IsString()
    @Length(2, 60)
    @Field({ description: ' The users first name.'})
    firstName: string;

    @IsString()
    @Length(2, 60)
    @Field({ description: 'The users last-/famil- name.'})
    lastName: string;

    @IsEmail()
    @Field({ description: 'The e-mail for the user.'})
    email: string;

    @IsString()
    @Length(8, 60)
    @Field({description: 'The password that the user wants to use.'})
    password: string;

    @IsString()
    @Length(8, 60)
    @Field({description: 'A password repeat-confirmation. Needs to match field "password"'})
    confirmPassword: string;

}

@Resolver(() => UserType)
@Service()
export class UserResolver {

    @Inject(() => UserService)
    private userService : UserService;

    @Mutation(() => String, { description: 'Creates a new user and returns the id.'})
    async createUser(@Arg('input') input : CreateUserInput) : Promise<string> {
        try {
            return await this.userService.createUser(input);
        } catch(err) {
            throw new ApolloError(err.message, err.code);
        }
    }

    @Mutation(() => String, { description: 'Login with a user. Returns a valid token.'})
    async login(@Arg('email') email: string, @Arg('password') password: string) {
        try {
            return await this.userService.login(email, password);
        } catch(err) {
            return new ApolloError(err.message, err.code);
        }
    }
}