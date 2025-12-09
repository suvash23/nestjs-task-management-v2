import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRepository {
  private repo: Repository<Task>;

  constructor(private dataSource: DataSource) {
    this.repo = dataSource.getRepository(Task);
  }

  find() {
    return this.repo.find();
  }

  findOne(options) {
    return this.repo.findOne(options);
  }

  create(data: Partial<Task>) {
    return this.repo.create(data);
  }

  save(task: Task) {
    return this.repo.save(task);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  filteredTasks(status?: string, search?: string) {
    let query = this.repo.createQueryBuilder('task');

    if (status) {
      query = query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query = query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }
  // add your custom methods…
}
