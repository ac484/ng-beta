# 專案整合測試策略

## 測試架構

### 1. 測試工具配置

#### Jest 配置
```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
}

export default createJestConfig(config)
```

#### Playwright 配置
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 2. 測試環境設定

#### Jest 設定檔
```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
import { server } from './src/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      publicMetadata: {
        permissions: ['portfolio:read', 'portfolio:write'],
        role: 'user',
      },
    },
  }),
  useAuth: () => ({
    signOut: jest.fn(),
  }),
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock Firebase
jest.mock('@/lib/firebase/config', () => ({
  db: {},
  auth: {},
  storage: {},
  appCheck: {
    getToken: jest.fn(() => Promise.resolve({ token: 'mock-token' })),
  },
}))
```

## 單元測試

### 1. 工具函數測試

#### 驗證函數測試
```typescript
// src/lib/validations/__tests__/portfolio.schemas.test.ts
import { projectCreateSchema, projectUpdateSchema } from '../portfolio.schemas'

describe('Portfolio Schemas', () => {
  describe('projectCreateSchema', () => {
    it('should validate valid project data', () => {
      const validData = {
        title: 'Test Project',
        description: 'Test Description',
        priority: 'medium',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      }
      
      const result = projectCreateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
    
    it('should reject invalid priority', () => {
      const invalidData = {
        title: 'Test Project',
        description: 'Test Description',
        priority: 'invalid',
        startDate: '2024-01-01',
      }
      
      const result = projectCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Priority')
      }
    })
    
    it('should require title and description', () => {
      const invalidData = {
        priority: 'medium',
        startDate: '2024-01-01',
      }
      
      const result = projectCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
  
  describe('projectUpdateSchema', () => {
    it('should allow partial updates', () => {
      const partialData = {
        title: 'Updated Title',
      }
      
      const result = projectUpdateSchema.safeParse(partialData)
      expect(result.success).toBe(true)
    })
    
    it('should validate status enum', () => {
      const validData = {
        status: 'active',
      }
      
      const result = projectUpdateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
```

### 2. 服務層測試

#### Firebase 服務測試
```typescript
// src/lib/services/__tests__/project-service.test.ts
import { ProjectService } from '../project-service'
import { mockProject, mockUser } from '@/__mocks__/data'

// Mock Firebase
jest.mock('@/lib/firebase/config', () => ({
  db: {},
}))

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}))

describe('ProjectService', () => {
  let projectService: ProjectService
  
  beforeEach(() => {
    projectService = new ProjectService()
  })
  
  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        priority: 'medium',
        startDate: new Date(),
        createdBy: mockUser.id,
        updatedBy: mockUser.id,
      }
      
      const result = await projectService.createProject(projectData, mockUser.id)
      
      expect(result).toMatchObject({
        ...projectData,
        id: expect.any(String),
        createdAt: expect.any(Object),
        updatedAt: expect.any(Object),
        version: 1,
      })
    })
  })
  
  describe('getProject', () => {
    it('should return project if found', async () => {
      const mockDoc = {
        exists: () => true,
        data: () => mockProject,
        id: mockProject.id,
      }
      
      jest.spyOn(projectService, 'read').mockResolvedValue(mockProject)
      
      const result = await projectService.getProject(mockProject.id, mockUser.id)
      
      expect(result).toEqual(mockProject)
    })
    
    it('should return null if project not found', async () => {
      jest.spyOn(projectService, 'read').mockResolvedValue(null)
      
      const result = await projectService.getProject('non-existent', mockUser.id)
      
      expect(result).toBeNull()
    })
  })
})
```

### 3. 元件測試

#### React 元件測試
```typescript
// src/components/portfolio/__tests__/project-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectCard } from '../project-card'
import { mockProject } from '@/__mocks__/data'

const mockOnEdit = jest.fn()
const mockOnDelete = jest.fn()

describe('ProjectCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should render project information correctly', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    expect(screen.getByText(mockProject.title)).toBeInTheDocument()
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    expect(screen.getByText(mockProject.priority)).toBeInTheDocument()
  })
  
  it('should call onEdit when edit button is clicked', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockProject)
  })
  
  it('should call onDelete when delete button is clicked', () => {
    render(
      <ProjectCard
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockProject.id)
  })
  
  it('should display progress bar correctly', () => {
    render(
      <ProjectCard
        project={{ ...mockProject, progress: 75 }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
  })
})
```

