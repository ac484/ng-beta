# 專案整合部署策略

## 部署架構

### 1. 多環境配置

#### Firebase App Check 配置
Firebase App Check 是一個安全功能，用於防止濫用和確保只有合法的應用可以存取 Firebase 服務。

**App Check 的作用：**
- 防止惡意用戶濫用 Firebase 服務
- 驗證請求來自合法的應用
- 提供額外的安全層級
- 支援 reCAPTCHA v3 驗證

**配置說明：**
- `NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY`: reCAPTCHA v3 的網站金鑰
- 每個環境都需要獨立的 reCAPTCHA 金鑰
- 開發環境可以使用測試金鑰
- 生產環境必須使用正式金鑰

**Firebase Analytics 配置說明：**
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Firebase Analytics 的測量 ID
- 用於追蹤用戶行為和應用效能
- 每個環境可以使用相同的測量 ID
- 生產環境建議啟用 Analytics 功能

#### 環境變數管理
```typescript
// src/config/environment.ts
export const environment = {
  development: {
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_DEV,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_DEV,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_DEV,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEV,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_DEV,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_DEV,
      appCheck: {
        recaptchaSiteKey: process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY_DEV,
      },
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV,
      secretKey: process.env.CLERK_SECRET_KEY_DEV,
    },
    genkit: {
      apiKey: process.env.GENKIT_API_KEY_DEV,
      projectId: process.env.GENKIT_PROJECT_ID_DEV,
    },
    database: {
      url: process.env.DATABASE_URL_DEV,
    },
  },
  staging: {
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_STAGING,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_STAGING,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_STAGING,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_STAGING,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_STAGING,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_STAGING,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_STAGING,
      appCheck: {
        recaptchaSiteKey: process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY_STAGING,
      },
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_STAGING,
      secretKey: process.env.CLERK_SECRET_KEY_STAGING,
    },
    genkit: {
      apiKey: process.env.GENKIT_API_KEY_STAGING,
      projectId: process.env.GENKIT_PROJECT_ID_STAGING,
    },
    database: {
      url: process.env.DATABASE_URL_STAGING,
    },
  },
  production: {
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PROD,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_PROD,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD,
      appCheck: {
        recaptchaSiteKey: process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY_PROD,
      },
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_PROD,
      secretKey: process.env.CLERK_SECRET_KEY_PROD,
    },
    genkit: {
      apiKey: process.env.GENKIT_API_KEY_PROD,
      projectId: process.env.GENKIT_PROJECT_ID_PROD,
    },
    database: {
      url: process.env.DATABASE_URL_PROD,
    },
  },
}

export const getCurrentEnvironment = () => {
  const env = process.env.NODE_ENV || 'development'
  return environment[env as keyof typeof environment] || environment.development
}
```

#### 環境變數範例
```bash
# .env.development
NEXT_PUBLIC_FIREBASE_API_KEY_DEV=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV=your-dev-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID_DEV=your-dev-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_DEV=your-dev-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEV=123456789
NEXT_PUBLIC_FIREBASE_APP_ID_DEV=your_dev_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_DEV=your_dev_measurement_id
NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY_DEV=your_dev_recaptcha_site_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV=pk_test_your_dev_key
CLERK_SECRET_KEY_DEV=sk_test_your_dev_secret

GENKIT_API_KEY_DEV=your_dev_genkit_key
GENKIT_PROJECT_ID_DEV=your_dev_genkit_project

DATABASE_URL_DEV=your_dev_database_url

# .env.staging
NEXT_PUBLIC_FIREBASE_API_KEY_STAGING=your_staging_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_STAGING=your-staging-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID_STAGING=your-staging-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_STAGING=your-staging-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_STAGING=123456789
NEXT_PUBLIC_FIREBASE_APP_ID_STAGING=your_staging_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_STAGING=your_staging_measurement_id
NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY_STAGING=your_staging_recaptcha_site_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_STAGING=pk_test_your_staging_key
CLERK_SECRET_KEY_STAGING=sk_test_your_staging_secret

GENKIT_API_KEY_STAGING=your_staging_genkit_key
GENKIT_PROJECT_ID_STAGING=your_staging_genkit_project

DATABASE_URL_STAGING=your_staging_database_url

# .env.production
NEXT_PUBLIC_FIREBASE_API_KEY_PROD=your_prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD=your-prod-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD=your-prod-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD=your-prod-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD=123456789
NEXT_PUBLIC_FIREBASE_APP_ID_PROD=your_prod_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD=your_prod_measurement_id
NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY_PROD=your_prod_recaptcha_site_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_PROD=pk_live_your_prod_key
CLERK_SECRET_KEY_PROD=sk_live_your_prod_secret

GENKIT_API_KEY_PROD=your_prod_genkit_key
GENKIT_PROJECT_ID_PROD=your_prod_genkit_project

DATABASE_URL_PROD=your_prod_database_url
```

