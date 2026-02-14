'use client'

import React, { useState } from 'react'
import { useContactForm } from '@/contexts/ContactFormContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormFieldBuilder } from '@/components/forms/FormFieldBuilder'
import { FormPreview } from '@/components/forms/FormPreview'
import { Plus, Copy, Share2, Eye, EyeOff } from 'lucide-react'

export default function ContactFormsPage() {
  const {
    forms,
    currentForm,
    setCurrentForm,
    createForm,
    updateForm,
    addField,
    updateField,
    deleteField,
  } = useContactForm()

  const [showBuilder, setShowBuilder] = useState(false)
  const [newFormName, setNewFormName] = useState('')
  const [newFormDescription, setNewFormDescription] = useState('')
  const [showEmbed, setShowEmbed] = useState(false)

  const handleCreateForm = () => {
    if (newFormName.trim()) {
      const form = createForm(newFormName, newFormDescription)
      setCurrentForm(form)
      setNewFormName('')
      setNewFormDescription('')
      setShowBuilder(true)
    }
  }

  const handleAddField = () => {
    if (currentForm) {
      const newField = {
        id: Date.now().toString(),
        type: 'text' as const,
        label: 'New Field',
        required: false,
        order: currentForm.fields.length + 1,
      }
      addField(currentForm.id, newField)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Forms</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage custom contact forms for your business
        </p>
      </div>

      {!showBuilder ? (
        <div>
          {forms.length === 0 ? (
            <Card className="p-8 text-center border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first contact form to start collecting inquiries
              </p>
              <Button
                onClick={() => setShowBuilder(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Form
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => setShowBuilder(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Form
              </Button>

              <div className="grid gap-4">
                {forms.map((form) => (
                  <Card
                    key={form.id}
                    className="p-4 border border-border hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setCurrentForm(form)
                      setShowBuilder(true)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{form.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {form.description}
                        </p>
                        <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                          <span>{form.fields.length} fields</span>
                          <span>{form.submissions} submissions</span>
                          {form.lastSubmission && (
                            <span>
                              Last: {new Date(form.lastSubmission).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowEmbed(!showEmbed)
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {showEmbed && (
                      <div className="mt-4 p-3 bg-secondary/10 rounded border border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Embed Code
                        </p>
                        <div className="font-mono text-xs bg-background p-2 rounded border border-border overflow-x-auto">
                          {form.embedCode}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(form.embedCode)
                          }}
                          className="mt-2 gap-2"
                        >
                          <Copy className="w-3 h-3" />
                          Copy Code
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {!currentForm ? (
            <Card className="p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Create New Form</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Form Name
                  </label>
                  <Input
                    value={newFormName}
                    onChange={(e) => setNewFormName(e.target.value)}
                    placeholder="e.g., Customer Inquiry Form"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <Input
                    value={newFormDescription}
                    onChange={(e) => setNewFormDescription(e.target.value)}
                    placeholder="Optional description"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateForm}>Create Form</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBuilder(false)
                      setNewFormName('')
                      setNewFormDescription('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{currentForm.name}</h2>
                      <p className="text-sm text-muted-foreground">{currentForm.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentForm(null)
                        setShowBuilder(false)
                      }}
                    >
                      Back to Forms
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Form Fields</h3>
                    <div className="space-y-3">
                      {currentForm.fields.map((field) => (
                        <FormFieldBuilder
                          key={field.id}
                          field={field}
                          onUpdate={(updates) => updateField(currentForm.id, field.id, updates)}
                          onDelete={() => deleteField(currentForm.id, field.id)}
                          onDuplicate={() => {
                            const duplicatedField = {
                              ...field,
                              id: Date.now().toString(),
                              label: `${field.label} (Copy)`,
                            }
                            addField(currentForm.id, duplicatedField)
                          }}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleAddField}
                      className="w-full gap-2 mt-4"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </Button>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Preview</h3>
                <FormPreview
                  title={currentForm.name}
                  description={currentForm.description}
                  fields={currentForm.fields}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
