import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import TodoRepository from '../repositories/todo.repository';
import { Todo } from '../entities/task.entity';
import User from 'src/module/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async createTodo(todo: Partial<Todo>, user: User): Promise<Todo> {
    return this.todoRepository.create({ ...todo, user });
  }

  async findAll(user: User): Promise<Todo[]> {
    return this.isAdmin(user)
      ? this.todoRepository.getAll()
      : this.todoRepository.findManyByCriteria({ user });
  }

  async updateTodo(id: number, data: Partial<Todo>, user: User): Promise<Todo> {
    const existingTodo = await this.getTodoByIdWithUser(id);

    this.ensureCanModify(user, existingTodo);

    return this.todoRepository.update(id, data);
  }

  async deleteTodo(id: number, user: User): Promise<void> {
    const todo = await this.getTodoByIdWithUser(id);

    this.ensureCanModify(user, todo);

    await this.todoRepository.destroy(id);
  }

  private async getTodoByIdWithUser(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOneByRelation(id, 'user');
    if (!todo) {
      throw new NotFoundException('TODO not found');
    }
    return todo;
  }

  private ensureCanModify(user: User, todo: Todo): void {
    if (!this.isAdmin(user) && todo.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this TODO',
      );
    }
  }

  private isAdmin(user: User): boolean {
    return user.roles.some((role) => role.role_name === 'ADMIN');
  }
}
