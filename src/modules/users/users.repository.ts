import { MongoEntityRepository } from 'src/common/mongo-abstract.repository';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UsersRepository extends MongoEntityRepository<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({ entityModel: userModel, errLogger: true });
  }
}
