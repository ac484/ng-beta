import { Contract, ContractMilestone } from '@/types/contracts.types';
import { CreateData, FirebaseService, UpdateData } from './firebase-service';

export class ContractService extends FirebaseService {
  private contractsCollection = 'contracts';
  private milestonesCollection = 'contract_milestones';

  // Contracts
  async createContract(data: CreateData<Contract>): Promise<Contract> {
    return this.create<Contract>(this.contractsCollection, data);
  }

  async getContract(id: string, userId: string): Promise<Contract | null> {
    const contract = await this.read<Contract>(this.contractsCollection, id);

    if (contract && contract.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return contract;
  }

  async getContracts(userId: string): Promise<Contract[]> {
    return this.list<Contract>(this.contractsCollection, {
      where: [['createdBy', '==', userId]],
      orderBy: [['updatedAt', 'desc']]
    });
  }

  async getProjectContracts(
    projectId: string,
    userId: string
  ): Promise<Contract[]> {
    return this.list<Contract>(this.contractsCollection, {
      where: [
        ['projectId', '==', projectId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['startDate', 'desc']]
    });
  }

  async getPartnerContracts(
    partnerId: string,
    userId: string
  ): Promise<Contract[]> {
    return this.list<Contract>(this.contractsCollection, {
      where: [
        ['partnerId', '==', partnerId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['startDate', 'desc']]
    });
  }

  async updateContract(
    id: string,
    data: UpdateData<Contract>,
    userId: string
  ): Promise<void> {
    const existingContract = await this.getContract(id, userId);
    if (!existingContract) {
      throw new Error('Contract not found or unauthorized');
    }

    await this.update(this.contractsCollection, id, data);
  }

  async deleteContract(id: string, userId: string): Promise<void> {
    const existingContract = await this.getContract(id, userId);
    if (!existingContract) {
      throw new Error('Contract not found or unauthorized');
    }

    // Delete related milestones
    const milestones = await this.getContractMilestones(id, userId);
    for (const milestone of milestones) {
      await this.delete(this.milestonesCollection, milestone.id);
    }

    await this.delete(this.contractsCollection, id);
  }

  // Milestones
  async createMilestone(
    data: CreateData<ContractMilestone>
  ): Promise<ContractMilestone> {
    return this.create<ContractMilestone>(this.milestonesCollection, data);
  }

  async getMilestone(
    id: string,
    userId: string
  ): Promise<ContractMilestone | null> {
    const milestone = await this.read<ContractMilestone>(
      this.milestonesCollection,
      id
    );

    if (milestone && milestone.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return milestone;
  }

  async getContractMilestones(
    contractId: string,
    userId: string
  ): Promise<ContractMilestone[]> {
    return this.list<ContractMilestone>(this.milestonesCollection, {
      where: [
        ['contractId', '==', contractId],
        ['createdBy', '==', userId]
      ],
      orderBy: [['dueDate', 'asc']]
    });
  }

  async updateMilestone(
    id: string,
    data: UpdateData<ContractMilestone>,
    userId: string
  ): Promise<void> {
    const existingMilestone = await this.getMilestone(id, userId);
    if (!existingMilestone) {
      throw new Error('Milestone not found or unauthorized');
    }

    await this.update(this.milestonesCollection, id, data);
  }

  async deleteMilestone(id: string, userId: string): Promise<void> {
    const existingMilestone = await this.getMilestone(id, userId);
    if (!existingMilestone) {
      throw new Error('Milestone not found or unauthorized');
    }

    await this.delete(this.milestonesCollection, id);
  }

  // Utility methods
  async getExpiringContracts(
    userId: string,
    days: number = 30
  ): Promise<Contract[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.list<Contract>(this.contractsCollection, {
      where: [
        ['createdBy', '==', userId],
        ['status', '==', 'active'],
        ['endDate', '<=', futureDate]
      ],
      orderBy: [['endDate', 'asc']]
    });
  }

  async getContractsByStatus(
    status: Contract['status'],
    userId: string
  ): Promise<Contract[]> {
    return this.list<Contract>(this.contractsCollection, {
      where: [
        ['createdBy', '==', userId],
        ['status', '==', status]
      ],
      orderBy: [['updatedAt', 'desc']]
    });
  }
}

export const contractService = new ContractService();
