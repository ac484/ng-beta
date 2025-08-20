import { FirebaseService } from './firebase-service';
import { projectService } from './project-service';
import { contractService } from './contract-service';
import { partnerService } from './partner-service';
import { documentService } from './document-service';

interface RelationshipUpdate {
  entityType: 'projects' | 'contracts' | 'partners' | 'documents';
  entityId: string;
  relatedEntityType: 'projects' | 'contracts' | 'partners' | 'documents';
  relatedEntityId: string;
  action: 'add' | 'remove';
}

export class RelationshipService extends FirebaseService {
  // 建立專案與合約的關聯
  async linkProjectContract(
    projectId: string,
    contractId: string,
    userId: string
  ): Promise<void> {
    const [project, contract] = await Promise.all([
      projectService.getProject(projectId, userId),
      contractService.getContract(contractId, userId)
    ]);

    if (!project || !contract) {
      throw new Error('Project or contract not found');
    }

    // 更新專案的合約列表
    const updatedContractIds = [...(project.contractIds || []), contractId];
    await projectService.updateProject(
      projectId,
      { contractIds: updatedContractIds },
      userId
    );

    // 更新合約的專案關聯
    await contractService.updateContract(contractId, { projectId }, userId);
  }

  // 移除專案與合約的關聯
  async unlinkProjectContract(
    projectId: string,
    contractId: string,
    userId: string
  ): Promise<void> {
    const [project, contract] = await Promise.all([
      projectService.getProject(projectId, userId),
      contractService.getContract(contractId, userId)
    ]);

    if (!project || !contract) {
      throw new Error('Project or contract not found');
    }

    // 從專案的合約列表中移除
    const updatedContractIds = (project.contractIds || []).filter(
      (id) => id !== contractId
    );
    await projectService.updateProject(
      projectId,
      { contractIds: updatedContractIds },
      userId
    );

    // 清除合約的專案關聯
    await contractService.updateContract(
      contractId,
      { projectId: undefined },
      userId
    );
  }

  // 建立專案與夥伴的關聯
  async linkProjectPartner(
    projectId: string,
    partnerId: string,
    userId: string
  ): Promise<void> {
    const [project, partner] = await Promise.all([
      projectService.getProject(projectId, userId),
      partnerService.getPartner(partnerId, userId)
    ]);

    if (!project || !partner) {
      throw new Error('Project or partner not found');
    }

    // 更新專案的夥伴關聯
    await projectService.updateProject(projectId, { partnerId }, userId);

    // 更新夥伴的專案列表
    const updatedProjectIds = [...(partner.projectIds || []), projectId];
    await partnerService.updatePartner(
      partnerId,
      { projectIds: updatedProjectIds },
      userId
    );
  }

  // 移除專案與夥伴的關聯
  async unlinkProjectPartner(
    projectId: string,
    partnerId: string,
    userId: string
  ): Promise<void> {
    const [project, partner] = await Promise.all([
      projectService.getProject(projectId, userId),
      partnerService.getPartner(partnerId, userId)
    ]);

    if (!project || !partner) {
      throw new Error('Project or partner not found');
    }

    // 清除專案的夥伴關聯
    await projectService.updateProject(
      projectId,
      { partnerId: undefined },
      userId
    );

    // 從夥伴的專案列表中移除
    const updatedProjectIds = (partner.projectIds || []).filter(
      (id) => id !== projectId
    );
    await partnerService.updatePartner(
      partnerId,
      { projectIds: updatedProjectIds },
      userId
    );
  }

  // 建立文件與專案的關聯
  async linkDocumentProject(
    documentId: string,
    projectId: string,
    userId: string
  ): Promise<void> {
    const [document, project] = await Promise.all([
      documentService.getDocument(documentId, userId),
      projectService.getProject(projectId, userId)
    ]);

    if (!document || !project) {
      throw new Error('Document or project not found');
    }

    // 更新文件的專案關聯
    await documentService.updateDocument(documentId, { projectId }, userId);

    // 更新專案的文件列表
    const updatedDocumentIds = [...(project.documentIds || []), documentId];
    await projectService.updateProject(
      projectId,
      { documentIds: updatedDocumentIds },
      userId
    );
  }

  // 移除文件與專案的關聯
  async unlinkDocumentProject(
    documentId: string,
    projectId: string,
    userId: string
  ): Promise<void> {
    const [document, project] = await Promise.all([
      documentService.getDocument(documentId, userId),
      projectService.getProject(projectId, userId)
    ]);

    if (!document || !project) {
      throw new Error('Document or project not found');
    }

    // 清除文件的專案關聯
    await documentService.updateDocument(
      documentId,
      { projectId: undefined },
      userId
    );

    // 從專案的文件列表中移除
    const updatedDocumentIds = (project.documentIds || []).filter(
      (id) => id !== documentId
    );
    await projectService.updateProject(
      projectId,
      { documentIds: updatedDocumentIds },
      userId
    );
  }

