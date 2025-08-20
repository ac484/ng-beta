# AI 整合實作模式

## 核心架構

### 1. Google Genkit 配置

#### 基礎配置
```typescript
// lib/ai/genkit.ts
import { configureGenkit, defineFlow, runFlow } from '@genkit-ai/core'
import { googleAI } from '@genkit-ai/googleai'
import { gemini15Flash } from '@genkit-ai/googleai/gemini'
import { z } from 'zod'

// 配置 Genkit
export const genkit = configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true
})

// 環境變數配置
const AI_CONFIG = {
  apiKey: process.env.GOOGLE_AI_API_KEY,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
}

if (!AI_CONFIG.apiKey) {
  throw new Error('GOOGLE_AI_API_KEY is required')
}

// 初始化 Google AI
export const googleAIClient = googleAI({
  apiKey: AI_CONFIG.apiKey,
  projectId: AI_CONFIG.projectId,
  location: AI_CONFIG.location
})
```

#### 環境變數配置
```bash
# .env.local
GOOGLE_AI_API_KEY=your_google_ai_api_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1

# AI 服務配置
AI_SERVICE_ENABLED=true
AI_MODEL_NAME=gemini-1.5-flash
AI_MAX_TOKENS=4096
AI_TEMPERATURE=0.7
```

### 2. AI 服務抽象層

#### 統一 AI 服務介面
```typescript
// lib/ai/types/ai.types.ts
export interface AIService {
  // Portfolio AI 功能
  generateSubtasks(project: Project): Promise<Subtask[]>
  analyzeProjectProgress(project: Project): Promise<ProjectAnalysis>
  suggestProjectImprovements(project: Project): Promise<ProjectSuggestion[]>
  
  // Document AI 功能
  parseDocument(file: File): Promise<ParsedDocument>
  summarizeDocument(document: Document): Promise<DocumentSummary>
  extractKeyInformation(document: Document): Promise<ExtractedInfo>
  
  // Partner AI 功能
  suggestPartners(project: Project): Promise<PartnerSuggestion[]>
  analyzePartnerCompatibility(partner: Partner, project: Project): Promise<CompatibilityAnalysis>
  
  // 跨模組 AI 功能
  generateBusinessInsights(data: CrossModuleData): Promise<BusinessInsight[]>
  predictProjectOutcomes(project: Project): Promise<ProjectPrediction>
  recommendNextActions(userId: string): Promise<ActionRecommendation[]>
}

export interface Subtask {
  title: string
  description: string
  estimatedHours: number
  priority: 'low' | 'medium' | 'high'
  dependencies: string[]
  skills: string[]
}

export interface ProjectAnalysis {
  riskLevel: 'low' | 'medium' | 'high'
  riskFactors: string[]
  progressAssessment: string
  recommendations: string[]
  estimatedCompletion: Date
}

export interface DocumentSummary {
  summary: string
  keyPoints: string[]
  actionItems: string[]
  riskFactors: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

export interface PartnerSuggestion {
  partnerId: string
  partnerName: string
  matchScore: number
  reasoning: string
  skills: string[]
  availability: 'available' | 'busy' | 'unavailable'
}

export interface BusinessInsight {
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
  recommendations: string[]
}
```

## 實作模式

### 1. Portfolio AI 功能

