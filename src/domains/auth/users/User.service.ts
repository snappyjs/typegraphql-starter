import { Inject, Service } from "typedi";
import { AppError } from "~/domains/common/AppError";
import { ErrorCode } from "~/domains/common/ErrorCodes";
import { RoleRepository, RoleRepositoryTypeORM } from "../roles/Role.repository";
import { User } from "./User.model";
import { UserRepository, UserRepositoryTypeORM } from "./User.repository";
import bcrypt from 'bcrypt';
import { RoleLevel } from "../roles/Role.model";
import { generateToken } from "../utils/generateToken";

interface CreateUserInput {
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    email: string;
}

@Service()
export class UserService {

    @Inject(() => UserRepositoryTypeORM)
    private userRepo : UserRepository;

    @Inject(() => RoleRepositoryTypeORM)
    private roleRepo : RoleRepository;

    public async createUser(input : CreateUserInput) : Promise<string> {
        // Validate confirmPassword
        if(input.password !== input.confirmPassword) throw new AppError(ErrorCode.PASSWORD_DOES_NOT_MATCH);

        // Make sure that the user does not exist.
        if(await this.userRepo.findByEmail(input.email)) throw new AppError(ErrorCode.EMAIL_ALREADY_EXISTS);

        // Encrypt password
        const encPwd = await bcrypt.hash(input.password, await bcrypt.genSalt(15));

        // Add the client role
        const clientRole = await this.roleRepo.findByLevel(RoleLevel.CLIENT);
        if(!clientRole) throw new AppError(ErrorCode.CLIENT_ROLE_MISSING);

        const user = await this.userRepo.save({
            ...input,
            password: encPwd,
            roles: [clientRole],
        });

        return generateToken(user);
    }

    public async login(email: string, password: string) {
        const user = await this.userRepo.findByEmail(email);
        if(!user || !(await bcrypt.compare(password, user.password))) throw new AppError(ErrorCode.USER_OR_PASSWORD, 'Email or password is incorrect.');
        return generateToken(user);
    }

}