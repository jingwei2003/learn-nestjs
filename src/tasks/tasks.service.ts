import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { promises } from 'dns';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTask(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTask(filterDto);
  }

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.getTaskById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  deleteTask(id: string): Promise<void> {
    return this.taskRepository.deleteTask(id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.taskRepository.updateTaskStatus(id, status);
  }
}
