import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-task-filter.dto';

@Controller('tasks')
export class TasksController {

    constructor(private taskService: TasksService) {
    }

    @Get()
    getAllTasks(@Query() filterDto: GetFilteredTasksDto): Task[] {
        if(Object.keys(filterDto).length) {
            return this.taskService.getFilteredTasks(filterDto);
        }
        return this.taskService.getAllTasks();
    }

    @Post()
    createTask(@Body() CreateTaskDto: CreateTaskDto) {
        return this.taskService.createTask(CreateTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id:number): Task | null {
        return this.taskService.getTaskById(id);
    }

    @Get('/:id/delete')
    deleteTask(@Param('id') id:number) {
        return this.taskService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: number,
        @Body('status') status: TaskStatus,
    ) : Task | null {
        return this.taskService.updateTaskStatus(id, status);
    }
}
