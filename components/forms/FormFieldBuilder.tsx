'use client'

import React from 'react'
import { FormField } from '@/lib/contactFormData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Copy, GripVertical } from 'lucide-react'

interface FormFieldBuilderProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onDelete: () => void
  onDuplicate: () => void
}

export function FormFieldBuilder({
  field,
  onUpdate,
  onDelete,
  onDuplicate,
}: FormFieldBuilderProps) {
  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
  ]

  return (
    <Card className="p-4 border border-border bg-card">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-2 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Field Label
              </label>
              <Input
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="e.g., Full Name"
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Field Type
              </label>
              <select
                value={field.type}
                onChange={(e) =>
                  onUpdate({ type: e.target.value as FormField['type'] })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {fieldTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Placeholder Text
              </label>
              <Input
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Optional placeholder text"
                className="text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="w-4 h-4 rounded border border-border"
                />
                <span className="text-sm text-foreground">Required field</span>
              </label>
            </div>
          </div>

          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              title="Duplicate field"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} title="Delete field">
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
