import {User} from "../../user/entities/user.entity";
import {IConferenceRepository} from "../../conference/ports/conference-repository.interface";
import {Executable} from "../../core/executable.interface";

type RequestChangeSeats = {
    user: User,
    conferenceId: string,
    seats: number
}
type ResponseChangeSeats = void


export class ChangeSeats implements Executable<RequestChangeSeats, ResponseChangeSeats> {
    constructor(private readonly repository: IConferenceRepository) {}

    async execute({user, conferenceId, seats}){
        const conference = await this.repository.findById(conferenceId);

        if(!conference) throw new Error('Conference not found');
        if(user.props.id !== conference.props.organizerId) throw new Error('You are not allowed to update this' +
            ' conference');

        conference.update({seats});

        if(conference.hasNotEnoughSeat() || conference.hasTooManySeats()){
            throw new Error('The conference must have a maximum of 1000 seat and at least 20 seats')
        }

        await this.repository.update(conference);
    }
}