import {
  onSnapshot,
  doc,
  collection,
  query,
  where,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

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

    let q = collection(db, entityType);

    // 如果有 userId，只監聽該使用者的資料
    if (userId) {
      q = query(collection(db, entityType), where('createdBy', '==', userId));
    }

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
  async forcSync(
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
    userId: string
  ): Promise<void> {
    const promises = entities.map((entity) =>
      this.forcSync(entity.type, entity.id, userId)
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
