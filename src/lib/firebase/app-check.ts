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

    const token = await getToken(appCheckInstance, forceRefresh)
    return token
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
export const verifyAppCheckToken = async (token: string): Promise<boolean> => {
  try {
    // 使用 Firebase Admin SDK 驗證 token
    const { adminAuth } = await import('./server')
    
    // 這裡需要實現 token 驗證邏輯
    // 通常涉及調用 Firebase Admin SDK
    const isValid = await verifyTokenWithAdminSDK(token)
    
    return isValid
  } catch (error) {
    console.error('Error verifying App Check token:', error)
    return false
  }
}

async function verifyTokenWithAdminSDK(token: string): Promise<boolean> {
  // 實現您的 token 驗證邏輯
  // 這通常涉及調用 Firebase Admin SDK
  return true // 示例返回值
}