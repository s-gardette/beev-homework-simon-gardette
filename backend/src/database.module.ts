import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'beev',
      synchronize: !isProd,
      autoLoadEntities: true,
      // In production we load compiled JS migrations. In development we rely on
      // `synchronize: true` and avoid loading .ts migration files which can
      // cause ESM runtime import errors (type-only exports like MigrationInterface).
      // thx copilot for this I had no idea how to handle migrations with typeorm. and the doc is ... obscure.
      migrations: isProd
        ? [path.join(__dirname, 'database', 'migrations', '*.js')]
        : [],
      migrationsTableName: 'migrations',
      migrationsRun: isProd,
    }),
  ],
})
export class DatabaseModule {}
