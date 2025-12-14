// Authentication utility functions
export interface User {
  username: string
  name: string
  email: string
}

// Demo credentials - in production, this would be validated against a database
const DEMO_USERS = {
  admin: { password: "admin123", name: "Admin User", email: "admin@example.com" },
  demo: { password: "demo123", name: "Demo User", email: "demo@example.com" },
}

export function validateCredentials(username: string, password: string): User | null {
  const user = DEMO_USERS[username as keyof typeof DEMO_USERS]
  if (user && user.password === password) {
    return {
      username,
      name: user.name,
      email: user.email,
    }
  }
  return null
}

export function setAuthToken(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_user", JSON.stringify(user))
  }
}

export function getAuthUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("auth_user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_user")
  }
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null
}
