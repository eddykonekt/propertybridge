import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({ select: ['id', 'email', 'fullName', 'role', 'phone', 'createdAt'] });
  }

  async findAdmins() {
    return this.userRepository.find({
      where: [{ role: UserRole.PROPERTY_MANAGER }, { role: UserRole.LANDLORD }],
      select: ['id', 'email', 'fullName', 'role'],
    });
  }

  async findTenants() {
    return this.userRepository.find({
      where: { role: UserRole.TENANT },
      select: ['id', 'email', 'fullName', 'role'],
    });
  }
}
