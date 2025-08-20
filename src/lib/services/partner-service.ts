import { SupabaseService } from './supabase-service'

export class PartnerService {
  private supabase: SupabaseService

  constructor() {
    this.supabase = new SupabaseService()
  }

  async getPartners() {
    return this.supabase.getPartners()
  }
}