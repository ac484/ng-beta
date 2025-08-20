// lib/services/project-service.ts
import { SupabaseService } from './supabase-service'

export class ProjectService {
  private supabase: SupabaseService

  constructor() {
    this.supabase = new SupabaseService()
  }

  async getProjects() {
    return this.supabase.getProjects()
  }
}