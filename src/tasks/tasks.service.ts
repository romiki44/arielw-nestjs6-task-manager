import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks:Task[] =[];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const {status, search} = filterDto;
    
    let tasks=this.getAllTasks();
    if(status) {
      tasks=tasks.filter(tasks=>tasks.status===status);
    }
    if(search) {
      tasks=tasks.filter(task=>
        task.title.includes(search) ||
        task.description.includes(search)
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found=this.tasks.find(task=>task.id===id);
    if(!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    return found;
  }

  /*
  createTask(title: string, description: string):Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    }
  */

  createTask(createTaskDto: CreateTaskDto):Task {
    const {title, description} = createTaskDto;  //extract object...ES6
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    }

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    // const index=this.tasks.findIndex(t=>t.id===id);
    // this.tasks.splice(index, 1);
    // return id;
    const found=this.getTaskById(id);
    this.tasks=this.tasks.filter(task=>task.id !== found.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    // const index=this.tasks.findIndex(t=>t.id===id);
    // if(index>=0) {
    //   this.tasks[index].status=status;
    // }
    const task=this.getTaskById(id);
    task.status=status;
    return task;
  }
}