### 2. 部署配置

#### Next.js 配置
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 輸出配置
  output: 'standalone',
  
  // 實驗性功能
  experimental: {
    // 啟用 App Router
    appDir: true,
    
    // 啟用 Server Actions
    serverActions: true,
    
    // 啟用 Parallel Routes
    parallelRoutes: true,
    
    // 啟用 Turbopack (開發環境)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // 圖片優化
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'images.clerk.dev',
      'lh3.googleusercontent.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 環境變數
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 重寫規則
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  
  // 重定向規則
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
  
  // 標頭配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
  
  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 優化 bundle 大小
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },
}

export default nextConfig
```

## 容器化部署

### 1. Docker 配置

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 安裝依賴
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 複製 package 檔案
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 建置應用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 設定環境變數
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY
ARG GENKIT_API_KEY
ARG GENKIT_PROJECT_ID

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY
ENV GENKIT_API_KEY=$GENKIT_API_KEY
ENV GENKIT_PROJECT_ID=$GENKIT_PROJECT_ID

# 建置應用
RUN npm run build

# 生產環境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製建置結果
COPY --from=builder /app/public ./public

# 設定正確的權限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 複製 Next.js 應用
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY}
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
        NEXT_PUBLIC_FIREBASE_APP_ID: ${NEXT_PUBLIC_FIREBASE_APP_ID}
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY: ${NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY}
        GENKIT_API_KEY: ${GENKIT_API_KEY}
        GENKIT_PROJECT_ID: ${GENKIT_PROJECT_ID}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    depends_on:
      - redis
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### 2. Nginx 配置

#### Nginx 設定檔
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 快取設定
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

    server {
        listen 80;
        server_name localhost;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name localhost;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # 安全標頭
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # 靜態資源快取
        location /_next/static/ {
            alias /var/cache/nginx/;
            expires 365d;
            access_log off;
            add_header Cache-Control "public, immutable";
        }

        # API 路由
        location /api/ {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_cache STATIC;
            proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
            proxy_cache_valid 200 1m;
        }

        # 主要應用
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 雲端部署

### 1. Vercel 部署

#### Vercel 配置
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase-api-key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "@firebase-app-id",
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID": "@firebase-measurement-id",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@clerk-publishable-key",
    "NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY": "@firebase-appcheck-recaptcha-site-key",
    "CLERK_SECRET_KEY": "@clerk-secret-key",
    "GENKIT_API_KEY": "@genkit-api-key",
    "GENKIT_PROJECT_ID": "@genkit-project-id"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### 2. AWS 部署

#### AWS CDK 配置
```typescript
// infrastructure/lib/app-stack.ts
import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import { Construct } from 'constructs'

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // VPC
    const vpc = new ec2.Vpc(this, 'AppVPC', {
      maxAzs: 2,
      natGateways: 1,
    })

    // ECR Repository
    const repository = new ecr.Repository(this, 'AppRepository', {
      repositoryName: 'ng-beta-app',
      imageScanOnPush: true,
    })

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'AppCluster', {
      vpc,
      containerInsights: true,
    })

    // Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'AppTask', {
      memoryLimitMiB: 1024,
      cpu: 512,
    })

    // Container
    const container = taskDefinition.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'AppContainer',
        logRetention: logs.RetentionDays.ONE_MONTH,
      }),
      environment: {
        NODE_ENV: 'production',
      },
      secrets: {
        DATABASE_URL: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(this, 'DatabaseSecret', 'database-url')
        ),
        CLERK_SECRET_KEY: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(this, 'ClerkSecret', 'clerk-secret-key')
        ),
      },
    })

    container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    })

    // ECS Service
    const service = new ecs.FargateService(this, 'AppService', {
      cluster,
      taskDefinition,
      desiredCount: 2,
      assignPublicIp: false,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }),
    })

    // Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'AppALB', {
      vpc,
      internetFacing: true,
    })

    const listener = alb.addListener('AppListener', {
      port: 80,
      open: true,
    })

    listener.addTargets('AppTarget', {
      port: 80,
      targets: [service],
      healthCheck: {
        path: '/api/health',
        healthyHttpCodes: '200',
      },
    })

    // Auto Scaling
    const scaling = service.autoScaleTaskCount({
      minCapacity: 2,
      maxCapacity: 10,
    })

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    })

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
      description: 'Application Load Balancer DNS',
    })

    new cdk.CfnOutput(this, 'RepositoryURI', {
      value: repository.repositoryUri,
      description: 'ECR Repository URI',
    })
  }
}
```

## CI/CD 管道

### 1. GitHub Actions

#### 部署工作流程
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:all
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        build-args: |
          NEXT_PUBLIC_FIREBASE_API_KEY=${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY=${{ secrets.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY }}
          GENKIT_API_KEY=${{ secrets.GENKIT_API_KEY }}
          GENKIT_PROJECT_ID=${{ secrets.GENKIT_PROJECT_ID }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to Staging
      run: |
        echo "Deploying to staging environment"
        # 部署到測試環境的腳本
    
    - name: Run E2E tests
      run: |
        echo "Running E2E tests against staging"
        # 執行 E2E 測試

  deploy-production:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to Production
      run: |
        echo "Deploying to production environment"
        # 部署到生產環境的腳本
    
    - name: Health check
      run: |
        echo "Performing health check"
        # 健康檢查腳本
```

