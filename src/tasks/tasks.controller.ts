import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(@Query() filterDto: GetFilteredTasksDto, @GetUser() user: User): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.taskService.getFilteredTasks(filterDto, user);
    }
    return this.taskService.getAllTasks(user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: number, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() CreateTaskDto: CreateTaskDto,
    @GetUser() user: User): Promise<Task> {
    return this.taskService.createTask(CreateTaskDto, user);
  }

  @Get('/:id/delete')
  deleteTask(@Param('id') id: number, @GetUser() user: User) {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: number,
    @Body() UpdateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task | null> {
    const { status } = UpdateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
