import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import UserSurveyRepository from '../repositories/UserSurveyRepository';

export default class AnswerController {
  async save(request: Request, response: Response) {
    const { us } = request.query;
    const { value } = request.params;

    const userSurveyRepository = getCustomRepository(UserSurveyRepository);
    const userSurvey = await userSurveyRepository.findOne({ where: { id: us } });

    if (!userSurvey) {
      throw new AppError('User survey dos not exists.');
    }

    if (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 10) {
      throw new AppError('Invalid answer.');
    }

    if (userSurvey.value) {
      throw new AppError('User has already completed the survey.');
    }

    userSurvey.value = Number(value);
    await userSurveyRepository.save(userSurvey);

    return response.status(200).json({ message: 'Answer registered.' });
  }
}
