import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: any): Promise <Partial< User>| undefined>  {
    const saltOrRounds = 10; 
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
  
    
    const newUser = this.userRepository.create({
      username: user.username,
      password: hashedPassword,
      email: user.email, 
    });

    const savedUser = await this.userRepository.save(newUser);
  
    return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
    }
    }
  }