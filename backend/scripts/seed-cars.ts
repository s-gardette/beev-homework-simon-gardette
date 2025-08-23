import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { BatchService } from '../src/batch/batch.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  try {
    const batch = app.get(BatchService);
    const csvPath = join(__dirname, '..', '..', 'data', 'cars.csv');
    const csv = readFileSync(csvPath, 'utf-8');
    const result = await batch.importFromCsv(csv);
    console.log('Import result:', result);
  } catch (e) {
    console.error('Import failed', e);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
