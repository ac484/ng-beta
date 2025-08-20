import { SupabaseService } from './supabase-service'

export class DocumentService {
  private supabase: SupabaseService

  constructor() {
    this.supabase = new SupabaseService()
  }

  async getDocuments() {
    return this.supabase.getDocuments()
  }
}