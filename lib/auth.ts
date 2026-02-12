import { MOCK_USERS } from './constants'
import type { User, UserRole } from '@/types'

const STORAGE_KEY = 'careops_user'
const TOKEN_KEY = 'careops_token'

export function saveUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }
}

export function getSavedUser(): User | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  }
  return null
}

export function removeUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function validateLogin(
  email: string,
  password: string
): Promise<User | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check against mock users
  const mockUser = Object.values(MOCK_USERS).find(
    (user) => user.email === email && user.password === password
  )

  if (mockUser) {
    const { password: _, ...userWithoutPassword } = mockUser
    return userWithoutPassword as User
  }

  return null
}

export async function validateSignup(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'STAFF'
): Promise<User> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if email already exists
  const emailExists = Object.values(MOCK_USERS).some(
    (user) => user.email === email
  )

  if (emailExists) {
    throw new Error('Email already registered')
  }

  // Create new user
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    role,
    createdAt: new Date(),
  }

  return newUser
}

export function generateAuthToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}
