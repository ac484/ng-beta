import { SupabaseService } from './supabase-service'

export class ContractService {
  private supabase: SupabaseService

  constructor() {
    this.supabase = new SupabaseService()
  }

  async getContracts() {
    return this.supabase.getContracts()
  }
}