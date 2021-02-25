import { Request, response, Response } from 'express';
import SurveyRepository from '../repositories/SurveyRepository';
import { getCustomRepository } from 'typeorm';

export default class SurveyController {
  async show(request: Request, response: Response) {
    const surveyRepository = getCustomRepository(SurveyRepository);

    const surveys = await surveyRepository.find();

    return response.json(surveys);
  }

  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveyRepository = getCustomRepository(SurveyRepository);

    const survey = surveyRepository.create({ title, description });
    await surveyRepository.save(survey);

    return response.status(201).send(survey);
  }
}
