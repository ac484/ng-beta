import { SupabaseService } from './supabase-service'

export class AnalyticsService {
  private supabase: SupabaseService

  constructor() {
    this.supabase = new SupabaseService()
  }

  async getAnalytics() {
    return this.supabase.getAnalytics()
  }
}