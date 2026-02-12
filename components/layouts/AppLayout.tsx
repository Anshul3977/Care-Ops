'use client'

import { Sidebar } from '@/components/navigation/Sidebar'
import { Header } from '@/components/navigation/Header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface AppLayoutProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function AppLayout({ children, requiredRoles }: AppLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
