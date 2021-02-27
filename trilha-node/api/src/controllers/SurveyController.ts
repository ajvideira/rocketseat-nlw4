import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';
import SurveyRepository from '../repositories/SurveyRepository';

export default class SurveyController {
  async show(request: Request, response: Response) {
    const surveyRepository = getCustomRepository(SurveyRepository);

    const surveys = await surveyRepository.find();

    return response.json(surveys);
  }

  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const data = {
      title,
      description,
    };

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
    });

    await schema.validate(data, { abortEarly: false });

    const surveyRepository = getCustomRepository(SurveyRepository);

    const survey = surveyRepository.create({ title, description });
    await surveyRepository.save(survey);

    return response.status(201).send(survey);
  }
}
