import { EntityRepository, Repository } from 'typeorm';
import UserSurvey from '../models/UserSurvey';

@EntityRepository(UserSurvey)
export default class UserSurveyRepository extends Repository<UserSurvey> {}
