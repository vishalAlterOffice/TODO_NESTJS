import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosController } from './task.controller';
import { Todo } from './entities/task.entity';
import { TodoService } from './service/task.service';
import TodoRepository from './repositories/todo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}
