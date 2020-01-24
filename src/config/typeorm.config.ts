import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig=config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions ={
  type: dbConfig.type,  //'postgres',
  host: process.env.RDS_HOSTNAME || dbConfig.host, //'localhost',
  port: process.env.RDS_PORT || dbConfig.port,  //5432,
  username: process.env.RDS_USERNAME || dbConfig.username, //'postgres',
  password: process.env.RDS_PASSWORD || dbConfig.password, //'postgres',
  database: process.env.RDS_DB_NAME || dbConfig.database, //'taskmanagment',
  entities: [__dirname+'/../**/*.entity.{js, ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize //true
}