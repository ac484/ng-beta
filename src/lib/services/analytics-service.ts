import { FirebaseService } from './firebase-service'

export class AnalyticsService {
  private firebase: FirebaseService

  constructor() {
    this.firebase = new FirebaseService()
  }

  async getAnalytics() {
    return this.firebase.getCollection('analytics')
  }

  async getAnalyticsByDate(startDate: string, endDate: string) {
    return this.firebase.queryCollection('analytics', [
      { field: 'date', operator: '>=', value: startDate },
      { field: 'date', operator: '<=', value: endDate }
    ], 'date')
  }

  async getAnalyticsByCategory(category: string) {
    return this.firebase.queryCollection('analytics', [
      { field: 'category', operator: '==', value: category }
    ])
  }
}