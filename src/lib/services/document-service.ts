import { FirebaseService } from './firebase-service'

export class DocumentService {
  private firebase: FirebaseService

  constructor() {
    this.firebase = new FirebaseService()
  }

  async getDocuments() {
    return this.firebase.getCollection('documents')
  }

  async getDocument(id: string) {
    return this.firebase.getDocument('documents', id)
  }

  async createDocument(data: any) {
    return this.firebase.addDocument('documents', data)
  }

  async updateDocument(id: string, data: any) {
    return this.firebase.updateDocument('documents', id, data)
  }

  async deleteDocument(id: string) {
    return this.firebase.deleteDocument('documents', id)
  }

  async uploadDocument(file: File, metadata: any) {
    const path = `documents/${Date.now()}_${file.name}`
    const uploadResult = await this.firebase.uploadFile(path, file)
    
    if (uploadResult.url) {
      const documentData = {
        ...metadata,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        downloadURL: uploadResult.url,
        uploadedAt: new Date().toISOString()
      }
      
      return this.createDocument(documentData)
    }
    
    return { id: null, error: uploadResult.error }
  }

  async getDocumentsByType(type: string) {
    return this.firebase.queryCollection('documents', [
      { field: 'type', operator: '==', value: type }
    ], 'uploadedAt')
  }
}