import { FirebaseService } from './firebase-service';
import { Project, CreateProjectData } from '@/types/projects.types';

export class ProjectService extends FirebaseService {
  private collectionName = 'projects';

  async createProject(data: CreateProjectData): Promise<Project> {
    return this.create<Project>(this.collectionName, data);
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    const project = await this.read<Project>(this.collectionName, id);

    // 檢查權限
    if (project && project.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return project;
  }

  async getProjects(userId: string): Promise<Project[]> {
    return this.list<Project>(this.collectionName, {
      where: [{ field: 'createdBy', operator: '==', value: userId }],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async updateProject(
    id: string,
    data: Partial<Project>,
    userId: string
  ): Promise<Project> {
    // 先檢查權限
    const existingProject = await this.getProject(id, userId);
    if (!existingProject) {
      throw new Error('Project not found or unauthorized');
    }

    await this.update(this.collectionName, id, data);
    return { ...existingProject, ...data } as Project;
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    // 先檢查權限
    const existingProject = await this.getProject(id, userId);
    if (!existingProject) {
      throw new Error('Project not found or unauthorized');
    }

    await this.delete(this.collectionName, id);
  }
}

export const projectService = new ProjectService();
