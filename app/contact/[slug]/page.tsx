'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle, Loader, Mail, Phone, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Workspace {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

type PageState = 'loading' | 'form' | 'success' | 'error'

export default function ContactPage() {
  const params = useParams()
  const slug = params.slug as string

  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [pageState, setPageState] = useState<PageState>('loading')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{ contactId: string; conversationId: string } | null>(null)

  // Fetch workspace by slug
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await fetch(`/api/contact/workspace?slug=${encodeURIComponent(slug as string)}`)
        const result = await res.json()

        if (!res.ok || !result.workspace) {
          console.error('[v0] Error fetching workspace:', result.error)
          setPageState('error')
          return
        }

        setWorkspace(result.workspace)
        setPageState('form')
      } catch (err) {
        console.error('[v0] Workspace fetch error:', err)
        setPageState('error')
      }
    }

    if (slug) {
      fetchWorkspace()
    }
  }, [slug])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !workspace) {
      return
    }

    setIsSubmitting(true)

    try {
      // Use the server-side API route (admin client bypasses RLS)
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspace.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      setSuccessData({
        contactId: result.contactId,
        conversationId: result.conversationId,
      })
      setPageState('success')
    } catch (err) {
      console.error('[v0] Form submission error:', err)
      setErrors({ message: 'Failed to submit form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="p-8 border border-border">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading contact form...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="p-8 border border-destructive/30 bg-destructive/5 max-w-md">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Workspace Not Found</h1>
            <p className="text-muted-foreground">Sorry, we couldn't find the contact form you're looking for.</p>
            <Link href="/">
              <Button className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (pageState === 'success' && successData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="p-8 border border-border max-w-md">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Message Received!</h1>
              <p className="text-muted-foreground">
                Thank you for contacting us. We've received your message and will respond within 24 hours.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Confirmation ID:</span> {successData.contactId.slice(0, 8)}
              </p>
            </div>
            <div className="flex gap-2 flex-col">
              <Link href="/book">
                <Button className="w-full">Book a Service</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Workspace Info Sidebar */}
          {workspace && (
            <div className="md:col-span-1">
              <Card className="p-6 border border-border sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-4">{workspace.name}</h2>
                <div className="space-y-4">
                  {workspace.email && (
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Email</p>
                        <a
                          href={`mailto:${workspace.email}`}
                          className="text-sm text-foreground hover:text-primary transition-colors break-all"
                        >
                          {workspace.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {workspace.phone && (
                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Phone</p>
                        <a href={`tel:${workspace.phone}`} className="text-sm text-foreground hover:text-primary transition-colors">
                          {workspace.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {workspace.address && (
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Address</p>
                        <p className="text-sm text-foreground">{workspace.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="p-6 sm:p-8 border border-border">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Get in Touch</h1>
              <p className="text-muted-foreground mb-6">Send us a message and we'll respond as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`mt-2 ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`mt-2 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-2 resize-none ${errors.message ? 'border-destructive' : 'border-input'
                      }`}
                  />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6">
                We respect your privacy. Your information will never be shared.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
