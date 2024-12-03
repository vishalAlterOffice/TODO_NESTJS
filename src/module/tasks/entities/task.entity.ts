import User from 'src/module/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 1000 })
  description: string;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
