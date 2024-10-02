import {ChangeSeats} from "../../conference/usecases/change-seats";
import {InMemoryConferenceRespository} from "../../conference/adapters/in-memory-conference-repository";
import {testConference} from "../../conference/tests/conference-seeds";
import {testUser} from "../../user/tests/user-seeds";

describe('Feature change the seats number', () => {
    async function expectSeatsUnchanged(){
        const fetchedConference = await repository.findById(testConference.conference1.props.id)
        expect(fetchedConference?.props.seats).toEqual(50)
    }



    let repository:InMemoryConferenceRespository;
    let useCase: ChangeSeats;

    beforeEach(async () =>{
        repository = new InMemoryConferenceRespository();
        await repository.create(testConference.conference1);
        useCase = new ChangeSeats(repository);
    })

    describe('Scenario: Happy path', () => {
        it('Should change the number of seats', async() => {
            await useCase.execute({
                user: testUser.johnDoe,
                conferenceId: testConference.conference1.props.id,
                seats: 100
            })

            const fetchedConference = await repository.findById(testConference.conference1.props.id)
            expect(fetchedConference!.props.seats).toEqual(100)
        })
    })
    describe('Scenario: Conference does not exist', () => {
        it('Should fail', async () => {
            await expect(useCase.execute({
                user: testUser.johnDoe,
                conferenceId: 'non-existing-conference',
                seats: 500,
            })).rejects.toThrow('Conference not found');

            await expectSeatsUnchanged();
        })
    });
    describe('Scenario: update someone else conference', () => {
        it('Should fail', async() => {
            await expect(useCase.execute({
                user: testUser.bob,
                conferenceId: testConference.conference1.props.id,
                seats: 500,
            })).rejects.toThrow('You are not allowed to update this conference');

            await expectSeatsUnchanged();
        })
    })
    describe('Scenario: number of seats >= 1000', () => {
        it('Should fail', async() => {
            await expect(useCase.execute({
                user: testUser.johnDoe,
                conferenceId: testConference.conference1.props.id,
                seats: 1001,
            })).rejects.toThrow('The conference must have a maximum of 1000 seat and at least 20 seats');

            await expectSeatsUnchanged();
        })
    })
    describe('Scenario: number of seats <= 20', () => {
        it('Should fail', async() => {
            await expect(useCase.execute({
                user: testUser.johnDoe,
                conferenceId: testConference.conference1.props.id,
                seats: 15,
            })).rejects.toThrow('The conference must have a maximum of 1000 seat and at least 20 seats');

            await expectSeatsUnchanged();
        })
    })
})