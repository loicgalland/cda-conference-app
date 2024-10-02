import {User} from "../../user/entities/user.entity";


export const testUser = {
    johnDoe: new User({
        id: 'john-doe',
        emailAddress: "johndoe@gmail.com",
        password: "azerty"
    }),
    bob: new User({
        id: "bod",
        emailAddress: "bob@gmail.com",
        password: "azety"
    })
}