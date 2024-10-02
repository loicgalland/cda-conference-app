import {differenceInDays, differenceInHours} from "date-fns";

type ConferenceProps = {
    id: string,
    organizerId: string,
    title: string,
    startDate: Date,
    endDate: Date,
    seats: number,
}

export class Conference {
    public initialState: ConferenceProps
    public props: ConferenceProps

    constructor(data: ConferenceProps) {
        this.initialState = {...data}
        this.props = {...data}
        Object.freeze(this.initialState)
    }

    isToClosed(now: Date): boolean {
        return differenceInDays(this.props.startDate, now) < 3;
    }

    hasTooManySeats(): boolean {
        return this.props.seats > 1000;
    }

    hasNotEnoughSeat(): boolean {
        return this.props.seats < 20;
    }

    isTooLong(): boolean{
        return differenceInHours(this.props.endDate, this.props.startDate) > 3;
    }

    update(data: Partial<ConferenceProps>){
        this.props = {...this.props, ...data};
    }

    commit(): void {
        this.initialState = this.props;
    }
}