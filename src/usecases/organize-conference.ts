import {IConferenceRepository} from "../ports/conference-repository.interface";
import {Conference} from "../entities/conference.entity";
import {IIdGenerator} from "../ports/id-generator.interface";
import {IDateGenerator} from "../ports/date-generator.interface";
import {differenceInDays} from "date-fns";
import {User} from "../entities/user.entity";


export class OrganizeConference {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly idGenerator: IIdGenerator,
        private readonly dateGenerator: IDateGenerator,
    ) {}

     async execute(data: {user :User ,title: string, startDate: Date, endDate: Date, seats: number}) {
        const id = this.idGenerator.generate();

        const newConference = new Conference({
            id,
            organizerId: data.user.props.id,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            seats: data.seats
        })

         if (newConference.isToClosed(this.dateGenerator.now())){
             throw new Error("The conference must happens in at least 3" +
                 " days");
         }

         if(newConference.hasTooManySeats()){
             throw new Error('The conference has too many seats (< 1000)')
         }

         if (newConference.hasNotEnoughSeat()){
             throw new Error('The conference has not enough seats (>= 20)')
         }

         if(newConference.isTooLong()){
             throw new Error('The conference is too long')
         }

        await this.repository.create(newConference);

         return {id};
     }
}