#### 專案子任務生成
```typescript
// lib/ai/flows/generate-subtasks-flow.ts
import { defineFlow, runFlow } from '@genkit-ai/core'
import { gemini15Flash } from '@genkit-ai/googleai/gemini'
import { z } from 'zod'

const subtaskSchema = z.object({
  subtasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    estimatedHours: z.number().min(0.5).max(80),
    priority: z.enum(['low', 'medium', 'high']),
    dependencies: z.array(z.string()),
    skills: z.array(z.string())
  }))
})

export const generateSubtasksFlow = defineFlow(
  {
    name: 'generateSubtasks',
    inputSchema: z.object({
      projectTitle: z.string(),
      projectDescription: z.string(),
      projectType: z.string(),
      budget: z.number().optional(),
      timeline: z.string().optional(),
      teamSize: z.number().optional()
    }),
    outputSchema: subtaskSchema
  },
  async (input) => {
    const prompt = `
      基於以下專案資訊，生成 5-10 個具體的子任務：
      
      專案標題: ${input.projectTitle}
      專案描述: ${input.projectDescription}
      專案類型: ${input.projectType}
      ${input.budget ? `預算: $${input.budget}` : ''}
      ${input.timeline ? `時程: ${input.timeline}` : ''}
      ${input.teamSize ? `團隊規模: ${input.teamSize} 人` : ''}
      
      請為每個子任務提供：
      - 清晰的標題和描述
      - 合理的時間估算（小時）
      - 優先級（低/中/高）
      - 依賴關係
      - 所需技能
      
      確保子任務：
      - 具體且可執行
      - 時間估算合理
      - 優先級分配適當
      - 考慮依賴關係
    `
    
    const response = await gemini15Flash.generate({
      prompt,
      temperature: 0.3,
      maxOutputTokens: 2048
    })
    
    const result = subtaskSchema.parse(JSON.parse(response.text()))
    return result
  }
)

// 使用流程
export async function generateSubtasks(project: Project): Promise<Subtask[]> {
  try {
    const result = await runFlow(generateSubtasksFlow, {
      projectTitle: project.title,
      projectDescription: project.description,
      projectType: project.type || 'general',
      budget: project.budget,
      timeline: project.timeline,
      teamSize: project.teamSize
    })
    
    return result.subtasks
  } catch (error) {
    console.error('Failed to generate subtasks:', error)
    throw new Error('Failed to generate subtasks')
  }
}
```

#### 專案進度分析
```typescript
// lib/ai/flows/analyze-project-progress-flow.ts
import { defineFlow, runFlow } from '@genkit-ai/core'
import { gemini15Flash } from '@genkit-ai/googleai/gemini'
import { z } from 'zod'

const projectAnalysisSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']),
  riskFactors: z.array(z.string()),
  progressAssessment: z.string(),
  recommendations: z.array(z.string()),
  estimatedCompletion: z.string(),
  confidence: z.number().min(0).max(1)
})

export const analyzeProjectProgressFlow = defineFlow(
  {
    name: 'analyzeProjectProgress',
    inputSchema: z.object({
      project: z.object({
        title: z.string(),
        description: z.string(),
        status: z.string(),
        progress: z.number(),
        startDate: z.string(),
        endDate: z.string().optional(),
        tasks: z.array(z.object({
          title: z.string(),
          status: z.string(),
          progress: z.number(),
          dueDate: z.string().optional(),
          completedAt: z.string().optional()
        }))
      })
    }),
    outputSchema: projectAnalysisSchema
  },
  async (input) => {
    const prompt = `
      分析以下專案的進度和風險：
      
      專案: ${input.project.title}
      描述: ${input.project.description}
      狀態: ${input.project.status}
      進度: ${input.project.progress}%
      開始日期: ${input.project.startDate}
      ${input.project.endDate ? `結束日期: ${input.project.endDate}` : ''}
      
      任務狀態:
      ${input.project.tasks.map(task => 
        `- ${task.title}: ${task.status} (${task.progress}%) ${task.dueDate ? `到期: ${task.dueDate}` : ''}`
      ).join('\n')}
      
      請提供：
      1. 風險等級評估（低/中/高）
      2. 主要風險因素
      3. 進度評估
      4. 改進建議
      5. 預估完成時間
      6. 分析信心度
    `
    
    const response = await gemini15Flash.generate({
      prompt,
      temperature: 0.2,
      maxOutputTokens: 1024
    })
    
    const result = projectAnalysisSchema.parse(JSON.parse(response.text()))
    return result
  }
)

// 使用流程
export async function analyzeProjectProgress(project: Project): Promise<ProjectAnalysis> {
  try {
    const result = await runFlow(analyzeProjectProgressFlow, { project })
    return result
  } catch (error) {
    console.error('Failed to analyze project progress:', error)
    throw new Error('Failed to analyze project progress')
  }
}
```

### 2. Document AI 功能

