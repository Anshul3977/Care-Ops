'use client'

import React, { useState } from 'react'
import { FormField } from '@/lib/contactFormData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FormPreviewProps {
  title: string
  description?: string
  fields: FormField[]
}

export function FormPreview({ title, description, fields }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const sortedFields = [...fields].sort((a, b) => a.order - b.order)

  return (
    <Card className="p-6 border border-border bg-card">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {sortedFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-foreground mb-1">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>

              {field.type === 'text' || field.type === 'email' || field.type === 'phone' ? (
                <input
                  type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              ) : field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[field.id] === 'true'}
                    onChange={(e) => handleChange(field.id, e.target.checked ? 'true' : '')}
                    className="w-4 h-4 rounded border border-border"
                  />
                  <span className="text-sm text-foreground">{field.label}</span>
                </label>
              ) : null}
            </div>
          ))}

          <Button type="submit" className="w-full mt-6">
            Submit
          </Button>
        </form>
      </div>
    </Card>
  )
}
