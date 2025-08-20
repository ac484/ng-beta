import { User } from 'firebase/auth'

export interface FirebaseUser extends User {
  // 可以擴展用戶類型
}

export interface AuthState {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  displayName?: string
}