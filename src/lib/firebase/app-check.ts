import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import app from './config'

// 初始化 App Check 與 reCAPTCHA v3
export const initializeAppCheckWithRecaptcha = () => {
  if (typeof window !== 'undefined') {
    // 只在客戶端執行
    return initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true
    })
  }
  return null
}

// 獲取 App Check token
export const getAppCheckToken = async () => {
  try {
    const { getToken } = await import('firebase/app-check')
    const token = await getToken()
    return token
  } catch (error) {
    console.error('Error getting App Check token:', error)
    return null
  }
}

// 驗證 App Check token (用於 API 路由)
export const verifyAppCheckToken = async (token: string) => {
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