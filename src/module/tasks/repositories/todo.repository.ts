import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRepository } from 'src/shared/repositories/crud.repository';
import { Todo } from '../entities/task.entity';

@Injectable()
class TodoRepository extends CrudRepository<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {
    super(todoRepo);
  }
}

export default TodoRepository;