## 整合測試

### 1. Server Actions 測試

#### 認證整合測試
```typescript
// src/lib/actions/__tests__/portfolio-actions.test.ts
import { createProject, updateProject, deleteProject } from '../portfolio-actions'
import { mockProject, mockUser } from '@/__mocks__/data'

// Mock Clerk
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}))

// Mock Firebase service
jest.mock('@/lib/services/project-service', () => ({
  projectService: {
    createProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
  },
}))

describe('Portfolio Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('createProject', () => {
    it('should create project successfully for authenticated user', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth
      mockAuth.mockResolvedValue({ userId: mockUser.id })
      
      const formData = new FormData()
      formData.append('title', 'Test Project')
      formData.append('description', 'Test Description')
      formData.append('priority', 'medium')
      
      const result = await createProject(formData)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
    
    it('should reject unauthenticated user', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth
      mockAuth.mockResolvedValue({ userId: null })
      
      const formData = new FormData()
      formData.append('title', 'Test Project')
      
      const result = await createProject(formData)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unauthorized')
    })
  })
  
  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth
      mockAuth.mockResolvedValue({ userId: mockUser.id })
      
      const formData = new FormData()
      formData.append('title', 'Updated Title')
      
      const result = await updateProject(mockProject.id, formData)
      
      expect(result.success).toBe(true)
    })
  })
})
```

### 2. API 路由測試

#### Route Handler 測試
```typescript
// src/app/api/projects/__tests__/route.test.ts
import { GET, POST } from '../route'
import { NextRequest } from 'next/server'
import { mockProject, mockUser } from '@/__mocks__/data'

// Mock Clerk
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}))

// Mock project service
jest.mock('@/lib/services/project-service', () => ({
  projectService: {
    getProjects: jest.fn(),
    createProject: jest.fn(),
  },
}))

describe('Projects API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('GET', () => {
    it('should return projects for authenticated user', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth
      mockAuth.mockResolvedValue({ userId: mockUser.id })
      
      const mockGetProjects = require('@/lib/services/project-service').projectService.getProjects
      mockGetProjects.mockResolvedValue([mockProject])
      
      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual([mockProject])
    })
    
    it('should return 401 for unauthenticated user', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth
      mockAuth.mockResolvedValue({ userId: null })
      
      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      
      expect(response.status).toBe(401)
    })
  })
})
```

## E2E 測試

### 1. 用戶流程測試

#### 專案管理流程測試
```typescript
// tests/e2e/project-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // 登入
    await page.goto('/sign-in')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 等待重定向到儀表板
    await page.waitForURL('/dashboard')
  })
  
  test('should create a new project', async ({ page }) => {
    await page.goto('/dashboard/portfolio')
    
    // 點擊新增專案按鈕
    await page.click('button:has-text("新增專案")')
    
    // 填寫專案表單
    await page.fill('[name="title"]', 'E2E Test Project')
    await page.fill('[name="description"]', 'This is a test project for E2E testing')
    await page.selectOption('[name="priority"]', 'high')
    await page.fill('[name="startDate"]', '2024-01-01')
    await page.fill('[name="endDate"]', '2024-12-31')
    
    // 提交表單
    await page.click('button[type="submit"]')
    
    // 驗證成功訊息
    await expect(page.locator('text=專案建立成功')).toBeVisible()
    
    // 驗證專案出現在列表中
    await expect(page.locator('text=E2E Test Project')).toBeVisible()
  })
  
  test('should edit an existing project', async ({ page }) => {
    await page.goto('/dashboard/portfolio')
    
    // 點擊專案的編輯按鈕
    await page.click('button:has-text("編輯")')
    
    // 修改專案標題
    await page.fill('[name="title"]', 'Updated E2E Project')
    
    // 提交表單
    await page.click('button[type="submit"]')
    
    // 驗證成功訊息
    await expect(page.locator('text=專案更新成功')).toBeVisible()
    
    // 驗證專案標題已更新
    await expect(page.locator('text=Updated E2E Project')).toBeVisible()
  })
  
  test('should delete a project', async ({ page }) => {
    await page.goto('/dashboard/portfolio')
    
    // 點擊專案的刪除按鈕
    await page.click('button:has-text("刪除")')
    
    // 確認刪除對話框
    await page.click('button:has-text("確認")')
    
    // 驗證成功訊息
    await expect(page.locator('text=專案刪除成功')).toBeVisible()
    
    // 驗證專案已從列表中移除
    await expect(page.locator('text=Test Project')).not.toBeVisible()
  })
})
```

