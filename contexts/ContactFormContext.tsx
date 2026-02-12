'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ContactForm, FormField, MOCK_FORMS, generateEmbedCode } from '@/lib/contactFormData'

interface ContactFormContextType {
  forms: ContactForm[]
  currentForm: ContactForm | null
  setCurrentForm: (form: ContactForm | null) => void
  createForm: (name: string, description: string) => ContactForm
  updateForm: (formId: string, updates: Partial<ContactForm>) => void
  deleteForm: (formId: string) => void
  addField: (formId: string, field: FormField) => void
  updateField: (formId: string, fieldId: string, updates: Partial<FormField>) => void
  deleteField: (formId: string, fieldId: string) => void
  reorderFields: (formId: string, fields: FormField[]) => void
  getFormEmbed: (formId: string) => string
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined)

export function ContactFormProvider({ children }: { children: React.ReactNode }) {
  const [forms, setForms] = useState<ContactForm[]>([])
  const [currentForm, setCurrentForm] = useState<ContactForm | null>(null)

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('careops_contact_forms')
    if (stored) {
      try {
        setForms(JSON.parse(stored))
      } catch {
        setForms(MOCK_FORMS)
      }
    } else {
      setForms(MOCK_FORMS)
    }
  }, [])

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('careops_contact_forms', JSON.stringify(forms))
  }, [forms])

  const createForm = (name: string, description: string): ContactForm => {
    const newForm: ContactForm = {
      id: Date.now().toString(),
      name,
      description,
      fields: [
        {
          id: '1',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          order: 1,
        },
        {
          id: '2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          order: 2,
        },
      ],
      embedCode: generateEmbedCode(Date.now().toString()),
      submissions: 0,
      createdAt: new Date(),
      active: true,
    }
    setForms([...forms, newForm])
    return newForm
  }

  const updateForm = (formId: string, updates: Partial<ContactForm>) => {
    setForms(
      forms.map((form) => (form.id === formId ? { ...form, ...updates } : form))
    )
    if (currentForm?.id === formId) {
      setCurrentForm({ ...currentForm, ...updates })
    }
  }

  const deleteForm = (formId: string) => {
    setForms(forms.filter((form) => form.id !== formId))
    if (currentForm?.id === formId) {
      setCurrentForm(null)
    }
  }

  const addField = (formId: string, field: FormField) => {
    setForms(
      forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              fields: [
                ...form.fields,
                {
                  ...field,
                  id: Date.now().toString(),
                  order: form.fields.length + 1,
                },
              ],
            }
          : form
      )
    )
  }

  const updateField = (formId: string, fieldId: string, updates: Partial<FormField>) => {
    setForms(
      forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              fields: form.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          : form
      )
    )
  }

  const deleteField = (formId: string, fieldId: string) => {
    setForms(
      forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              fields: form.fields.filter((field) => field.id !== fieldId),
            }
          : form
      )
    )
  }

  const reorderFields = (formId: string, reorderedFields: FormField[]) => {
    setForms(
      forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              fields: reorderedFields.map((field, index) => ({
                ...field,
                order: index + 1,
              })),
            }
          : form
      )
    )
  }

  const getFormEmbed = (formId: string): string => {
    const form = forms.find((f) => f.id === formId)
    return form?.embedCode || ''
  }

  return (
    <ContactFormContext.Provider
      value={{
        forms,
        currentForm,
        setCurrentForm,
        createForm,
        updateForm,
        deleteForm,
        addField,
        updateField,
        deleteField,
        reorderFields,
        getFormEmbed,
      }}
    >
      {children}
    </ContactFormContext.Provider>
  )
}

export function useContactForm() {
  const context = useContext(ContactFormContext)
  if (!context) {
    throw new Error('useContactForm must be used within ContactFormProvider')
  }
  return context
}
