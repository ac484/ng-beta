import { FirebaseService } from './firebase-service';
import { Document, CreateDocumentData } from '@/types/document.types';

export class DocumentService extends FirebaseService {
  private collectionName = 'documents';

  async createDocument(data: CreateDocumentData): Promise<Document> {
    return this.create<Document>(this.collectionName, data);
  }

  async getDocument(id: string, userId: string): Promise<Document | null> {
    const document = await this.read<Document>(this.collectionName, id);

    // 檢查權限
    if (document && document.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return document;
  }

  async getDocuments(userId: string): Promise<Document[]> {
    return this.list<Document>(this.collectionName, {
      where: [{ field: 'createdBy', operator: '==', value: userId }],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getDocumentsByProject(
    projectId: string,
    userId: string
  ): Promise<Document[]> {
    return this.list<Document>(this.collectionName, {
      where: [
        { field: 'projectId', operator: '==', value: projectId },
        { field: 'createdBy', operator: '==', value: userId }
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async uploadAndCreateDocument(
    file: File,
    metadata: Omit<
      CreateDocumentData,
      'filename' | 'originalName' | 'mimeType' | 'size' | 'url'
    >,
    userId: string
  ): Promise<Document> {
    // 上傳檔案到 Firebase Storage
    const filePath = `documents/${userId}/${Date.now()}-${file.name}`;
    const downloadURL = await this.uploadFile(filePath, file);

    // 建立文件記錄
    const documentData: CreateDocumentData = {
      ...metadata,
      filename: filePath,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: downloadURL,
      createdBy: userId,
      updatedBy: userId
    };

    return this.createDocument(documentData);
  }

  async updateDocument(
    id: string,
    data: Partial<Document>,
    userId: string
  ): Promise<Document> {
    // 先檢查權限
    const existingDocument = await this.getDocument(id, userId);
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized');
    }

    await this.update(this.collectionName, id, data);
    return { ...existingDocument, ...data } as Document;
  }

  async deleteDocument(id: string, userId: string): Promise<void> {
    // 先檢查權限
    const existingDocument = await this.getDocument(id, userId);
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized');
    }

    // 刪除 Storage 中的檔案
    if (existingDocument.filename) {
      try {
        await this.deleteFile(existingDocument.filename);
      } catch (error) {
        console.warn('Failed to delete file from storage:', error);
      }
    }

    // 刪除文件記錄
    await this.delete(this.collectionName, id);
  }
}

export const documentService = new DocumentService();