### 2. 認證流程測試

#### 登入登出流程測試
```typescript
// tests/e2e/authentication.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should sign in successfully', async ({ page }) => {
    await page.goto('/sign-in')
    
    // 填寫登入表單
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 等待重定向到儀表板
    await page.waitForURL('/dashboard')
    
    // 驗證用戶已登入
    await expect(page.locator('text=歡迎')).toBeVisible()
  })
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in')
    
    // 填寫無效的登入資訊
    await page.fill('[name="email"]', 'invalid@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // 驗證錯誤訊息
    await expect(page.locator('text=登入失敗')).toBeVisible()
  })
  
  test('should sign out successfully', async ({ page }) => {
    // 先登入
    await page.goto('/sign-in')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // 點擊登出按鈕
    await page.click('button:has-text("登出")')
    
    // 等待重定向到登入頁面
    await page.waitForURL('/sign-in')
    
    // 驗證已登出
    await expect(page.locator('text=登入')).toBeVisible()
  })
})

#### App Check 整合測試
```typescript
// tests/e2e/app-check-integration.spec.ts
import { test, expect } from '@playwright/test'

test.describe('App Check Integration', () => {
  test.beforeEach(async ({ page }) => {
    // 登入
    await page.goto('/sign-in')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })
  
  test('should include App Check token in API requests', async ({ page }) => {
    // 監聽網路請求
    const requests: any[] = []
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        requests.push({
          url: request.url(),
          headers: request.headers(),
        })
      }
    })
    
    // 執行需要 App Check 的操作
    await page.goto('/dashboard/portfolio')
    await page.click('button:has-text("新增專案")')
    await page.fill('[name="title"]', 'App Check Test Project')
    await page.click('button[type="submit"]')
    
    // 驗證請求包含 App Check token
    const apiRequest = requests.find(req => req.url.includes('/api/projects'))
    expect(apiRequest).toBeDefined()
    expect(apiRequest.headers['x-firebase-appcheck']).toBeDefined()
  })
  
  test('should handle App Check token expiration', async ({ page }) => {
    // 模擬 App Check token 過期
    await page.addInitScript(() => {
      // Mock expired token
      window.localStorage.setItem('firebase:appCheck:token', 'expired-token')
    })
    
    await page.goto('/dashboard/portfolio')
    
    // 嘗試建立專案
    await page.click('button:has-text("新增專案")')
    await page.fill('[name="title"]', 'Token Expired Test')
    await page.click('button[type="submit"]')
    
    // 應該顯示 App Check 錯誤
    await expect(page.locator('text=App Check validation failed')).toBeVisible()
  })
})
```
```

## 效能測試

### 1. 載入效能測試

#### 頁面載入測試
```typescript
// tests/performance/page-load.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Page Load Performance', () => {
  test('dashboard should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/dashboard')
    
    // 等待頁面完全載入
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000)
  })
  
  test('portfolio page should load within 2 seconds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/dashboard/portfolio')
    
    // 等待專案列表載入
    await page.waitForSelector('[data-testid="project-list"]')
    
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(2000)
  })
})
```

### 2. 記憶體使用測試