#### 文件內容解析
```typescript
// lib/ai/flows/parse-document-flow.ts
import { defineFlow, runFlow } from '@genkit-ai/core'
import { gemini15Flash } from '@genkit-ai/googleai/gemini'
import { z } from 'zod'

const parsedDocumentSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  actionItems: z.array(z.string()),
  riskFactors: z.array(z.string()),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  entities: z.array(z.object({
    name: z.string(),
    type: z.string(),
    value: z.string()
  })),
  categories: z.array(z.string()),
  confidence: z.number().min(0).max(1)
})

export const parseDocumentFlow = defineFlow(
  {
    name: 'parseDocument',
    inputSchema: z.object({
      content: z.string(),
      documentType: z.string(),
      context: z.string().optional()
    }),
    outputSchema: parsedDocumentSchema
  },
  async (input) => {
    const prompt = `
      解析以下文件內容：
      
      文件類型: ${input.documentType}
      ${input.context ? `上下文: ${input.context}` : ''}
      
      內容:
      ${input.content}
      
      請提供：
      1. 文件摘要（2-3 句話）
      2. 關鍵要點（5-8 個）
      3. 行動項目（3-5 個）
      4. 風險因素（2-4 個）
      5. 情感傾向（正面/中性/負面）
      6. 實體識別（人名、組織、日期、金額等）
      7. 文件分類
      8. 解析信心度
    `
    
    const response = await gemini15Flash.generate({
      prompt,
      temperature: 0.1,
      maxOutputTokens: 2048
    })
    
    const result = parsedDocumentSchema.parse(JSON.parse(response.text()))
    return result
  }
)

// 使用流程
export async function parseDocument(
  content: string, 
  documentType: string, 
  context?: string
): Promise<ParsedDocument> {
  try {
    const result = await runFlow(parseDocumentFlow, {
      content,
      documentType,
      context
    })
    return result
  } catch (error) {
    console.error('Failed to parse document:', error)
    throw new Error('Failed to parse document')
  }
}
```

#### 合約摘要生成
```typescript
// lib/ai/flows/summarize-contract-flow.ts
import { defineFlow, runFlow } from '@genkit-ai/core'
import { gemini15Flash } from '@genkit-ai/googleai/gemini'
import { z } from 'zod'

const contractSummarySchema = z.object({
  summary: z.string(),
  parties: z.array(z.object({
    name: z.string(),
    role: z.string(),
    obligations: z.array(z.string())
  })),
  keyTerms: z.array(z.object({
    term: z.string(),
    description: z.string(),
    importance: z.enum(['low', 'medium', 'high'])
  })),
  financialTerms: z.object({
    amount: z.string(),
    currency: z.string(),
    paymentSchedule: z.string(),
    penalties: z.array(z.string())
  }),
  risks: z.array(z.object({
    risk: z.string(),
    impact: z.enum(['low', 'medium', 'high']),
    mitigation: z.string()
  })),
  deadlines: z.array(z.object({
    event: z.string(),
    date: z.string(),
    consequences: z.string()
  }))
})

export const summarizeContractFlow = defineFlow(
  {
    name: 'summarizeContract',
    inputSchema: z.object({
      contractText: z.string(),
      contractType: z.string()
    }),
    outputSchema: contractSummarySchema
  },
  async (input) => {
    const prompt = `
      分析以下合約內容：
      
      合約類型: ${input.contractType}
      
      合約內容:
      ${input.contractText}
      
      請提供：
      1. 合約摘要（3-4 句話）
      2. 當事方及其義務
      3. 關鍵條款
      4. 財務條款
      5. 風險評估
      6. 重要期限
      
      注意識別：
      - 法律風險
      - 財務影響
      - 時間限制
      - 違約後果
    `
    
    const response = await gemini15Flash.generate({
      prompt,
      temperature: 0.1,
      maxOutputTokens: 3072
    })
    
    const result = contractSummarySchema.parse(JSON.parse(response.text()))
    return result
  }
)

// 使用流程
export async function summarizeContract(
  contractText: string, 
  contractType: string
): Promise<ContractSummary> {
  try {
    const result = await runFlow(summarizeContractFlow, {
      contractText,
      contractType
    })
    return result
  } catch (error) {
    console.error('Failed to summarize contract:', error)
    throw new Error('Failed to summarize contract')
  }
}
```

### 3. Partner AI 功能

