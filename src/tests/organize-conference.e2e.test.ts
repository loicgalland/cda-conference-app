import request from 'supertest';
import app from "../infrastructure/express_api/app";
import {addDays, addHours} from "date-fns";
import {User} from "../entities/user.entity";
import {InMemoryUsersRepository} from "../adapters/in-memory-user-repository";
import {BasicAuthenticator} from "../services/basic-authenticator";


describe('Feature: Organize conference', () => {
    const johnDoe = new User({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
    })

    let repository: InMemoryUsersRepository

    beforeEach(async() => {
        repository = new InMemoryUsersRepository()
        await repository.create(johnDoe)
    })

    it('Should organize a conference', async () => {
        const token = Buffer.from(`${johnDoe.props.emailAddress}:${johnDoe.props.password}`).toString('base64')
        jest.spyOn(BasicAuthenticator.prototype, 'authenticate').mockResolvedValue(johnDoe)
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