import { FirebaseService } from './firebase-service'
import { SupabaseService } from './supabase-service'

export class AnalyticsService {
  private firebase: FirebaseService
  private supabase: SupabaseService

  constructor() {
    this.firebase = new FirebaseService()
    this.supabase = new SupabaseService()
  }

  async getAnalytics() {
    // Prefer Supabase if available data, else fallback to Firebase
    const { data, error } = await this.supabase.getAnalytics()
    if (!error && data && data.length) return { data, error: null }
    return this.firebase.getCollection('analytics')
  }

  async getAnalyticsByDate(startDate: string, endDate: string) {
    const supabase = await this.supabase.getClient()
    const supa = await supabase
      .from('analytics')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
    if (!supa.error && supa.data && supa.data.length) return { data: supa.data, error: null }
    return this.firebase.queryCollection('analytics', [
      { field: 'date', operator: '>=', value: startDate },
      { field: 'date', operator: '<=', value: endDate }
    ], 'date')
  }

  async getAnalyticsByCategory(category: string) {
    const supabase = await this.supabase.getClient()
    const supa = await supabase
      .from('analytics')
      .select('*')
      .eq('category', category)
    if (!supa.error && supa.data && supa.data.length) return { data: supa.data, error: null }
    return this.firebase.queryCollection('analytics', [
      { field: 'category', operator: '==', value: category }
    ])
  }
}