#### 夥伴推薦
```typescript
// lib/ai/flows/partner-suggestions-flow.ts
import { defineFlow, runFlow } from '@genkit-ai/core'
import { gemini15Flash } from '@genkit-ai/googleai/gemini'
import { z } from 'zod'

const partnerSuggestionSchema = z.object({
  suggestions: z.array(z.object({
    partnerId: z.string(),
    partnerName: z.string(),
    matchScore: z.number().min(0).max(100),
    reasoning: z.string(),
    skills: z.array(z.string()),
    availability: z.enum(['available', 'busy', 'unavailable']),
    estimatedCost: z.string(),
    timeline: z.string()
  }))
})

export const partnerSuggestionsFlow = defineFlow(
  {
    name: 'partnerSuggestions',
    inputSchema: z.object({
      project: z.object({
        title: z.string(),
        description: z.string(),
        requirements: z.array(z.string()),
        budget: z.number(),
        timeline: z.string(),
        location: z.string().optional()
      }),
      availablePartners: z.array(z.object({
        id: z.string(),
        name: z.string(),
        skills: z.array(z.string()),
        experience: z.string(),
        rating: z.number(),
        availability: z.string(),
        costRange: z.string()
      }))
    }),
    outputSchema: partnerSuggestionSchema
  },
  async (input) => {
    const prompt = `
      基於以下專案需求，推薦最適合的合作夥伴：
      
      專案: ${input.project.title}
      描述: ${input.project.description}
      需求: ${input.project.requirements.join(', ')}
      預算: $${input.project.budget}
      時程: ${input.project.timeline}
      ${input.project.location ? `地點: ${input.project.location}` : ''}
      
      可用夥伴:
      ${input.availablePartners.map(partner => 
        `- ${partner.name}: ${partner.skills.join(', ')} | 經驗: ${partner.experience} | 評分: ${partner.rating}/5 | 可用性: ${partner.availability} | 成本: ${partner.costRange}`
      ).join('\n')}
      
      請為每個推薦的夥伴提供：
      1. 匹配分數（0-100）
      2. 推薦理由
      3. 相關技能
      4. 可用性評估
      5. 預估成本
      6. 時程建議
      
      按匹配分數排序，提供前 5 個建議。
    `
    
    const response = await gemini15Flash.generate({
      prompt,
      temperature: 0.3,
      maxOutputTokens: 2048
    })
    
    const result = partnerSuggestionSchema.parse(JSON.parse(response.text()))
    return result
  }
)

// 使用流程
export async function suggestPartners(
  project: Project, 
  availablePartners: Partner[]
): Promise<PartnerSuggestion[]> {
  try {
    const result = await runFlow(partnerSuggestionsFlow, {
      project: {
        title: project.title,
        description: project.description,
        requirements: project.requirements || [],
        budget: project.budget || 0,
        timeline: project.timeline || '',
        location: project.location
      },
      availablePartners: availablePartners.map(partner => ({
        id: partner.id,
        name: partner.name,
        skills: partner.skills || [],
        experience: partner.experience || '',
        rating: partner.rating || 0,
        availability: partner.availability || 'unknown',
        costRange: partner.costRange || 'unknown'
      }))
    })
    
    return result.suggestions
  } catch (error) {
    console.error('Failed to suggest partners:', error)
    throw new Error('Failed to suggest partners')
  }
}
```

### 4. 跨模組 AI 功能

