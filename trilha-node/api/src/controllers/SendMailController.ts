import { Request, Response } from 'express';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import SurveyRepository from '../repositories/SurveyRepository';
import UserRepository from '../repositories/UserRepository';
import UserSurveyRepository from '../repositories/UserSurveyRepository';
import SendMailService from '../services/SendMailService';

export default class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveyRepository);
    const userSurveyRepository = getCustomRepository(UserSurveyRepository);

    const user = await userRepository.findOne({ email });
    if (!user) {
      return response.status(400).json({ error: 'User does not exists!' });
    }

    const survey = await surveyRepository.findOne({ id: survey_id });
    if (!survey) {
      return response.status(400).json({ error: 'Survey does not exists!' });
    }

    let userSurvey = await userSurveyRepository.findOne({
      where: { user_id: user.id, survey_id: survey.id },
      relations: ['user', 'survey'],
    });

    if (userSurvey && userSurvey.value) {
      return response.status(400).json({ error: 'User has already completed the survey!' });
    }

    if (!userSurvey) {
      userSurvey = userSurveyRepository.create({ user_id: user.id, survey_id });
      await userSurveyRepository.save(userSurvey);
    }

    const filePath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      survey_id: survey.id,
      link: process.env.MAIL_URL,
    };

    await SendMailService.execute(email, survey.title, variables, filePath);

    return response.status(201).json(userSurvey);
  }
}
