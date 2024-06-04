import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { resolve } from 'path';

const filePath = resolve(process.cwd(), './src/db.json');

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type DB = {
  data: User[];
};
@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const id = uuidv4();
    const user = {
      id,
      ...createUserDto,
    };
    const dbData = this.getFile() as DB;
    dbData.data = [...dbData.data, user];

    const dataStringify = JSON.stringify(dbData);
    fs.writeFileSync(filePath, dataStringify);
    const content = this.getFile();
    const _user = content.data.find((user) => user.id === id);
    return _user;
  }

  getFile(): DB {
    const data = fs.readFileSync(filePath, { encoding: 'ascii' });
    return JSON.parse(data);
  }

  findAll() {
    return this.getFile().data;
  }

  findOne(id: string) {
    const content = this.getFile().data;
    const user = content.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log({ updateUserDto, id });
    const dbData = this.getFile();
    const content = dbData.data;
    const user = content.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    let users = content.filter((user) => user.id !== id);
    const updatedUser = { ...user, ...updateUserDto };
    users = [...users, updatedUser];
    dbData.data = users;
    const dataStringify = JSON.stringify(dbData);
    fs.writeFileSync(filePath, dataStringify);

    return `user info has been updated`;
  }

  remove(id: string) {
    const content = this.getFile().data;
    const users = content.filter((user) => user.id !== id);
    const dbData = this.getFile() as DB;
    dbData.data = users;
    const dataStringify = JSON.stringify(dbData);
    fs.writeFileSync(filePath, dataStringify);
    return `user with #${id} has been removed`;
  }
}
