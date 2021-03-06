/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
  nutritionist_id?: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
    nutritionist_id = '',
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Endereço de Email se encontra em uso.');
    }

    const hashedPassoword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassoword,
      nutritionist_id: nutritionist_id ? nutritionist_id : null,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
