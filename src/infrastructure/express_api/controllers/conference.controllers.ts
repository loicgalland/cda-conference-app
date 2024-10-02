import {NextFunction, Request, Response} from "express";
import {User} from "../../../user/entities/user.entity";
import {ValidatorRequest} from "../../../infrastructure/express_api/utils/validate-request";
import {CreateConferenceInput} from "../../../infrastructure/express_api/dto/conference.dto";
import {AwilixContainer} from "awilix";


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