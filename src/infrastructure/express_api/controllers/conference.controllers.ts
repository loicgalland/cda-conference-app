import {RandomIdGenerator} from "../../../core/adapters/random-id-generator";
import {CurrentDateGenerator} from "../../../core/adapters/current-date-generator";
import {InMemoryConferenceRespository} from "../../../conference/adapters/in-memory-conference-repository";
import {OrganizeConference} from "../../../conference/usecases/organize-conference";
import {NextFunction, Request, Response} from "express";
import {User} from "../../../user/entities/user.entity";
import {CreateConferenceInput} from "../../dto/conference.dto";
import {ValidatorRequest} from "../../../infrastructure/express_api/utils/validate-request";

const idGenerator = new RandomIdGenerator();
const currentDateGenerator = new CurrentDateGenerator();
const repository = new InMemoryConferenceRespository();
const userCase = new OrganizeConference(repository, idGenerator, currentDateGenerator);



export const organizeConference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as CreateConferenceInput;

        const {errors, input} = await ValidatorRequest(CreateConferenceInput, body);

        if(errors) {
            return res.jsonError(errors, 400)
        };

        const result = await userCase.execute({
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