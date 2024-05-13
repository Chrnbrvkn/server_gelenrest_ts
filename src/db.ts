import { Sequelize } from 'sequelize-typescript';
import models from './models/models';

const dbName = process.env.DB_NAME || 'default_db_name';
const dbUser = process.env.DB_USER || 'default_user';
const dbPassword = process.env.DB_PASSWORD || 'default_password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306');

export default new Sequelize(
  dbName, 
  dbUser, 
  dbPassword, 
  {
    dialect: 'mysql',
    host: dbHost,
    port: dbPort,
    logging: true,
    models: Object.values(models)
  }
);
