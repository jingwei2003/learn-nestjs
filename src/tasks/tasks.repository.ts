import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  //Get all task
  async getTask(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    const { status, search } = filterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    // const tasks = this.taskRepository.find();
    const tasks = await query.getMany();

    return tasks;
  }

  //Get a task by ID
  async getTaskById(id: string): Promise<Task> {
    // const xx = await this.taskRepository.findOne(where: { id });
    const found = await this.taskRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  //Create a new task
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);
    return task;
  }

  //Delete a task
  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  //Update status of a task
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
