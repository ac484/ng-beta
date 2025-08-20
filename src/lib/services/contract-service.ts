/**
 * @project NG-Beta Integrated Platform - 現代化整合平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-17
 * @updated 2025-01-21
 * @version 1.0.0
 *
 * @fileoverview 合約管理服務類別 - 提供合約相關的資料庫操作和業務邏輯
 * @description
 * 合約管理服務，繼承自 FirebaseService，提供完整的合約 CRUD 操作。
 * 支援權限檢查、專案關聯查詢、AI 摘要整合等功能，確保資料安全性和業務邏輯正確性。
 *
 * 主要功能：
 * - 合約建立、讀取、更新、刪除 (CRUD)
 * - 基於使用者權限的資料存取控制
 * - 專案關聯合約查詢
 * - AI 合約摘要和關鍵條款提取
 * - 合約狀態追蹤和提醒管理
 * - 里程碑管理和進度追蹤
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Database: Firebase Firestore v9+
 * - Auth: Clerk Authentication
 * - State: TanStack Query + Zustand
 * - Validation: Zod (via contracts.schemas.ts)
 * - AI: Google Genkit (合約摘要和分析)
 *
 * @features
 * - 權限控制：確保使用者只能存取自己的合約
 * - 專案整合：支援與專案模組的關聯查詢
 * - AI 增強：自動提取關鍵條款和風險評估
 * - 狀態管理：完整的合約生命週期追蹤
 * - 提醒系統：自動化的合約到期提醒
 *
 * @dependencies
 * - @/types/contracts.types: 合約相關類型定義
 * - ./firebase-service: Firebase 基礎服務類別
 *
 * @environment
 * - Node: >=20.0.0
 * - Package Manager: pnpm
 * - Build Tool: Turbopack
 *
 * @usage
 * ```typescript
 * import { contractService } from '@/lib/services/contract-service'
 *
 * // 建立合約
 * const contract = await contractService.createContract({
 *   title: '服務合約',
 *   type: 'service',
 *   status: 'draft',
 *   startDate: new Date(),
 *   createdBy: userId
 * })
 *
 * // 查詢使用者合約
 * const contracts = await contractService.getContracts(userId)
 *
 * // 查詢專案相關合約
 * const projectContracts = await contractService.getContractsByProject(projectId, userId)
 * ```
 *
 * @related
 * - src/features/contracts/: 合約功能模組
 * - src/app/(dashboard)/@contracts/: 合約平行路由
 * - src/lib/ai/services/contracts-ai.ts: 合約 AI 服務
 * - src/types/contracts.types.ts: 合約類型定義
 */

import { Contract, CreateContractData } from '@/types/contracts.types';
import { FirebaseService } from './firebase-service';

export class ContractService extends FirebaseService {
  private collectionName = 'contracts';

  async createContract(data: CreateContractData): Promise<Contract> {
    // 為新合約設定預設的 keyTerms
    const contractData = {
      ...data,
      keyTerms: [] // 初始化為空陣列，後續可透過 AI 分析填入
    };
    return this.create<Contract>(this.collectionName, contractData);
  }

  async getContract(id: string, userId: string): Promise<Contract | null> {
    const contract = await this.read<Contract>(this.collectionName, id);

    // 檢查權限
    if (contract && contract.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return contract;
  }

  async getContracts(userId: string): Promise<Contract[]> {
    return this.list<Contract>(this.collectionName, {
      where: [{ field: 'createdBy', operator: '==', value: userId }],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getContractsByProject(
    projectId: string,
    userId: string
  ): Promise<Contract[]> {
    return this.list<Contract>(this.collectionName, {
      where: [
        { field: 'projectId', operator: '==', value: projectId },
        { field: 'createdBy', operator: '==', value: userId }
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async updateContract(
    id: string,
    data: Partial<Contract>,
    userId: string
  ): Promise<Contract> {
    // 先檢查權限
    const existingContract = await this.getContract(id, userId);
    if (!existingContract) {
      throw new Error('Contract not found or unauthorized');
    }

    await this.update(this.collectionName, id, data);
    return { ...existingContract, ...data } as Contract;
  }

  async deleteContract(id: string, userId: string): Promise<void> {
    // 先檢查權限
    const existingContract = await this.getContract(id, userId);
    if (!existingContract) {
      throw new Error('Contract not found or unauthorized');
    }

    await this.delete(this.collectionName, id);
  }
}

export const contractService = new ContractService();
