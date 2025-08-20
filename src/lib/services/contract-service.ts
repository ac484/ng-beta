import { SupabaseService } from './supabase-service'

export class ContractService {
  private supabase: SupabaseService

  constructor() {
    this.supabase = new SupabaseService()
  }

  async getContracts() {
    return this.supabase.getContracts()
  }

  async getContract(id: string) {
    const supabase = await this.supabase.getClient()
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  }

  async createContract(data: any) {
    const supabase = await this.supabase.getClient()
    const { data: row, error } = await supabase.from('contracts').insert(data).select('*').single()
    return { data: row, error }
  }

  async updateContract(id: string, data: any) {
    const supabase = await this.supabase.getClient()
    const { data: row, error } = await supabase.from('contracts').update(data).eq('id', id).select('*').single()
    return { data: row, error }
  }

  async deleteContract(id: string) {
    const supabase = await this.supabase.getClient()
    const { error } = await supabase.from('contracts').delete().eq('id', id)
    return { error }
  }

  async getContractsByStatus(status: string) {
    const supabase = await (this.supabase as any)['clientPromise']
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: true })
    return { data, error }
  }
}