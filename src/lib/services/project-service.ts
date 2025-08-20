import { Project, Subtask, Task } from '@/types/projects.types';
import { CreateData, FirebaseService, UpdateData } from './firebase-service';

export class ProjectService extends FirebaseService {
  private projectsCollection = 'projects';
  private tasksCollection = 'tasks';
  private subtasksCollection = 'subtasks';

  // Projects
  async createProject(data: CreateData<Project>): Promise<Project> {
    return this.create<Project>(this.projectsCollection, data);
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    const project = await this.read<Project>(this.projectsCollection, id);

    if (project && project.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return project;
  }

  async getProjects(userId: string): Promise<Project[]> {
    return this.list<Project>(this.projectsCollection, {
      where: [['createdBy', '==', userId]],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async updateProject(
    id: string,
    data: UpdateData<Project>,
    userId: string
  ): Promise<void> {
    const existingProject = await this.getProject(id, userId);
    if (!existingProject) {
      throw new Error('Project not found or unauthorized');
    }

    await this.update(this.projectsCollection, id, data);
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const existingProject = await this.getProject(id, userId);
    if (!existingProject) {
      throw new Error('Project not found or unauthorized');
    }

    // Delete related tasks and subtasks
    const tasks = await this.getProjectTasks(id, userId);
    for (const task of tasks) {
      await this.deleteTask(task.id, userId);
    }

    await this.delete(this.projectsCollection, id);
  }

  // Tasks
  async createTask(data: CreateData<Task>): Promise<Task> {
    return this.create<Task>(this.tasksCollection, data);
  }

  async getTask(id: string, userId: string): Promise<Task | null> {
    const task = await this.read<Task>(this.tasksCollection, id);

    if (task && task.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return task;
  }

  async getProjectTasks(projectId: string, userId: string): Promise<Task[]> {
    return this.list<Task>(this.tasksCollection, {
      where: [
        ['projectId', '==', projectId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['createdAt', 'desc']]
    });
  }

  async updateTask(
    id: string,
    data: UpdateData<Task>,
    userId: string
  ): Promise<void> {
    const existingTask = await this.getTask(id, userId);
    if (!existingTask) {
      throw new Error('Task not found or unauthorized');
    }

    await this.update(this.tasksCollection, id, data);
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const existingTask = await this.getTask(id, userId);
    if (!existingTask) {
      throw new Error('Task not found or unauthorized');
    }

    // Delete related subtasks
    const subtasks = await this.getTaskSubtasks(id, userId);
    for (const subtask of subtasks) {
      await this.delete(this.subtasksCollection, subtask.id);
    }

    await this.delete(this.tasksCollection, id);
  }

  // Subtasks
  async createSubtask(data: CreateData<Subtask>): Promise<Subtask> {
    return this.create<Subtask>(this.subtasksCollection, data);
  }

  async getSubtask(id: string, userId: string): Promise<Subtask | null> {
    const subtask = await this.read<Subtask>(this.subtasksCollection, id);

    if (subtask && subtask.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return subtask;
  }

  async getTaskSubtasks(taskId: string, userId: string): Promise<Subtask[]> {
    return this.list<Subtask>(this.subtasksCollection, {
      where: [
        ['taskId', '==', taskId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['createdAt', 'asc']]
    });
  }

  async updateSubtask(
    id: string,
    data: UpdateData<Subtask>,
    userId: string
  ): Promise<void> {
    const existingSubtask = await this.getSubtask(id, userId);
    if (!existingSubtask) {
      throw new Error('Subtask not found or unauthorized');
    }

    await this.update(this.subtasksCollection, id, data);
  }

  async deleteSubtask(id: string, userId: string): Promise<void> {
    const existingSubtask = await this.getSubtask(id, userId);
    if (!existingSubtask) {
      throw new Error('Subtask not found or unauthorized');
    }

    await this.delete(this.subtasksCollection, id);
  }

  // Utility methods
  async getProjectProgress(projectId: string, userId: string): Promise<number> {
    const tasks = await this.getProjectTasks(projectId, userId);
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter((task) => task.status === 'completed');
    return Math.round((completedTasks.length / tasks.length) * 100);
  }
}

export const projectService = new ProjectService();