#### 記憶體洩漏測試
```typescript
// tests/performance/memory-leak.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Memory Leak Detection', () => {
  test('should not increase memory usage significantly', async ({ page }) => {
    const initialMemory = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0)
    
    // 執行多個操作
    for (let i = 0; i < 10; i++) {
      await page.goto('/dashboard/portfolio')
      await page.waitForSelector('[data-testid="project-list"]')
      await page.click('button:has-text("新增專案")')
      await page.fill('[name="title"]', `Test Project ${i}`)
      await page.click('button:has-text("取消")')
    }
    
    const finalMemory = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0)
    const memoryIncrease = finalMemory - initialMemory
    
    // 記憶體增加不應超過 10MB
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
  })
})
```

## 測試資料管理

### 1. Mock 資料

#### 測試資料定義
```typescript
// src/__mocks__/data.ts
export const mockUser = {
  id: 'test-user-id',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  role: 'user',
  permissions: ['portfolio:read', 'portfolio:write'],
}

export const mockProject = {
  id: 'test-project-id',
  title: 'Test Project',
  description: 'This is a test project',
  status: 'active',
  priority: 'medium',
  progress: 50,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  createdBy: mockUser.id,
  updatedBy: mockUser.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
}

export const mockPartner = {
  id: 'test-partner-id',
  name: 'Test Partner',
  type: 'vendor',
  status: 'active',
  rating: 4.5,
  createdBy: mockUser.id,
  updatedBy: mockUser.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
}

export const mockDocument = {
  id: 'test-document-id',
  filename: 'test-document.pdf',
  originalName: 'Test Document.pdf',
  mimeType: 'application/pdf',
  size: 1024 * 1024, // 1MB
  url: 'https://example.com/test-document.pdf',
  status: 'processed',
  aiProcessed: true,
  createdBy: mockUser.id,
  updatedBy: mockUser.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
}
```

### 2. Mock 服務

#### Firebase Mock
```typescript
// src/__mocks__/firebase.ts
export const mockFirebaseService = {
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  list: jest.fn(),
  batchWrite: jest.fn(),
}

export const mockProjectService = {
  createProject: jest.fn(),
  getProject: jest.fn(),
  getProjects: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
  getProjectStats: jest.fn(),
}

export const mockPartnerService = {
  createPartner: jest.fn(),
  getPartner: jest.fn(),
  getPartners: jest.fn(),
  updatePartner: jest.fn(),
  deletePartner: jest.fn(),
  getPartnerNetwork: jest.fn(),
}

export const mockDocumentService = {
  uploadDocument: jest.fn(),
  getDocument: jest.fn(),
  getDocuments: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
  getDocumentAnalytics: jest.fn(),
}
```

## 測試自動化

### 1. CI/CD 整合

#### GitHub Actions 配置
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
    
  e2e:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### 2. 測試腳本

#### Package.json 腳本
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=__tests__ --testPathPattern=\\.test\\.",
    "test:integration": "jest --testPathPattern=__tests__ --testPathPattern=\\.spec\\.",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## App Check 測試

### 1. App Check 功能測試

#### App Check Token 測試
```typescript
// src/lib/services/__tests__/app-check-service.test.ts
import { getAppCheckToken } from '../app-check-service'

// Mock Firebase App Check
jest.mock('@/lib/firebase/config', () => ({
  appCheck: {
    getToken: jest.fn(),
  },
}))

describe('App Check Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('getAppCheckToken', () => {
    it('should return valid token', async () => {
      const mockToken = { token: 'valid-token-123' }
      const mockGetToken = require('@/lib/firebase/config').appCheck.getToken
      mockGetToken.mockResolvedValue(mockToken)
      
      const result = await getAppCheckToken()
      
      expect(result).toEqual(mockToken)
      expect(mockGetToken).toHaveBeenCalledWith({ forceRefresh: false })
    })
    
    it('should handle token refresh', async () => {
      const mockToken = { token: 'refreshed-token-456' }
      const mockGetToken = require('@/lib/firebase/config').appCheck.getToken
      mockGetToken.mockResolvedValue(mockToken)
      
      const result = await getAppCheckToken(true)
      
      expect(result).toEqual(mockToken)
      expect(mockGetToken).toHaveBeenCalledWith({ forceRefresh: true })
    })
    
    it('should handle errors gracefully', async () => {
      const mockGetToken = require('@/lib/firebase/config').appCheck.getToken
      mockGetToken.mockRejectedValue(new Error('Token generation failed'))
      
      await expect(getAppCheckToken()).rejects.toThrow('Token generation failed')
    })
  })
})
```

