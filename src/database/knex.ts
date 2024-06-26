import { config } from './config';
import knex from 'knex';

const environment = process.env.NODE_ENV || 'development';
const connection = knex(config[environment]);

export default connection;