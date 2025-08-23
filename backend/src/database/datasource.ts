import * as path from 'path';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';
const root = isProd ? path.join(__dirname) : __dirname;

const AppDataSource = new DataSource({
  type: 'postgres', // Database type
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'beev',
  synchronize: process.env.NODE_ENV !== 'production',
  migrationsRun: process.env.NODE_ENV == 'production',
  logging: true,
  migrationsTableName: 'migrations',
  migrations: isProd // Need to use different paths for prod and dev. Thx copilot
    ? [path.join(root, 'migrations', '*.js')]
    : [path.join(root, 'migrations', '*.{ts,js}')],
  entities: [path.join(__dirname, '..', '**', '*.entities.{ts,js}')],
});

export default AppDataSource;
