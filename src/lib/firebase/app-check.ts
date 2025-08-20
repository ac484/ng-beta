import { initializeAppCheck, ReCaptchaV3Provider, getToken, AppCheck } from 'firebase/app-check'
import app from './config'

let appCheckInstance: AppCheck | null = null

// 初始化 App Check 與 reCAPTCHA v3
export const initializeAppCheckWithRecaptcha = (): AppCheck | null => {
  if (typeof window !== 'undefined' && !appCheckInstance) {
    // 只在客戶端執行，且確保只初始化一次
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY!
        ),
        isTokenAutoRefreshEnabled: true
      })
      return appCheckInstance
    } catch (error) {
      console.error('Error initializing App Check:', error)
      return null
    }
  }
  return appCheckInstance
}

// 獲取 App Check token
export const getAppCheckToken = async (forceRefresh: boolean = false): Promise<string | null> => {
  try {
    // 確保 App Check 已初始化
    if (!appCheckInstance) {
      appCheckInstance = initializeAppCheckWithRecaptcha()
    }
    
    if (!appCheckInstance) {
      console.error('App Check not initialized')
      return null
    }

    // 使用正確的參數調用 getToken
    const tokenResult = await getToken(appCheckInstance, forceRefresh)
    return tokenResult.token
  } catch (error) {
    console.error('Error getting App Check token:', error)
    return null
  }
}

// 獲取 App Check 實例
export const getAppCheckInstance = (): AppCheck | null => {
  if (!appCheckInstance) {
    appCheckInstance = initializeAppCheckWithRecaptcha()
  }
  return appCheckInstance
}

// 驗證 App Check token (用於 API 路由)
export const verifyAppCheckToken = async (token: string): Promise<boolean> => {
  try {
    // 這裡應該調用您的後端 API 來驗證 token
    const response = await fetch('/api/verify-app-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Firebase-AppCheck': token
      }
    })
    
    if (response.ok) {
      return true
    }
    return false
  } catch (error) {
    console.error('Error verifying App Check token:', error)
    return false
  }
}