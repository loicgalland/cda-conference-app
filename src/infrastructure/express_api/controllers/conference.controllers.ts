import {RandomIdGenerator} from "../../../adapters/random-id-generator";
import {CurrentDateGenerator} from "../../../adapters/current-date-generator";
import {InMemoryConferenceRespository} from "../../../adapters/in-memory-conference-repository";
import {OrganizeConference} from "../../../usecases/organize-conference";
import {NextFunction, Request, Response} from "express";
import {User} from "../../../entities/user.entity";
import {CreateConferenceInput} from "../../dto/conference.dto";

const idGenerator = new RandomIdGenerator();
const currentDateGenerator = new CurrentDateGenerator();
const repository = new InMemoryConferenceRespository();
const userCase = new OrganizeConference(repository, idGenerator, currentDateGenerator);



export const organizeConference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, seats, startDate, endDate } = req.body as CreateConferenceInput;
        const result = await userCase.execute({
            user: new User({ id: 'john-doe' }),
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            seats,
        });
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};