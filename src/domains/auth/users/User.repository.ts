import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "./User.model";
import { UserType } from "./User.type";

export interface UserRepository {
    save(user : Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
}

@Service()
export class UserRepositoryTypeORM implements UserRepository {

    @InjectRepository(UserType)
    private userRepo : Repository<UserType>

    findByEmail(email: string): Promise<User | undefined> {
        return this.userRepo.findOne({where: { email }, relations: ['roles']});
    }

    save(user: Partial<User>) : Promise<User> {
        return this.userRepo.save(user)
    }

}