#### App Check 整合測試
```typescript
// src/lib/actions/__tests__/app-check-actions.test.ts
import { createProjectWithAppCheck } from '../portfolio-actions'
import { mockProject, mockUser } from '@/__mocks__/data'

// Mock App Check
jest.mock('@/lib/services/app-check-service', () => ({
  getAppCheckToken: jest.fn(),
}))

// Mock Firebase service
jest.mock('@/lib/services/project-service', () => ({
  projectService: {
    createProject: jest.fn(),
  },
}))

describe('App Check Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('createProjectWithAppCheck', () => {
    it('should include App Check token in request', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth
      mockAuth.mockResolvedValue({ userId: mockUser.id })
      
      const mockGetToken = require('@/lib/services/app-check-service').getAppCheckToken
      mockGetToken.mockResolvedValue({ token: 'app-check-token' })
      
      const mockCreateProject = require('@/lib/services/project-service').projectService.createProject
      mockCreateProject.mockResolvedValue(mockProject)
      
      const formData = new FormData()
      formData.append('title', 'Test Project')
      
      const result = await createProjectWithAppCheck(formData)
      
      expect(result.success).toBe(true)
      expect(mockGetToken).toHaveBeenCalled()
      expect(mockCreateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Project',
          appCheckToken: 'app-check-token',
        }),
        mockUser.id
      )
    })
    
    it('should fail if App Check token is invalid', async () => {
      const mockAuth = require('@clerk/nextjs/server').auth
      mockAuth.mockResolvedValue({ userId: mockUser.id })
      
      const mockGetToken = require('@/lib/services/app-check-service').getAppCheckToken
      mockGetToken.mockRejectedValue(new Error('Invalid App Check token'))
      
      const formData = new FormData()
      formData.append('title', 'Test Project')
      
      const result = await createProjectWithAppCheck(formData)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('App Check validation failed')
    })
  })
})
```

### 2. App Check 環境測試

#### 環境變數測試
```typescript
// src/config/__tests__/environment.test.ts
import { environment, getCurrentEnvironment } from '../environment'

describe('Environment Configuration', () => {
  describe('Firebase App Check', () => {
    it('should include App Check configuration for all environments', () => {
      expect(environment.development.firebase.appCheck).toBeDefined()
      expect(environment.staging.firebase.appCheck).toBeDefined()
      expect(environment.production.firebase.appCheck).toBeDefined()
    })
    
    it('should have recaptcha site key for development', () => {
      expect(environment.development.firebase.appCheck.recaptchaSiteKey).toBeDefined()
      expect(typeof environment.development.firebase.appCheck.recaptchaSiteKey).toBe('string')
    })
    
    it('should have recaptcha site key for staging', () => {
      expect(environment.staging.firebase.appCheck.appCheck.recaptchaSiteKey).toBeDefined()
      expect(typeof environment.staging.firebase.appCheck.appCheck.recaptchaSiteKey).toBe('string')
    })
    
    it('should have recaptcha site key for production', () => {
      expect(environment.production.firebase.appCheck.appCheck.recaptchaSiteKey).toBeDefined()
      expect(typeof environment.production.firebase.appCheck.appCheck.recaptchaSiteKey).toBe('string')
    })
  })
})
```

## 最佳實踐

### 1. 測試組織

- 使用描述性的測試名稱
- 組織測試為邏輯群組
- 保持測試獨立性
- 使用適當的測試資料

### 2. 測試覆蓋率

- 目標達到 80% 以上的覆蓋率
- 重點測試業務邏輯
- 測試錯誤處理路徑
- 測試邊界條件

### 3. 測試維護

- 定期更新測試資料
- 重構測試以反映程式碼變更
- 使用測試工廠函數
- 實作測試資料清理

### 4. 效能考量

- 使用測試資料庫而非生產資料庫
- 實作測試並行化
- 優化測試執行時間
- 監控測試資源使用

這個測試策略確保了專案整合的品質、可靠性和可維護性。