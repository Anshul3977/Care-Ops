export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {children}
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2026 CareOps. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
