import { FirebaseService } from './firebase-service';
import { Partner, CreatePartnerData } from '@/types/partner.types';

export class PartnerService extends FirebaseService {
  private collectionName = 'partners';

  async createPartner(data: CreatePartnerData): Promise<Partner> {
    return this.create<Partner>(this.collectionName, data);
  }

  async getPartner(id: string, userId: string): Promise<Partner | null> {
    const partner = await this.read<Partner>(this.collectionName, id);

    // 檢查權限
    if (partner && partner.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return partner;
  }

  async getPartners(userId: string): Promise<Partner[]> {
    return this.list<Partner>(this.collectionName, {
      where: [{ field: 'createdBy', operator: '==', value: userId }],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getPartnersByProject(
    projectId: string,
    userId: string
  ): Promise<Partner[]> {
    return this.list<Partner>(this.collectionName, {
      where: [
        { field: 'projectIds', operator: 'array-contains', value: projectId },
        { field: 'createdBy', operator: '==', value: userId }
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async updatePartner(
    id: string,
    data: Partial<Partner>,
    userId: string
  ): Promise<Partner> {
    // 先檢查權限
    const existingPartner = await this.getPartner(id, userId);
    if (!existingPartner) {
      throw new Error('Partner not found or unauthorized');
    }

    await this.update(this.collectionName, id, data);
    return { ...existingPartner, ...data } as Partner;
  }

  async deletePartner(id: string, userId: string): Promise<void> {
    // 先檢查權限
    const existingPartner = await this.getPartner(id, userId);
    if (!existingPartner) {
      throw new Error('Partner not found or unauthorized');
    }

    await this.delete(this.collectionName, id);
  }
}

export const partnerService = new PartnerService();
