import { FirebaseService } from './firebase-service';
import { Contract, CreateContractData } from '@/types/contracts.types';

export class ContractService extends FirebaseService {
  private collectionName = 'contracts';

  async createContract(data: CreateContractData): Promise<Contract> {
    return this.create<Contract>(this.collectionName, data);
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
