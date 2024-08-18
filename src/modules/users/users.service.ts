import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async createUser(createUserDto: CreateUserRequestDto) {
    const { password } = createUserDto;

    return this.usersRepository.create({
      ...createUserDto,
      password: await hash(password, 10),
    });
    return this.usersRepository.create(createUserDto);
  }

  findAllUsers() {
    return this.usersRepository.find({});
  }

  findUserById(id: string) {
    return this.usersRepository.findByIdLean(id);
  }

  updateUserById(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateById(id, updateUserDto);
  }

  removeUserById(id: number) {
    return `This action removes a #${id} user`;
  }
}
