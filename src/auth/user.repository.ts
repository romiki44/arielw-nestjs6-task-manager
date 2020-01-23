import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // netreba takto...staci nastavit username ako unique!
    // const exist=this.findOne({username});
    // if(exist) {}

    const user=new User();
    user.username=username;
    user.salt=await bcrypt.genSalt();
    user.password=await this.hashPassword(password, user.salt);
    console.log(user.password);

    try{
      await user.save();
    } 
    catch(error) {
      //console.log(error);
      if(error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user=await this.findOne({username});

    if(user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}