import {NextFunction, Request, Response} from "express";
import {User} from "../../../user/entities/user.entity";
import {ValidatorRequest} from "../../../infrastructure/express_api/utils/validate-request";
import {
    ChangeDateInput,
    ChangeSeatsInput,
    CreateConferenceInput
} from "../../../infrastructure/express_api/dto/conference.dto";
import {AwilixContainer} from "awilix";
import {ChangeSeats} from "../../../conference/usecases/change-seats";
import {ChangeDates} from "../../../conference/usecases/change-date";


export const organizeConference = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as CreateConferenceInput;

            const {errors, input} = await ValidatorRequest(CreateConferenceInput, body);

            if(errors) {
                return res.jsonError(errors, 400)
            };

            const result = await container.resolve('organizeConference').execute({
                user: req.user as User,
                title: input.title,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
                seats: input.seats,
            });
            return res.jsonSuccess({id: result.id}, 201)
        } catch (error) {
            next(error);
        }
    };
}

export const changeSeats = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const body = req.body as ChangeSeats;

            const {errors, input} = await ValidatorRequest(ChangeSeatsInput, body)

            if(errors) res.jsonError(errors, 400)

            await container.resolve('changeSeats').execute({
                user: req.user,
                conferenceId: id,
                seats: input.seats,
            })

            return res.jsonSuccess({message: 'The number of seats was changed correctly'}, 200)

        } catch (error) {
            next(error);
        }
    }
}

export const changeDate = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;

            const {errors, input} = await ValidatorRequest(ChangeDateInput, req.body)

            if(errors) res.jsonError(errors, 400)


            await container.resolve('changeDates').execute({
                user: req.user,
                conferenceId: id,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
            })
            return res.jsonSuccess({message: 'The date was changed correctly'}, 200)
        } catch(error) {
            next(error)
        }
    }
}