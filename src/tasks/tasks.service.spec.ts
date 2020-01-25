import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser={id: 20, username: 'Tom'};

const mockTaskRepository=()=>({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
});

describe('TaskService', ()=> {
  let tasksService;
  let tasksRepository;

  beforeEach(async ()=>{
    const module=await Test.createTestingModule({
      providers: [
        TasksService,
        {provide: TaskRepository, useFactory: mockTaskRepository}
      ]
    }).compile();

    tasksService=await module.get<TasksService>(TasksService);
    tasksRepository=await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTask', ()=> {    
    it('gets all taks from repository', async ()=> {
      tasksRepository.getTasks.mockResolvedValue('someValue');

      expect(tasksRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto={status: TaskStatus.IN_PROGRESS, search: 'query search'};
      const result= await tasksService.getTasks(filters, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', ()=>{
    it('calls taskRepository.findOne() and return the task', async ()=>{
      const mockTask={title: 'Test task', description: 'Test desc'};
      tasksRepository.findOne.mockResolvedValue(mockTask);

      const result=await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id
        }
      });
    });

    it('throws an error if taks not found', ()=>{
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', ()=>{
    it('calls tasksRepository.create() and return task', async ()=>{
      const createTaskDto={title: 'NewTask', description: 'NewDescription'};
      tasksRepository.createTask.mockResolvedValue(createTaskDto);
      
      const result=await tasksService.createTask(createTaskDto, mockUser);
      expect(tasksRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
      expect(result).toEqual(createTaskDto);
    });
  });

  describe('deleteTask', ()=>{
    it('calls taksRepository.deleteTask() to delete a task', async ()=> {
      tasksRepository.delete.mockResolvedValue({affected: 1});
      expect(tasksRepository.delete).not.toHaveBeenCalled();

      await tasksService.deleteTask(1, mockUser);
      expect(tasksRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});
    });

    it('throws an error if task not found', ()=> {
      tasksRepository.delete.mockResolvedValue({affected: 0});
      expect(tasksService.deleteTask(1,mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', ()=> {
    it('updated task status', async ()=> {
      const save=jest.fn().mockResolvedValue(true);

      tasksService.getTaskById=jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result=await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});