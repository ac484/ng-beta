/**
 * @project NG-Beta Integrated Platform - 現代化整合平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-17
 * @updated 2025-01-21
 * @version 1.0.0
 *
 * @fileoverview 文檔管理服務類別 - 提供文檔相關的資料庫操作和檔案管理功能
 * @description
 * 文檔管理服務，繼承自 FirebaseService，提供完整的文檔 CRUD 操作。
 * 支援檔案上傳、權限檢查、專案關聯查詢等功能，整合 Firebase Storage 進行檔案存儲，
 * 確保資料安全性和業務邏輯正確性。
 *
 * 主要功能：
 * - 文檔建立、讀取、更新、刪除 (CRUD)
 * - 檔案上傳和存儲管理
 * - 基於使用者權限的資料存取控制
 * - 專案關聯文檔查詢
 * - Firebase Storage 整合
 * - 檔案元數據管理
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Database: Firebase Firestore v9+
 * - Storage: Firebase Storage v9+
 * - Auth: Clerk Authentication
 * - State: TanStack Query + Zustand
 * - Validation: Zod (via document.schemas.ts)
 *
 * @features
 * - 權限控制：確保使用者只能存取自己的文檔
 * - 檔案管理：完整的檔案上傳、下載、刪除功能
 * - 專案整合：支援與專案模組的關聯查詢
 * - 元數據處理：自動處理檔案元數據和存儲路徑
 * - 錯誤處理：完整的錯誤處理和權限驗證
 *
 * @dependencies
 * - @/types/document.types: 文檔相關類型定義
 * - ./firebase-service: Firebase 基礎服務類別
 *
 * @environment
 * - Node: >=20.0.0
 * - Package Manager: pnpm
 * - Build Tool: Turbopack
 *
 * @usage
 * ```typescript
 * import { documentService } from '@/lib/services/document-service'
 *
 * // 上傳並建立文檔
 * const document = await documentService.uploadAndCreateDocument(
 *   file,
 *   { projectId: 'project-123', type: 'contract' },
 *   userId
 * )
 *
 * // 查詢使用者文檔
 * const documents = await documentService.getDocuments(userId)
 *
 * // 查詢專案相關文檔
 * const projectDocs = await documentService.getDocumentsByProject(projectId, userId)
 * ```
 *
 * @related
 * - src/features/documents/: 文檔功能模組
 * - src/app/(dashboard)/@documents/: 文檔平行路由
 * - src/types/document.types.ts: 文檔類型定義
 * - src/lib/validations/document.schemas.ts: 文檔驗證規則
 */

import { CreateDocumentData, Document } from '@/types/document.types';
import { FirebaseService } from './firebase-service';

export class DocumentService extends FirebaseService {
  private collectionName = 'documents';

  async createDocument(data: CreateDocumentData): Promise<Document> {
    const payload = {
      keywords: [],
      entities: [],
      processingStatus: 'pending' as const,
      ...data
    };
    return this.create<Document>(this.collectionName, payload);
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
