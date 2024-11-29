import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './task.entity';
import User from 'src/user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  //Create a new TODO item
  async createTodo(todo: Partial<Todo>, user: User): Promise<Todo> {
    const newTodo = this.todoRepository.create({
      ...todo,
      user,
    });
    return this.todoRepository.save(newTodo);
  }

  // Retrieve all TODO items visible to the user

  async findAll(user: User): Promise<Todo[]> {
    const isAdmin = this.checkIfAdmin(user);
    return isAdmin
      ? this.todoRepository.find()
      : this.todoRepository.find({ where: { user } });
  }

  // Update an existing TODO item

  async updateTodo(id: number, todo: Partial<Todo>, user: User): Promise<Todo> {
    const existingTodo = await this.getTodoByIdWithUser(id);

    this.ensureCanModify(user, existingTodo);

    Object.assign(existingTodo, todo);
    return this.todoRepository.save(existingTodo);
  }

  // Delete an existing TODO item

  async deleteTodo(id: number, user: User): Promise<void> {
    const todo = await this.getTodoByIdWithUser(id);

    this.ensureCanModify(user, todo);

    await this.todoRepository.delete(id); // Use ID for deletion
  }

  // Fetch a TODO by its ID, including the associated user

  private async getTodoByIdWithUser(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    console.log('todo', todo);
    if (!todo) {
      throw new NotFoundException('TODO not found');
    }
    return todo;
  }

  // Ensure the user has the required permissions to modify a TODO

  private ensureCanModify(user: User, todo: Todo): void {
    const isAdmin = this.checkIfAdmin(user);
    if (!isAdmin && todo.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this TODO',
      );
    }
  }

  // Check if the user has the ADMIN role

  private checkIfAdmin(user: User): boolean {
    return user.roles.some((role) => role.role_name === 'ADMIN');
  }
}
