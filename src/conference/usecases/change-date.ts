import {User} from "../../user/entities/user.entity";
import {Executable} from "../../core/executable.interface";
import {IConferenceRepository} from "../../conference/ports/conference-repository.interface";
import {IDateGenerator} from "../../core/ports/date-generator.interface";

type RequestChangeDate = {
    user: User,
    conferenceId: string,
    startDate: Date,
    endDate: Date,
};

type ResponseChangeDate = void;

export class ChangeDates implements Executable<RequestChangeDate, ResponseChangeDate> {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly dateGenerator: IDateGenerator,
    ) {
    }

    async execute({user, conferenceId, startDate, endDate}: RequestChangeDate) {
        const conference = await this.repository.findById(conferenceId)

        if(!conference) throw new Error('Conference not found');

        if(conference.props.organizerId !== user.props.id) {
            throw new Error('You are not allowed to update this conference')
        }

        conference.update({
            startDate,
            endDate
        })

        if(conference.isToClosed(this.dateGenerator.now())) throw new Error('The conference must happen in at least 3 days')

        if(conference.isTooLong()) throw new Error('The conference is too long (> 3 hours)')

        await this.repository.update(conference!)
    }
}