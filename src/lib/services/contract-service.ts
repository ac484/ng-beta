import { FirebaseService } from './firebase-service'

export class ContractService {
  private firebase: FirebaseService

  constructor() {
    this.firebase = new FirebaseService()
  }

  async getContracts() {
    return this.firebase.getCollection('contracts')
  }

  async getContract(id: string) {
    return this.firebase.getDocument('contracts', id)
  }

  async createContract(data: any) {
    return this.firebase.addDocument('contracts', data)
  }

  async updateContract(id: string, data: any) {
    return this.firebase.updateDocument('contracts', id, data)
  }

  async deleteContract(id: string) {
    return this.firebase.deleteDocument('contracts', id)
  }

  async getContractsByStatus(status: string) {
    return this.firebase.queryCollection('contracts', [
      { field: 'status', operator: '==', value: status }
    ], 'createdAt')
  }
}