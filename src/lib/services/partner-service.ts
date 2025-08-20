import { FirebaseService } from './firebase-service'

export class PartnerService {
  private firebase: FirebaseService

  constructor() {
    this.firebase = new FirebaseService()
  }

  async getPartners() {
    return this.firebase.getCollection('partners')
  }

  async getPartner(id: string) {
    return this.firebase.getDocument('partners', id)
  }

  async createPartner(data: any) {
    return this.firebase.addDocument('partners', data)
  }

  async updatePartner(id: string, data: any) {
    return this.firebase.updateDocument('partners', id, data)
  }

  async deletePartner(id: string) {
    return this.firebase.deleteDocument('partners', id)
  }

  async getPartnersByCategory(category: string) {
    return this.firebase.queryCollection('partners', [
      { field: 'category', operator: '==', value: category }
    ], 'name')
  }

  async searchPartners(searchTerm: string) {
    // 注意：Firestore 不支援全文搜索，這裡是簡單的前綴匹配
    return this.firebase.queryCollection('partners', [
      { field: 'name', operator: '>=', value: searchTerm },
      { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' }
    ], 'name')
  }
}