### 2. 部署腳本

#### 部署腳本範例
```bash
#!/bin/bash
# deploy.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
    echo "Usage: ./deploy.sh <environment> <version>"
    echo "Example: ./deploy.sh staging v1.0.0"
    exit 1
fi

echo "Deploying version $VERSION to $ENVIRONMENT environment..."

# 載入環境變數
source .env.$ENVIRONMENT

# 建置 Docker 映像
echo "Building Docker image..."
docker build \
    --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID \
    --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID \
    --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    --build-arg NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY \
    --build-arg GENKIT_API_KEY=$GENKIT_API_KEY \
    --build-arg GENKIT_PROJECT_ID=$GENKIT_PROJECT_ID \
    -t ng-beta-app:$VERSION .

# 標記映像
docker tag ng-beta-app:$VERSION $REGISTRY/ng-beta-app:$VERSION
docker tag ng-beta-app:$VERSION $REGISTRY/ng-beta-app:latest

# 推送映像
echo "Pushing Docker image..."
docker push $REGISTRY/ng-beta-app:$VERSION
docker push $REGISTRY/ng-beta-app:latest

# 部署到目標環境
echo "Deploying to $ENVIRONMENT..."
if [ "$ENVIRONMENT" = "production" ]; then
    # 生產環境部署
    kubectl set image deployment/ng-beta-app ng-beta-app=$REGISTRY/ng-beta-app:$VERSION
    kubectl rollout status deployment/ng-beta-app
elif [ "$ENVIRONMENT" = "staging" ]; then
    # 測試環境部署
    kubectl set image deployment/ng-beta-app-staging ng-beta-app=$REGISTRY/ng-beta-app:$VERSION
    kubectl rollout status deployment/ng-beta-app-staging
fi

echo "Deployment completed successfully!"
```

## 監控與日誌

### 1. 應用監控

#### Sentry 配置
```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // 環境設定
  environment: process.env.NODE_ENV,
  
  // 效能監控
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 錯誤過濾
  beforeSend(event) {
    // 過濾掉開發環境的錯誤
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    
    // 過濾掉特定類型的錯誤
    if (event.exception) {
      const exception = event.exception.values?.[0]
      if (exception?.type === 'NetworkError') {
        return null
      }
    }
    
    return event
  },
  
  // 整合設定
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'your-domain.com'],
    }),
  ],
})

export { Sentry }
```

### 2. 日誌配置

#### 日誌服務
```typescript
// src/lib/logging/logger.ts
import { createLogger, format, transports } from 'winston'

const logFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
)

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'ng-beta-app' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/combined.log',
    }),
  ],
})

// 開發環境額外日誌
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }))
}

export { logger }
```

## 備份與恢復

### 1. 資料備份策略

#### Firebase 備份腳本
```typescript
// scripts/backup-firebase.ts
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import * as fs from 'fs'
import * as path from 'path'

const serviceAccount = require('../service-account-key.json')

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

const db = getFirestore()
const storage = getStorage()

async function backupCollections() {
  const collections = ['projects', 'partners', 'documents', 'users']
  const backupData: any = {}
  
  for (const collectionName of collections) {
    console.log(`Backing up collection: ${collectionName}`)
    
    const snapshot = await db.collection(collectionName).get()
    const documents: any[] = []
    
    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    
    backupData[collectionName] = documents
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(__dirname, `../backups/firebase-${timestamp}.json`)
  
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
  console.log(`Backup saved to: ${backupPath}`)
}

async function backupStorage() {
  const bucket = storage.bucket()
  const [files] = await bucket.getFiles()
  
  const backupData = files.map(file => ({
    name: file.name,
    size: file.metadata.size,
    contentType: file.metadata.contentType,
    timeCreated: file.metadata.timeCreated,
  }))
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(__dirname, `../backups/storage-${timestamp}.json`)
  
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
  console.log(`Storage backup saved to: ${backupPath}`)
}

async function main() {
  try {
    await backupCollections()
    await backupStorage()
    console.log('Backup completed successfully!')
  } catch (error) {
    console.error('Backup failed:', error)
    process.exit(1)
  }
}

main()
```

這個部署策略確保了專案整合的可靠部署、監控和維護。