import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import AppError from '../errors/AppError';
import UserSurveyRepository from '../repositories/UserSurveyRepository';

export default class NpsController {
  async calculate(request: Request, response: Response) {
    const { survey_id } = request.params;

    const userSurveyRepository = getCustomRepository(UserSurveyRepository);

    const userSurveys = await userSurveyRepository.find({
      where: {
        survey_id,
        value: Not(IsNull()),
      },
    });

    const totalAnswers = userSurveys.length;
    if (totalAnswers === 0) {
      throw new AppError('Survey not answered by anyone yet.');
    }

    const detractors = userSurveys.filter((userSurvey) => userSurvey.value <= 6).length;
    const promoters = userSurveys.filter((userSurvey) => userSurvey.value >= 9).length;
    const passives = userSurveys.filter((userSurvey) => userSurvey.value >= 7 && userSurvey.value <= 8).length;

    const nps = Number(((promoters - detractors) * 100) / totalAnswers).toFixed(2);

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps,
    });
  }
}
