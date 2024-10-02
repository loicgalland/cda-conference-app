import {UserFixture} from "../../tests/utils/user-fixture";
import {User} from "../../user/entities/user.entity";


export const e2eUser = {
    johnDoe: new UserFixture(new User({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
    })),
}