import { Injectable } from '@nestjs/common';
import { Task, TaskStatus} from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {

    private tasks : Task[] = [
        {
            id: 1,
            title: 'Task One',
            description: 'This is task one ',
            status: TaskStatus.OPEN
        },
        {
            id: 2,
            title: 'Task Two',
            description: 'This is task two',
            status: TaskStatus.IN_PROGRESS
        },
        {
            id: 3,
            title: 'Task Three',
            description: 'This is task three',
            status: TaskStatus.DONE
        }
    ];

    getAllTasks() : Task[] {
        return this.tasks;
    }

    createTask(CreateTaskDto: CreateTaskDto) : Task {
        const { title, description } = CreateTaskDto;
        const task: Task = {
            id: Date.now(),
            title: title,
            description: description,
            status: TaskStatus.OPEN
        };
        this.tasks.push(task);
        return task;
    }

    getTaskById(id: number) : Task | null {
        id = Number(id);
        return this.tasks.find(task => task.id === id) ?? null;
    }

    deleteTask(id: number) : void {
        id = Number(id);
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskStatus(id: number, status: TaskStatus) : Task | null {
        const task = this.getTaskById(id);
        console.log(status);
        if (task) {
            task.status = status;
            return task;
        }
        return null;
    }

    getFilteredTasks(filterDto: GetFilteredTasksDto) : Task[] {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter((task) => {
                if(task.title.includes(search) || task.description.includes(search)){
                    return true;
                }
            });
        }

        return tasks;
    }
}
