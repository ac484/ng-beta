// lib/services/supabase-service.ts
import { createClient as createBrowserClient } from '../supabase/client'
import { createClient as createServerClient } from '../supabase/server'

export class SupabaseService {
  private clientPromise: Promise<any>

  constructor() {
    this.clientPromise = this.getClient()
  }

  async getClient() {
    try {
      return await createServerClient()
    } catch {
      return createBrowserClient()
    }
  }

  // 專案管理
  async getProjects() {
    const supabase = await this.clientPromise
    const { data, error } = await supabase.from('projects').select('*')
    return { data, error }
  }

  // 合約管理
  async getContracts() {
    const supabase = await this.clientPromise
    const { data, error } = await supabase.from('contracts').select('*')
    return { data, error }
  }

  // 夥伴管理
  async getPartners() {
    const supabase = await this.clientPromise
    const { data, error } = await supabase.from('partners').select('*')
    return { data, error }
  }

  // 文件管理
  async getDocuments() {
    const supabase = await this.clientPromise
    const { data, error } = await supabase.from('documents').select('*')
    return { data, error }
  }

  // 分析數據
  async getAnalytics() {
    const supabase = await this.clientPromise
    const { data, error } = await supabase.from('analytics').select('*')
    return { data, error }
  }
}