#### 業務洞察生成
```typescript
// lib/ai/flows/business-insights-flow.ts
import { defineFlow, runFlow } from '@genkit-ai/core'
import { gemini15Flash } from '@genkit-ai/googleai/gemini'
import { z } from 'zod'

const businessInsightSchema = z.object({
  insights: z.array(z.object({
    type: z.enum(['trend', 'anomaly', 'opportunity', 'risk']),
    title: z.string(),
    description: z.string(),
    confidence: z.number().min(0).max(1),
    impact: z.enum(['low', 'medium', 'high']),
    recommendations: z.array(z.string()),
    dataPoints: z.array(z.string()),
    timeframe: z.string()
  }))
})

export const businessInsightsFlow = defineFlow(
  {
    name: 'businessInsights',
    inputSchema: z.object({
      portfolioData: z.object({
        totalProjects: z.number(),
        activeProjects: z.number(),
        completedProjects: z.number(),
        averageProgress: z.number(),
        totalBudget: z.number(),
        averageProjectDuration: z.number()
      }),
      partnerData: z.object({
        totalPartners: z.number(),
        activeCollaborations: z.number(),
        averageRating: z.number(),
        topSkills: z.array(z.string())
      }),
      documentData: z.object({
        totalDocuments: z.number(),
        processedDocuments: z.number(),
        averageProcessingTime: z.number(),
        documentTypes: z.array(z.object({
          type: z.string(),
          count: z.number()
        }))
      }),
      timeRange: z.string()
    }),
    outputSchema: businessInsightSchema
  },
  async (input) => {
    const prompt = `
      基於以下業務數據，生成業務洞察：
      
      時間範圍: ${input.timeRange}
      
      專案組合數據:
      - 總專案數: ${input.portfolioData.totalProjects}
      - 活躍專案: ${input.portfolioData.activeProjects}
      - 已完成專案: ${input.portfolioData.completedProjects}
      - 平均進度: ${input.portfolioData.averageProgress}%
      - 總預算: $${input.portfolioData.totalBudget}
      - 平均專案時長: ${input.portfolioData.averageProjectDuration} 天
      
      夥伴關係數據:
      - 總夥伴數: ${input.partnerData.totalPartners}
      - 活躍協作: ${input.partnerData.activeCollaborations}
      - 平均評分: ${input.partnerData.averageRating}/5
      - 主要技能: ${input.partnerData.topSkills.join(', ')}
      
      文件處理數據:
      - 總文件數: ${input.documentData.totalDocuments}
      - 已處理文件: ${input.documentData.processedDocuments}
      - 平均處理時間: ${input.documentData.averageProcessingTime} 分鐘
      - 文件類型分布: ${input.documentData.documentTypes.map(dt => `${dt.type}: ${dt.count}`).join(', ')}
      
      請分析並提供：
      1. 趨勢洞察（3-5 個）
      2. 異常檢測（1-3 個）
      3. 機會識別（2-4 個）
      4. 風險評估（2-4 個）
      
      每個洞察應包含：
      - 類型分類
      - 標題和描述
      - 信心度
      - 影響程度
      - 具體建議
      - 相關數據點
      - 時間框架
    `
    
    const response = await gemini15Flash.generate({
      prompt,
      temperature: 0.2,
      maxOutputTokens: 4096
    })
    
    const result = businessInsightSchema.parse(JSON.parse(response.text()))
    return result
  }
)

// 使用流程
export async function generateBusinessInsights(
  portfolioData: any, 
  partnerData: any, 
  documentData: any, 
  timeRange: string
): Promise<BusinessInsight[]> {
  try {
    const result = await runFlow(businessInsightsFlow, {
      portfolioData,
      partnerData,
      documentData,
      timeRange
    })
    
    return result.insights
  } catch (error) {
    console.error('Failed to generate business insights:', error)
    throw new Error('Failed to generate business insights')
  }
}
```

## 整合策略

### 1. 與 Server Actions 整合

#### AI 功能整合到 Server Actions
```typescript
// lib/actions/ai-actions.ts
'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath, revalidateTag } from 'next/cache'
import { generateSubtasks } from '@/lib/ai/flows/generate-subtasks-flow'
import { analyzeProjectProgress } from '@/lib/ai/flows/analyze-project-progress-flow'
import { parseDocument } from '@/lib/ai/flows/parse-document-flow'
import { suggestPartners } from '@/lib/ai/flows/partner-suggestions-flow'
import { generateBusinessInsights } from '@/lib/ai/flows/business-insights-flow'

export async function generateProjectSubtasks(projectId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    // 獲取專案資料
    const project = await projectService.getProject(projectId, userId)
    if (!project) {
      throw new Error('Project not found')
    }

    // 生成子任務
    const subtasks = await generateSubtasks(project)
    
    // 建立子任務記錄
    const createdSubtasks = await Promise.all(
      subtasks.map(subtask => 
        taskService.createTask({
          ...subtask,
          projectId,
          createdBy: userId
        })
      )
    )
    
    // 重新驗證快取
    revalidateTag('tasks')
    revalidateTag(`project-${projectId}`)
    revalidatePath('/dashboard/portfolio')
    
    return { success: true, data: createdSubtasks }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function analyzeProjectWithAI(projectId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const project = await projectService.getProject(projectId, userId)
    if (!project) {
      throw new Error('Project not found')
    }

    const analysis = await analyzeProjectProgress(project)
    
    // 儲存分析結果
    await projectService.updateProject(projectId, {
      aiAnalysis: analysis,
      lastAnalyzedAt: new Date()
    }, userId)
    
    revalidateTag(`project-${projectId}`)
    revalidatePath('/dashboard/portfolio')
    
    return { success: true, data: analysis }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

### 2. 與 TanStack Query 整合

#### AI 查詢 Hooks
```typescript
// lib/queries/ai-queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { generateProjectSubtasks, analyzeProjectWithAI } from '@/lib/actions/ai-actions'

