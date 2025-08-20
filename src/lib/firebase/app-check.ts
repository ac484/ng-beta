import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check'
import type { AppCheck } from 'firebase/app-check'
import app from './config'

let appCheckInstance: AppCheck | null = null

// 初始化 App Check 與 reCAPTCHA v3
export const initializeAppCheckWithRecaptcha = (): AppCheck | null => {
  if (typeof window !== 'undefined' && !appCheckInstance) {
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
    if (!appCheckInstance) {
      appCheckInstance = initializeAppCheckWithRecaptcha()
    }
    
    if (!appCheckInstance) {
      console.error('App Check not initialized')
      return null
    }

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

// 驗證 App Check token (用於 Server Actions)
// 注意：這個函數應該只在服務端使用
export const verifyAppCheckToken = async (token: string): Promise<boolean> => {
  // 這個函數應該在 Server Actions 中使用，不應該在客戶端調用
  if (typeof window !== 'undefined') {
    console.warn('verifyAppCheckToken should not be called on the client side')
    return false
  }
  
  try {
    // 在服務端環境中驗證 token
    // 這個邏輯應該移到 Server Actions 中
    return true // 暫時返回 true，實際驗證邏輯應該在 Server Actions 中實現
  } catch (error) {
    console.error('Error verifying App Check token:', error)
    return false
  }
}