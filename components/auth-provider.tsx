"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "supervisor" | "user"
  phone?: string
  tpsId?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Dummy users for authentication
const dummyUsers: User[] = [
  {
    id: "1",
    name: "Admin Utama",
    email: "admin@pilkada.id",
    role: "admin",
  },
  {
    id: "2",
    name: "Supervisor TPS 001",
    email: "supervisor1@pilkada.id",
    role: "supervisor",
    phone: "+6281234567890",
    tpsId: 1,
  },
  {
    id: "3",
    name: "User Pemantau",
    email: "user@pilkada.id",
    role: "user",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem("pilkada_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = dummyUsers.find((u) => u.email === email)
    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("pilkada_user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pilkada_user")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={login} />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<boolean> }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await onLogin(email, password)
    if (!success) {
      setError("Email atau password salah")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Login Dashboard Pilkada</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pilkada.id"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="text-xs space-y-1">
              <p>
                <strong>Admin:</strong> admin@pilkada.id
              </p>
              <p>
                <strong>Supervisor:</strong> supervisor1@pilkada.id
              </p>
              <p>
                <strong>User:</strong> user@pilkada.id
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
