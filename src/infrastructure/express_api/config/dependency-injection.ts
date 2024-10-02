import {asClass, asValue, createContainer} from "awilix";
import {InMemoryConferenceRespository} from "../../../conference/adapters/in-memory-conference-repository";
import {RandomIdGenerator} from "../../../core/adapters/random-id-generator";
import {CurrentDateGenerator} from "../../../core/adapters/current-date-generator";
import {InMemoryUsersRepository} from "../../../user/adapters/in-memory-user-repository";
import {OrganizeConference} from "../../../conference/usecases/organize-conference";
import {BasicAuthenticator} from "../../../user/services/basic-authenticator";
import {IUserRepository} from "../../../user/ports/user-repository.interface";
import {IDateGenerator} from "../../../core/ports/date-generator.interface";
import {IIdGenerator} from "../../../core/ports/id-generator.interface";
import {IConferenceRepository} from "../../../conference/ports/conference-repository.interface";

const container = createContainer();

container.register({
    conferenceRepository: asClass(InMemoryConferenceRespository).singleton(),
    idGenerator: asClass(RandomIdGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    userRepository: asClass(InMemoryUsersRepository).singleton(),
})

const conferenceRepository = container.resolve('conferenceRepository') as IConferenceRepository;
const idGenerator = container.resolve('idGenerator') as IIdGenerator
const dateGenerator = container.resolve('dateGenerator') as IDateGenerator
const userRepository = container.resolve('userRepository') as IUserRepository

container.register({
    organizeConferenceUsecase: asValue(new OrganizeConference(
        conferenceRepository, idGenerator, dateGenerator
    )),
    authenticator: asValue(new BasicAuthenticator(userRepository))
})

export default container;