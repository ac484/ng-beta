import { Collaboration, Partner, Relationship } from '@/types/partner.types';
import { CreateData, FirebaseService, UpdateData } from './firebase-service';

export class PartnerService extends FirebaseService {
  private partnersCollection = 'partners';
  private collaborationsCollection = 'collaborations';
  private relationshipsCollection = 'relationships';

  // Partners
  async createPartner(data: CreateData<Partner>): Promise<Partner> {
    return this.create<Partner>(this.partnersCollection, data);
  }

  async getPartner(id: string, userId: string): Promise<Partner | null> {
    const partner = await this.read<Partner>(this.partnersCollection, id);

    if (partner && partner.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return partner;
  }

  async getPartners(userId: string): Promise<Partner[]> {
    return this.list<Partner>(this.partnersCollection, {
      where: [['createdBy', '==', userId]],
      orderBy: [['name', 'asc']]
    });
  }

  async getPartnersByType(
    type: Partner['type'],
    userId: string
  ): Promise<Partner[]> {
    return this.list<Partner>(this.partnersCollection, {
      where: [
        ['createdBy', '==', userId],
        ['type', '==', type]
      ],
      orderBy: [['name', 'asc']]
    });
  }

  async getPartnersByStatus(
    status: Partner['status'],
    userId: string
  ): Promise<Partner[]> {
    return this.list<Partner>(this.partnersCollection, {
      where: [
        ['createdBy', '==', userId],
        ['status', '==', status]
      ],
      orderBy: [['name', 'asc']]
    });
  }

  async updatePartner(
    id: string,
    data: UpdateData<Partner>,
    userId: string
  ): Promise<void> {
    const existingPartner = await this.getPartner(id, userId);
    if (!existingPartner) {
      throw new Error('Partner not found or unauthorized');
    }

    await this.update(this.partnersCollection, id, data);
  }

  async deletePartner(id: string, userId: string): Promise<void> {
    const existingPartner = await this.getPartner(id, userId);
    if (!existingPartner) {
      throw new Error('Partner not found or unauthorized');
    }

    // Delete related collaborations and relationships
    const collaborations = await this.getPartnerCollaborations(id, userId);
    for (const collaboration of collaborations) {
      await this.delete(this.collaborationsCollection, collaboration.id);
    }

    const relationships = await this.getPartnerRelationships(id, userId);
    for (const relationship of relationships) {
      await this.delete(this.relationshipsCollection, relationship.id);
    }

    await this.delete(this.partnersCollection, id);
  }

  // Collaborations
  async createCollaboration(
    data: CreateData<Collaboration>
  ): Promise<Collaboration> {
    return this.create<Collaboration>(this.collaborationsCollection, data);
  }

  async getCollaboration(
    id: string,
    userId: string
  ): Promise<Collaboration | null> {
    const collaboration = await this.read<Collaboration>(
      this.collaborationsCollection,
      id
    );

    if (collaboration && collaboration.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return collaboration;
  }

  async getCollaborations(userId: string): Promise<Collaboration[]> {
    return this.list<Collaboration>(this.collaborationsCollection, {
      where: [['createdBy', '==', userId]],
      orderBy: [['startDate', 'desc']]
    });
  }

  async getPartnerCollaborations(
    partnerId: string,
    userId: string
  ): Promise<Collaboration[]> {
    return this.list<Collaboration>(this.collaborationsCollection, {
      where: [
        ['createdBy', '==', userId],
        ['partnerIds', 'array-contains', partnerId]
      ],
      orderBy: [['startDate', 'desc']]
    });
  }

  async updateCollaboration(
    id: string,
    data: UpdateData<Collaboration>,
    userId: string
  ): Promise<void> {
    const existingCollaboration = await this.getCollaboration(id, userId);
    if (!existingCollaboration) {
      throw new Error('Collaboration not found or unauthorized');
    }

    await this.update(this.collaborationsCollection, id, data);
  }

  async deleteCollaboration(id: string, userId: string): Promise<void> {
    const existingCollaboration = await this.getCollaboration(id, userId);
    if (!existingCollaboration) {
      throw new Error('Collaboration not found or unauthorized');
    }

    await this.delete(this.collaborationsCollection, id);
  }

  // Relationships
  async createRelationship(
    data: CreateData<Relationship>
  ): Promise<Relationship> {
    return this.create<Relationship>(this.relationshipsCollection, data);
  }

  async getRelationship(
    id: string,
    userId: string
  ): Promise<Relationship | null> {
    const relationship = await this.read<Relationship>(
      this.relationshipsCollection,
      id
    );

    if (relationship && relationship.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return relationship;
  }

  async getPartnerRelationships(
    partnerId: string,
    userId: string
  ): Promise<Relationship[]> {
    const fromRelationships = await this.list<Relationship>(
      this.relationshipsCollection,
      {
        where: [
          ['createdBy', '==', userId],
          ['fromPartnerId', '==', partnerId]
        ]
      }
    );

    const toRelationships = await this.list<Relationship>(
      this.relationshipsCollection,
      {
        where: [
          ['createdBy', '==', userId],
          ['toPartnerId', '==', partnerId]
        ]
      }
    );

    return [...fromRelationships, ...toRelationships];
  }

  async updateRelationship(
    id: string,
    data: UpdateData<Relationship>,
    userId: string
  ): Promise<void> {
    const existingRelationship = await this.getRelationship(id, userId);
    if (!existingRelationship) {
      throw new Error('Relationship not found or unauthorized');
    }

    await this.update(this.relationshipsCollection, id, data);
  }

  async deleteRelationship(id: string, userId: string): Promise<void> {
    const existingRelationship = await this.getRelationship(id, userId);
    if (!existingRelationship) {
      throw new Error('Relationship not found or unauthorized');
    }

    await this.delete(this.relationshipsCollection, id);
  }

  // Utility methods
  async searchPartners(query: string, userId: string): Promise<Partner[]> {
    const partners = await this.getPartners(userId);

    return partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(query.toLowerCase()) ||
        partner.description?.toLowerCase().includes(query.toLowerCase()) ||
        partner.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );
  }

  async getTopRatedPartners(
    userId: string,
    limit: number = 10
  ): Promise<Partner[]> {
    const partners = await this.getPartners(userId);

    return partners
      .filter((partner) => partner.rating && partner.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
}

export const partnerService = new PartnerService();
