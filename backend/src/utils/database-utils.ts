import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Use DB-agnostic date columns — omit explicit `timestamptz` so TypeORM
// picks an appropriate type for the active driver (Postgres, SQLite, ...)
export abstract class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  updatedBy: string;
}
