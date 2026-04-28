import knex from 'knex';
import { config } from '@/config';
import { logger } from '@/utils/logger';

const db = knex({
  client: 'postgresql',
  connection: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
  },
  pool: {
    min: 2,
    max: 10,
  },
  acquireConnectionTimeout: 60000,
  migrations: {
    directory: './src/database/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
});

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info('Database connection established successfully');
  })
  .catch((error) => {
    logger.error('Database connection failed:', error);
  });

export { db };
