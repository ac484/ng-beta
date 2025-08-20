// lib/services/supabase-service.ts
import { supabase } from '../supabase/client'

export class SupabaseService {
  // 專案管理
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
    return { data, error }
  }

  // 合約管理
  async getContracts() {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
    return { data, error }
  }

  // 夥伴管理
  async getPartners() {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
    return { data, error }
  }

  // 文件管理
  async getDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
    return { data, error }
  }

  // 分析數據
  async getAnalytics() {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
    return { data, error }
  }
}