  // 建立文件與夥伴的關聯
  async linkDocumentPartner(
    documentId: string,
    partnerId: string,
    userId: string
  ): Promise<void> {
    const [document, partner] = await Promise.all([
      documentService.getDocument(documentId, userId),
      partnerService.getPartner(partnerId, userId)
    ]);

    if (!document || !partner) {
      throw new Error('Document or partner not found');
    }

    // 更新文件的夥伴關聯
    await documentService.updateDocument(documentId, { partnerId }, userId);

    // 更新夥伴的文件列表
    const updatedDocumentIds = [...(partner.documentIds || []), documentId];
    await partnerService.updatePartner(
      partnerId,
      { documentIds: updatedDocumentIds },
      userId
    );
  }

  // 移除文件與夥伴的關聯
  async unlinkDocumentPartner(
    documentId: string,
    partnerId: string,
    userId: string
  ): Promise<void> {
    const [document, partner] = await Promise.all([
      documentService.getDocument(documentId, userId),
      partnerService.getPartner(partnerId, userId)
    ]);

    if (!document || !partner) {
      throw new Error('Document or partner not found');
    }

    // 清除文件的夥伴關聯
    await documentService.updateDocument(
      documentId,
      { partnerId: undefined },
      userId
    );

    // 從夥伴的文件列表中移除
    const updatedDocumentIds = (partner.documentIds || []).filter(
      (id) => id !== documentId
    );
    await partnerService.updatePartner(
      partnerId,
      { documentIds: updatedDocumentIds },
      userId
    );
  }

  // 批量更新關聯關係
  async batchUpdateRelationships(
    updates: RelationshipUpdate[],
    userId: string
  ): Promise<void> {
    const promises = updates.map((update) => {
      const {
        entityType,
        entityId,
        relatedEntityType,
        relatedEntityId,
        action
      } = update;

      if (entityType === 'projects' && relatedEntityType === 'contracts') {
        return action === 'add'
          ? this.linkProjectContract(entityId, relatedEntityId, userId)
          : this.unlinkProjectContract(entityId, relatedEntityId, userId);
      }

      if (entityType === 'projects' && relatedEntityType === 'partners') {
        return action === 'add'
          ? this.linkProjectPartner(entityId, relatedEntityId, userId)
          : this.unlinkProjectPartner(entityId, relatedEntityId, userId);
      }

      if (entityType === 'documents' && relatedEntityType === 'projects') {
        return action === 'add'
          ? this.linkDocumentProject(entityId, relatedEntityId, userId)
          : this.unlinkDocumentProject(entityId, relatedEntityId, userId);
      }

      if (entityType === 'documents' && relatedEntityType === 'partners') {
        return action === 'add'
          ? this.linkDocumentPartner(entityId, relatedEntityId, userId)
          : this.unlinkDocumentPartner(entityId, relatedEntityId, userId);
      }

      throw new Error(
        `Unsupported relationship: ${entityType} -> ${relatedEntityType}`
      );
    });

    await Promise.all(promises);
  }

  // 獲取實體的所有關聯資料
  async getEntityRelationships(
    entityType: 'projects' | 'contracts' | 'partners' | 'documents',
    entityId: string,
    userId: string
  ) {
    switch (entityType) {
      case 'projects':
        const project = await projectService.getProject(entityId, userId);
        if (!project) return null;

        const [contracts, documents, partner] = await Promise.all([
          Promise.all(
            (project.contractIds || []).map((id) =>
              contractService.getContract(id, userId)
            )
          ),
          Promise.all(
            (project.documentIds || []).map((id) =>
              documentService.getDocument(id, userId)
            )
          ),
          project.partnerId
            ? partnerService.getPartner(project.partnerId, userId)
            : null
        ]);

        return {
          project,
          contracts: contracts.filter(Boolean),
          documents: documents.filter(Boolean),
          partner
        };

      case 'partners':
        const partnerData = await partnerService.getPartner(entityId, userId);
        if (!partnerData) return null;

        const [partnerProjects, partnerDocuments] = await Promise.all([
          Promise.all(
            (partnerData.projectIds || []).map((id) =>
              projectService.getProject(id, userId)
            )
          ),
          Promise.all(
            (partnerData.documentIds || []).map((id) =>
              documentService.getDocument(id, userId)
            )
          )
        ]);

        return {
          partner: partnerData,
          projects: partnerProjects.filter(Boolean),
          documents: partnerDocuments.filter(Boolean)
        };

      case 'documents':
        const document = await documentService.getDocument(entityId, userId);
        if (!document) return null;

        const [docProject, docPartner, docContract] = await Promise.all([
          document.projectId
            ? projectService.getProject(document.projectId, userId)
            : null,
          document.partnerId
            ? partnerService.getPartner(document.partnerId, userId)
            : null,
          document.contractId
            ? contractService.getContract(document.contractId, userId)
            : null
        ]);

        return {
          document,
          project: docProject,
          partner: docPartner,
          contract: docContract
        };

      case 'contracts':
        const contract = await contractService.getContract(entityId, userId);
        if (!contract) return null;

        const [contractProject, contractPartner] = await Promise.all([
          contract.projectId
            ? projectService.getProject(contract.projectId, userId)
            : null,
          contract.partnerId
            ? partnerService.getPartner(contract.partnerId, userId)
            : null
        ]);

        return {
          contract,
          project: contractProject,
          partner: contractPartner
        };

      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }
}

export const relationshipService = new RelationshipService();
