import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { CreateUserRequestDto } from '../dto/create-user.dto';
import { User } from '../models/user.model';
import { FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export class UsersLogicService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(user: CreateUserRequestDto) {
    return this.usersRepository.create(user);
  }

  async findOneUser(userFilterQuery: FilterQuery<User>) {
    return this.usersRepository.findOne(userFilterQuery);
  }

  async getUserById(userId: string) {
    return this.usersRepository.findById(userId);
  }

  async updateUser(query: FilterQuery<User>, data: UpdateQuery<User>) {
    return this.usersRepository.findOneAndUpdate(query, data);
  }
}
