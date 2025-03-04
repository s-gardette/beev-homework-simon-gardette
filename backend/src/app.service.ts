import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { VersionEntity } from './version.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(VersionEntity)
    private readonly versionRepository: Repository<VersionEntity>,
  ) {}

  getBeev(): string {
    return 'Beev';
  }

  async getVersion() {
    const currentVersion = await this.versionRepository.findOne({
      where: { createdAt: LessThan(new Date()) },
      order: { createdAt: 'DESC' },
    });

    // Increment the version
    const newVersionValue = currentVersion
      ? parseInt(currentVersion.value, 10) + 1
      : 1;

    return await this.versionRepository.save({
      value: newVersionValue.toString(),
    });
  }
}
