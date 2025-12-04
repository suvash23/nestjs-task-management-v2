import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);
    //this.tasks.push(task);
    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task | null> {
    const task = this.getTaskById(id);
    console.log(status);
    if (task) {
      (await task).status = status;
      await this.taskRepository.save(await task);
      return task;
    }
    return null;
  }

  async deleteTask(id: number): Promise<void> {
    id = Number(id);
    const found = await this.getTaskById(id);
    if (found) {
      await this.taskRepository.delete(id);
    } else {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async getFilteredTasks(filterDto: GetFilteredTasksDto) : Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.taskRepository.filteredTasks(status, search);
    return tasks;
  }
}
