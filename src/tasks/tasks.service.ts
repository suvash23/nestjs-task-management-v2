import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async getAllTasks(user: User): Promise<Task[]> {
    const tasks = await this.taskRepository.find({where: {user: user}});
    return tasks;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user: user } });
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.taskRepository.save(task);
    //this.tasks.push(task);
    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task | null> {
    const task = this.getTaskById(id, user);
    console.log(status);
    if (task) {
      (await task).status = status;
      await this.taskRepository.save(await task);
      return task;
    }
    return null;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    id = Number(id);
    const found = await this.getTaskById(id, user);
    if (found) {
      await this.taskRepository.delete(id);
    } else {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async getFilteredTasks(filterDto: GetFilteredTasksDto, user: User) : Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.taskRepository.filteredTasks(user, status, search);
    return tasks;
  }
}