export function useAIGeneratedSubtasks(projectId: string) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['ai-subtasks', projectId],
    queryFn: () => generateProjectSubtasks(projectId),
    enabled: !!userId && !!projectId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAIProjectAnalysis(projectId: string) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['ai-analysis', projectId],
    queryFn: () => analyzeProjectWithAI(projectId),
    enabled: !!userId && !!projectId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useGenerateSubtasks() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: generateProjectSubtasks,
    onSuccess: (data, projectId) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['ai-subtasks', projectId] })
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      }
    },
  })
}

export function useAnalyzeProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: analyzeProjectWithAI,
    onSuccess: (data, projectId) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['ai-analysis', projectId] })
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })
}
```

## 效能最佳化

### 1. 快取策略

#### AI 結果快取
```typescript
// lib/cache/ai-cache.ts
export class AICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttl: number = 30 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  invalidate(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

export const aiCache = new AICache()
```

### 2. 批次處理

#### 批次 AI 處理
```typescript
// lib/ai/batch-processor.ts
export class AIBatchProcessor {
  private queue: Array<{
    id: string
    type: string
    data: any
    resolve: (value: any) => void
    reject: (error: Error) => void
  }> = []
  
  private processing = false
  private batchSize = 5
  private batchDelay = 1000 // 1 second
  
  async addToQueue<T>(
    type: string, 
    data: any, 
    processor: (batch: any[]) => Promise<T[]>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id: Math.random().toString(36),
        type,
        data,
        resolve,
        reject
      })
      
      this.processQueue(processor)
    })
  }
  
  private async processQueue<T>(
    processor: (batch: any[]) => Promise<T[]>
  ) {
    if (this.processing) return
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize)
      
      try {
        const batchData = batch.map(item => item.data)
        const results = await processor(batchData)
        
        batch.forEach((item, index) => {
          item.resolve(results[index])
        })
      } catch (error) {
        batch.forEach(item => {
          item.reject(error as Error)
        })
      }
      
      // 批次間延遲
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.batchDelay))
      }
    }
    
    this.processing = false
  }
}

export const aiBatchProcessor = new AIBatchProcessor()
```

## 錯誤處理

### 1. AI 服務錯誤處理

#### 錯誤處理工具
```typescript
// lib/ai/error-handling.ts
export class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false,
    public details?: any
  ) {
    super(message)
    this.name = 'AIError'
  }
}

export function handleAIError(error: unknown): AIError {
  if (error instanceof AIError) {
    return error
  }
  
  if (error instanceof Error) {
    return new AIError(error.message, 'UNKNOWN_ERROR', false)
  }
  
  return new AIError('An unexpected AI error occurred', 'UNKNOWN_ERROR', false)
}

export function isRetryableError(error: AIError): boolean {
  return error.retryable
}

export async function retryAIOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      if (error instanceof AIError && !isRetryableError(error)) {
        throw error
      }
      
      // 指數退避
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }
  
  throw lastError!
}
```

## 監控和分析

### 1. AI 效能監控

#### 效能追蹤
```typescript
// lib/monitoring/ai-monitoring.ts
export class AIMonitoring {
  static trackFlowExecution(
    flowName: string, 
    duration: number, 
    success: boolean
  ) {
    analytics.track('ai_flow_execution', {
      flow: flowName,
      duration,
      success,
      timestamp: Date.now()
    })
  }
  
  static trackTokenUsage(
    flowName: string, 
    inputTokens: number, 
    outputTokens: number
  ) {
    analytics.track('ai_token_usage', {
      flow: flowName,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      timestamp: Date.now()
    })
  }
  
  static trackError(
    flowName: string, 
    error: Error, 
    context: any
  ) {
    errorReportingService.captureException(error, {
      tags: { 
        flow: flowName,
        service: 'ai'
      },
      extra: context
    })
  }
}
```

## 最佳實踐

### 1. 效能考量

- 使用快取減少重複 AI 調用
- 實作批次處理減少 API 調用
- 監控 token 使用量和成本
- 使用適當的模型和參數

### 2. 錯誤處理

- 實作重試機制
- 提供降級方案
- 記錄詳細錯誤資訊
- 實作用戶友好的錯誤訊息

### 3. 安全性

- 驗證所有 AI 輸入
- 限制 AI 輸出大小
- 實作速率限制
- 監控異常使用模式

### 4. 用戶體驗

- 提供載入狀態
- 實作進度指示器
- 允許用戶取消操作
- 提供結果預覽

這個 AI 整合實作模式確保了專案整合的智慧化、高效能和用戶友好性。