import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { InventoryProvider } from '@/contexts/InventoryContext'
import { FormsProvider } from '@/contexts/FormsContext'
import { InboxProvider } from '@/contexts/InboxContext'
import { BookingsProvider } from '@/contexts/BookingsContext'
import { StaffProvider } from '@/contexts/StaffContext'
import { ContactFormProvider } from '@/contexts/ContactFormContext'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareOps - Service Operations Platform',
  description: 'Unified operations platform for service businesses',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthProvider>
          <StaffProvider>
            <ContactFormProvider>
              <InventoryProvider>
                <FormsProvider>
                  <InboxProvider>
                    <BookingsProvider>{children}</BookingsProvider>
                  </InboxProvider>
                </FormsProvider>
              </InventoryProvider>
            </ContactFormProvider>
          </StaffProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
