import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  workingDay: Date;

  @Column()
  workingHours: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.schedule)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
