import User from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  role_name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
