import {
  Document,
  DocumentShare,
  DocumentVersion
} from '@/types/document.types';
import { CreateData, FirebaseService, UpdateData } from './firebase-service';
import { document } from 'postcss';

export class DocumentService extends FirebaseService {
  private documentsCollection = 'documents';
  private versionsCollection = 'document_versions';
  private sharesCollection = 'document_shares';

  // Documents
  async createDocument(data: CreateData<Document>): Promise<Document> {
    return this.create<Document>(this.documentsCollection, data);
  }

  async getDocument(id: string, userId: string): Promise<Document | null> {
    const document = await this.read<Document>(this.documentsCollection, id);

    if (document && document.createdBy !== userId) {
      // Check if document is shared with user
      const isShared = await this.isDocumentSharedWithUser(id, userId);
      if (!isShared) {
        throw new Error('Unauthorized');
      }
    }

    return document;
  }

  async getDocuments(userId: string): Promise<Document[]> {
    return this.list<Document>(this.documentsCollection, {
      where: [['createdBy', '==', userId]],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getProjectDocuments(
    projectId: string,
    userId: string
  ): Promise<Document[]> {
    return this.list<Document>(this.documentsCollection, {
      where: [
        ['projectId', '==', projectId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getPartnerDocuments(
    partnerId: string,
    userId: string
  ): Promise<Document[]> {
    return this.list<Document>(this.documentsCollection, {
      where: [
        ['partnerId', '==', partnerId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getContractDocuments(
    contractId: string,
    userId: string
  ): Promise<Document[]> {
    return this.list<Document>(this.documentsCollection, {
      where: [
        ['contractId', '==', contractId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async updateDocument(
    id: string,
    data: UpdateData<Document>,
    userId: string
  ): Promise<void> {
    const existingDocument = await this.getDocument(id, userId);
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized');
    }

    await this.update(this.documentsCollection, id, data);
  }

  async deleteDocument(id: string, userId: string): Promise<void> {
    const existingDocument = await this.getDocument(id, userId);
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized');
    }

    // Delete related versions and shares
    const versions = await this.getDocumentVersions(id, userId);
    for (const version of versions) {
      await this.delete(this.versionsCollection, version.id);
    }

    const shares = await this.getDocumentShares(id, userId);
    for (const share of shares) {
      await this.delete(this.sharesCollection, share.id);
    }

    await this.delete(this.documentsCollection, id);
  }

  // Document Versions
  async createDocumentVersion(
    data: CreateData<DocumentVersion>
  ): Promise<DocumentVersion> {
    return this.create<DocumentVersion>(this.versionsCollection, data);
  }

  async getDocumentVersions(
    documentId: string,
    userId: string
  ): Promise<DocumentVersion[]> {
    return this.list<DocumentVersion>(this.versionsCollection, {
      where: [
        ['documentId', '==', documentId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['version', 'desc']]
    });
  }

  async getLatestVersion(
    documentId: string,
    userId: string
  ): Promise<DocumentVersion | null> {
    const versions = await this.getDocumentVersions(documentId, userId);
    return versions.length > 0 ? versions[0] : null;
  }

  // Document Shares
  async createDocumentShare(
    data: CreateData<DocumentShare>
  ): Promise<DocumentShare> {
    return this.create<DocumentShare>(this.sharesCollection, data);
  }

  async getDocumentShares(
    documentId: string,
    userId: string
  ): Promise<DocumentShare[]> {
    return this.list<DocumentShare>(this.sharesCollection, {
      where: [
        ['documentId', '==', documentId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['createdAt', 'desc']]
    });
  }

  async getSharedDocuments(userId: string): Promise<Document[]> {
    const shares = await this.list<DocumentShare>(this.sharesCollection, {
      where: [['sharedWith', '==', userId]]
    });

    const documents: Document[] = [];
    for (const share of shares) {
      const document = await this.read<Document>(
        this.documentsCollection,
        share.documentId
      );
      if (document) {
        documents.push(document);
      }
    }

    return documents;
  }

  async isDocumentSharedWithUser(
    documentId: string,
    userId: string
  ): Promise<boolean> {
    const shares = await this.list<DocumentShare>(this.sharesCollection, {
      where: [
        ['documentId', '==', documentId],
        ['sharedWith', '==', userId]
      ],
      limit: 1
    });

    return shares.length > 0;
  }

  async updateDocumentShare(
    id: string,
    data: UpdateData<DocumentShare>,
    userId: string
  ): Promise<void> {
    const existingShare = await this.read<DocumentShare>(
      this.sharesCollection,
      id
    );
    if (!existingShare || existingShare.createdBy !== userId) {
      throw new Error('Share not found or unauthorized');
    }

    await this.update(this.sharesCollection, id, data);
  }

  async deleteDocumentShare(id: string, userId: string): Promise<void> {
    const existingShare = await this.read<DocumentShare>(
      this.sharesCollection,
      id
    );
    if (!existingShare || existingShare.createdBy !== userId) {
      throw new Error('Share not found or unauthorized');
    }

    await this.delete(this.sharesCollection, id);
  }

  // Utility methods
  async searchDocuments(query: string, userId: string): Promise<Document[]> {
    const documents = await this.getDocuments(userId);

    return documents.filter(
      (document) =>
        document.filename.toLowerCase().includes(query.toLowerCase()) ||
        document.originalName.toLowerCase().includes(query.toLowerCase()) ||
        document.description?.toLowerCase().includes(query.toLowerCase()) ||
        document.extractedText?.toLowerCase().includes(query.toLowerCase()) ||
        document.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query.toLowerCase())
        ) ||
        document.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );
  }

  async getDocumentsByType(
    type: Document['type'],
    userId: string
  ): Promise<Document[]> {
    return this.list<Document>(this.documentsCollection, {
      where: [
        ['createdBy', '==', userId],
        ['type', '==', type]
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getDocumentsByProcessingStatus(
    status: Document['processingStatus'],
    userId: string
  ): Promise<Document[]> {
    return this.list<Document>(this.documentsCollection, {
      where: [
        ['createdBy', '==', userId],
        ['processingStatus', '==', status]
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }
}

export const documentService = new DocumentService();
