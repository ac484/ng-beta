/**
 * @project NG-Beta Integrated Platform - 現代化整合平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-17
 * @updated 2025-01-21
 * @version 1.0.0
 *
 * @fileoverview Firebase 即時資料同步服務 - 提供跨模組的資料變更監聽和同步功能
 * @description
 * 實現基於 Firebase Firestore 的即時資料同步服務，使用單例模式管理多個實體類型的資料變更監聽。
 * 支援訂閱/取消訂閱機制、使用者權限過濾、批量同步和自動清理功能，確保應用程式中的資料一致性。
 *
 * 主要功能：
 * - 即時資料變更監聽 (onSnapshot)
 * - 訂閱者模式管理多個監聽器
 * - 使用者權限過濾和資料隔離
 * - 批量同步和強制更新
 * - 自動清理未使用的監聽器
 * - 單例模式確保全域唯一實例
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Database: Firebase Firestore v9+
 * - State: 訂閱者模式 + Map 資料結構
 * - Realtime: Firebase onSnapshot
 *
 * @features
 * - 即時資料同步：基於 Firebase onSnapshot 的即時監聽
 * - 權限過濾：根據 userId 過濾使用者專屬資料
 * - 智慧清理：自動清理未使用的監聽器避免記憶體洩漏
 * - 批量操作：支援批量同步多個實體
 * - 錯誤處理：完整的錯誤處理和日誌記錄
 *
 * @dependencies
 * - firebase/firestore: Firebase Firestore v9+ SDK
 * - @/lib/firebase/client: Firebase 客戶端配置
 *
 * @environment
 * - Node: >=20.0.0
 * - Package Manager: pnpm
 * - Build Tool: Turbopack
 *
 * @usage
 * ```typescript
 * import { dataSyncService } from '@/lib/services/data-sync-service'
 *
 * // 訂閱資料變更
 * dataSyncService.subscribe(
 *   'component-id',
 *   (changes) => console.log('Data changed:', changes),
 *   ['projects', 'contracts'],
 *   userId
 * )
 *
 * // 取消訂閱
 * dataSyncService.unsubscribe('component-id')
 *
 * // 強制同步
 * await dataSyncService.forceSync('projects', 'project-id', userId)
 * ```
 *
 * @related
 * - src/lib/firebase/client.ts: Firebase 客戶端配置
 * - src/features/<module>/hooks: 各模組的資料 hooks
 * - src/lib/services/<name>-service.ts: 其他業務服務
 *
 * @performance
 * - 使用 Map 資料結構提供 O(1) 查找效能
 * - 智慧監聽器管理避免重複訂閱
 * - 自動清理機制防止記憶體洩漏
 * - 批量操作減少網路請求次數
 */

import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  type Unsubscribe
} from 'firebase/firestore';

type EntityType =
  | 'projects'
  | 'contracts'
  | 'partners'
  | 'documents'
  | 'tasks'
  | 'subtasks';
type ChangeType = 'added' | 'modified' | 'removed';

interface DataChange {
  id: string;
  type: ChangeType;
  data: any;
  entityType: EntityType;
}

interface Subscriber {
  id: string;
  callback: (changes: DataChange[]) => void;
  entityTypes: EntityType[];
  userId?: string;
}

export class DataSyncService {
  private subscribers: Map<string, Subscriber> = new Map();
  private unsubscribers: Map<string, Unsubscribe> = new Map();
  private static instance: DataSyncService;

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  // 訂閱資料變更
  subscribe(
    subscriberId: string,
    callback: (changes: DataChange[]) => void,
    entityTypes: EntityType[],
    userId?: string
  ): void {
    const subscriber: Subscriber = {
      id: subscriberId,
      callback,
      entityTypes,
      userId
    };

    this.subscribers.set(subscriberId, subscriber);

    // 為每個實體類型建立監聽器
    entityTypes.forEach((entityType) => {
      this.setupListener(entityType, userId);
    });
  }

  // 取消訂閱
  unsubscribe(subscriberId: string): void {
    this.subscribers.delete(subscriberId);

    // 如果沒有其他訂閱者，清理監聽器
    this.cleanupUnusedListeners();
  }

  // 設定特定實體類型的監聽器
  private setupListener(entityType: EntityType, userId?: string): void {
    const listenerId = `${entityType}-${userId || 'all'}`;

    // 如果已經有監聽器，不重複建立
    if (this.unsubscribers.has(listenerId)) {
      return;
    }

    // 建立查詢
    const baseCollection = collection(db, entityType);
    const q = userId
      ? query(baseCollection, where('createdBy', '==', userId))
      : baseCollection;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const changes: DataChange[] = [];

      snapshot.docChanges().forEach((change) => {
        changes.push({
          id: change.doc.id,
          type: change.type,
          data: { id: change.doc.id, ...change.doc.data() },
          entityType
        });
      });

      // 通知所有相關的訂閱者
      this.notifySubscribers(changes, entityType);
    });

    this.unsubscribers.set(listenerId, unsubscribe);
  }

  // 通知訂閱者
  private notifySubscribers(
    changes: DataChange[],
    entityType: EntityType
  ): void {
    this.subscribers.forEach((subscriber) => {
      if (subscriber.entityTypes.includes(entityType)) {
        // 過濾只屬於該使用者的變更
        const filteredChanges = changes.filter(
          (change) =>
            !subscriber.userId || change.data.createdBy === subscriber.userId
        );

        if (filteredChanges.length > 0) {
          subscriber.callback(filteredChanges);
        }
      }
    });
  }

  // 清理未使用的監聽器
  private cleanupUnusedListeners(): void {
    const activeEntityTypes = new Set<string>();

    this.subscribers.forEach((subscriber) => {
      subscriber.entityTypes.forEach((entityType) => {
        const listenerId = `${entityType}-${subscriber.userId || 'all'}`;
        activeEntityTypes.add(listenerId);
      });
    });

    // 移除不再需要的監聽器
    this.unsubscribers.forEach((unsubscribe, listenerId) => {
      if (!activeEntityTypes.has(listenerId)) {
        unsubscribe();
        this.unsubscribers.delete(listenerId);
      }
    });
  }

  // 手動觸發同步（用於強制更新）
  async forceSync(
    entityType: EntityType,
    entityId: string,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, entityType, entityId);

      // 建立一次性監聽器來獲取最新資料
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const change: DataChange = {
            id: doc.id,
            type: 'modified',
            data: { id: doc.id, ...doc.data() },
            entityType
          };

          this.notifySubscribers([change], entityType);
        }

        // 立即取消監聽
        unsubscribe();
      });
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  }

  // 批量同步多個實體
  async batchSync(
    entities: Array<{ type: EntityType; id: string }>,
    userId?: string
  ): Promise<void> {
    const promises = entities.map((entity) =>
      this.forceSync(entity.type, entity.id, userId || '')
    );

    await Promise.all(promises);
  }

  // 清理所有監聽器（用於應用關閉時）
  cleanup(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers.clear();
    this.subscribers.clear();
  }
}

// 匯出單例實例
export const dataSyncService = DataSyncService.getInstance();
