import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';
import AppError from '../errors/AppError';
import UserRepository from '../repositories/UserRepository';

export default class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await userRepository.findOne({ email });

    if (userAlreadyExists) {
      throw new AppError('User already exists.');
    }

    const data = {
      name,
      email,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    await schema.validate(data, { abortEarly: false });

    const user = userRepository.create({ name, email });
    await userRepository.save(user);

    return response.status(201).send(user);
  }
}
