import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTodoDto } from './dto/todo.dto';
import { Roles } from 'src/shared/roles/roles.decorator';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { TodoService } from './service/task.service';

@Controller('todos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TodosController {
  constructor(private readonly todosService: TodoService) {}

  @Get()
  @Roles('ADMIN', 'USER')
  async getTodos(@Request() req: any) {
    return this.todosService.findAll(req.user);
  }

  @Post()
  @Roles('USER')
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Request() req: any) {
    return this.todosService.createTodo(
      createTodoDto,
      this.sanitizeUser(req.user),
    );
  }

  @Put(':id')
  @Roles('ADMIN', 'USER')
  async updateTodo(
    @Param('id') id: number,
    @Body() updateTodoDto: Partial<CreateTodoDto>,
    @Request() req: any,
  ) {
    return this.todosService.updateTodo(
      +id,
      updateTodoDto,
      this.sanitizeUser(req.user),
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'USER')
  async deleteTodo(@Param('id') id: number, @Request() req: any) {
    console.log('deleting todo');
    await this.todosService.deleteTodo(+id, this.sanitizeUser(req.user));
    return { message: 'TODO Deleted' };
  }

  private sanitizeUser(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
