import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './task.entity';
import { TodosController } from './task.controller';
import { TodoService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodoService],
})
export class TodoModule {}
