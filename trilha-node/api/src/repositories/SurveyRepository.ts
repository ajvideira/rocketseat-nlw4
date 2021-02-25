import Survey from '../models/Survey';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Survey)
export default class SurveyRepository extends Repository<Survey> {}
