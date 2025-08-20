import { FirebaseService } from './firebase-service';
import { projectService } from './project-service';
import { contractService } from './contract-service';
import { partnerService } from './partner-service';
import { documentService } from './document-service';

interface AnalyticsData {
  totalProjects: number;
  totalContracts: number;
  totalPartners: number;
  totalDocuments: number;
  activeProjects: number;
  completedProjects: number;
  pendingContracts: number;
  activePartners: number;
}

interface ProjectAnalytics {
  projectId: string;
  projectName: string;
  progress: number;
  tasksCount: number;
  contractsCount: number;
  documentsCount: number;
  partnersCount: number;
}

export class AnalyticsService extends FirebaseService {
  async getDashboardAnalytics(userId: string): Promise<AnalyticsData> {
    const [projects, contracts, partners, documents] = await Promise.all([
      projectService.getProjects(userId),
      contractService.getContracts(userId),
      partnerService.getPartners(userId),
      documentService.getDocuments(userId)
    ]);

    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const completedProjects = projects.filter(
      (p) => p.status === 'completed'
    ).length;
    const pendingContracts = contracts.filter(
      (c) => c.status === 'pending'
    ).length;
    const activePartners = partners.filter((p) => p.status === 'active').length;

    return {
      totalProjects: projects.length,
      totalContracts: contracts.length,
      totalPartners: partners.length,
      totalDocuments: documents.length,
      activeProjects,
      completedProjects,
      pendingContracts,
      activePartners
    };
  }

  async getProjectAnalytics(userId: string): Promise<ProjectAnalytics[]> {
    const projects = await projectService.getProjects(userId);

    const projectAnalytics = await Promise.all(
      projects.map(async (project) => {
        const [contracts, documents, partners] = await Promise.all([
          contractService.getContractsByProject(project.id, userId),
          documentService.getDocumentsByProject(project.id, userId),
          partnerService.getPartnersByProject(project.id, userId)
        ]);

        return {
          projectId: project.id,
          projectName: project.title,
          progress: project.progress || 0,
          tasksCount: project.taskIds?.length || 0,
          contractsCount: contracts.length,
          documentsCount: documents.length,
          partnersCount: partners.length
        };
      })
    );

    return projectAnalytics;
  }

  async getMonthlyTrends(userId: string, months: number = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const [projects, contracts, partners, documents] = await Promise.all([
      projectService.getProjects(userId),
      contractService.getContracts(userId),
      partnerService.getPartners(userId),
      documentService.getDocuments(userId)
    ]);

    // 按月份分組統計
    const monthlyData = [];
    for (let i = 0; i < months; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(startDate.getMonth() + i);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthStart.getMonth() + 1);

      const monthProjects = projects.filter(
        (p) =>
          p.createdAt.toDate() >= monthStart && p.createdAt.toDate() < monthEnd
      ).length;

      const monthContracts = contracts.filter(
        (c) =>
          c.createdAt.toDate() >= monthStart && c.createdAt.toDate() < monthEnd
      ).length;

      const monthPartners = partners.filter(
        (p) =>
          p.createdAt.toDate() >= monthStart && p.createdAt.toDate() < monthEnd
      ).length;

      const monthDocuments = documents.filter(
        (d) =>
          d.createdAt.toDate() >= monthStart && d.createdAt.toDate() < monthEnd
      ).length;

      monthlyData.push({
        month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
        projects: monthProjects,
        contracts: monthContracts,
        partners: monthPartners,
        documents: monthDocuments
      });
    }

    return monthlyData;
  }
}

export const analyticsService = new AnalyticsService();
