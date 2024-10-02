import {User} from "../../user/entities/user.entity";
import {ChangeSeats} from "../../conference/usecases/change-seats";
import {Conference} from "../../conference/entities/conference.entity";
import {addDays, addHours} from "date-fns";
import {InMemoryConferenceRespository} from "../../conference/adapters/in-memory-conference-repository";

describe('Feature change the seats number', () => {
    async function expectSeatsUnchanged(){
        const fetchedConference = await repository.findById(conference.props.id)
        expect(fetchedConference?.props.seats).toEqual(50)
    }

    const johnDoe = new User({
        id: 'john-doe',
        emailAddress: "johndoe@gmail.com",
        password: "azerty"
    })
    const bod = new User({
        id: "bod",
        emailAddress: "bob@gmail.com",
        password: "azety"
    })

    const conference = new Conference({
        id: 'id-1',
        organizerId: johnDoe.props.id,
        title: 'My first conference',
        seats: 50,
        startDate: addDays(new Date(), 4),
        endDate: addDays(addHours(new Date(), 2), 4)
    })

    let repository:InMemoryConferenceRespository;
    let useCase: ChangeSeats;

    beforeEach(async () =>{
        repository = new InMemoryConferenceRespository();
        await repository.create(conference);
        useCase = new ChangeSeats(repository);
    })

    describe('Scenario: Happy path', () => {
        it('Should change the number of seats', async() => {
            await useCase.execute({
                user: johnDoe,
                conferenceId: conference.props.id,
                seats: 100
            })

            const fetchedConference = await repository.findById(conference.props.id)
            expect(fetchedConference!.props.seats).toEqual(100)
        })
    })
    describe('Scenario: Conference does not exist', () => {
        it('Should fail', async () => {
            await expect(useCase.execute({
                user: johnDoe,
                conferenceId: 'non-existing-conference',
                seats: 500,
            })).rejects.toThrow('Conference not found');

            await expectSeatsUnchanged();
        })
    });
    describe('Scenario: update someone else conference', () => {
        it('Should fail', async() => {
            await expect(useCase.execute({
                user: bod,
                conferenceId: conference.props.id,
                seats: 500,
            })).rejects.toThrow('You are not allowed to update this conference');

            await expectSeatsUnchanged();
        })
    })
    describe('Scenario: number of seats >= 1000', () => {
        it('Should fail', async() => {
            await expect(useCase.execute({
                user: johnDoe,
                conferenceId: conference.props.id,
                seats: 1001,
            })).rejects.toThrow('The conference must have a maximum of 1000 seat and at least 20 seats');

            await expectSeatsUnchanged();
        })
    })
    describe('Scenario: number of seats <= 20', () => {
        it('Should fail', async() => {
            await expect(useCase.execute({
                user: johnDoe,
                conferenceId: conference.props.id,
                seats: 15,
            })).rejects.toThrow('The conference must have a maximum of 1000 seat and at least 20 seats');

            await expectSeatsUnchanged();
        })
    })
})