import {RandomIdGenerator} from "../../../adapters/random-id-generator";
import {CurrentDateGenerator} from "../../../adapters/current-date-generator";
import {InMemoryConferenceRespository} from "../../../adapters/in-memory-conference-repository";
import {OrganizeConference} from "../../../usecases/organize-conference";
import {NextFunction, Request, Response} from "express";
import {User} from "../../../entities/user.entity";
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
            return res.status(400).json({errors})
        };

        const result = await userCase.execute({
            user: new User({ id: 'john-doe' }),
            title: input.title,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            seats: input.seats,
        });
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};