import {User} from "../../user/entities/user.entity";

export interface IUserRepository {
    create(user: User): Promise<void>;
    findByEmailAddress(emailAddress: string): Promise<User | null>;
}