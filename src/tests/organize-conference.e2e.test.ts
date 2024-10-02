import request from 'supertest';
import app from "../infrastructure/express_api/app";
import {addDays, addHours} from "date-fns";
import {User} from "../user/entities/user.entity";
import {InMemoryUsersRepository} from "../user/adapters/in-memory-user-repository";
import {BasicAuthenticator} from "../user/services/basic-authenticator";
import container from "../infrastructure/express_api/config/dependency-injection";


describe('Feature: Organize conference', () => {
    const johnDoe = new User({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
    })

    let repository: InMemoryUsersRepository

    beforeEach(async() => {
        repository = container.resolve('userRepository');
        await repository.create(johnDoe)
    })

    it('Should organize a conference', async () => {
        const token = Buffer.from(`${johnDoe.props.emailAddress}:${johnDoe.props.password}`).toString('base64')
        const result = await request(app)
            .post('/conference')
            .set('Authorization', `Basic ${token}`)
            .send({
                title: 'My first conference',
                seats: 100,
                startDate: addDays(new Date(), 4).toISOString(),
                endDate: addDays(addHours(new Date(), 2), 4).toISOString(),
            });

        expect(result.status).toBe(201);
        expect(result.body.data).toEqual({id: expect.any(String)});
    })
})