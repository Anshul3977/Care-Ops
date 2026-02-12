'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  FormSubmission,
  FormTemplate,
  MOCK_FORM_SUBMISSIONS,
  FORM_TEMPLATES,
} from '@/lib/formsData'

interface FormsContextType {
  submissions: FormSubmission[]
  templates: FormTemplate[]
  isLoading: boolean
  addSubmission: (submission: Omit<FormSubmission, 'id'>) => void
  updateSubmission: (id: string, updates: Partial<FormSubmission>) => void
  deleteSubmission: (id: string) => void
  getSubmissionById: (id: string) => FormSubmission | undefined
  getPendingSubmissions: () => FormSubmission[]
  getCompletedSubmissions: () => FormSubmission[]
  getSubmissionsByForm: (formId: string) => FormSubmission[]
  getCompletionStats: () => {
    total: number
    pending: number
    reviewed: number
    completed: number
    needsRevision: number
  }
  searchSubmissions: (query: string) => FormSubmission[]
}

const FormsContext = createContext<FormsContextType | undefined>(undefined)

export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [templates] = useState<FormTemplate[]>(FORM_TEMPLATES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedSubmissions = localStorage.getItem('form_submissions')
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions))
    } else {
      setSubmissions(MOCK_FORM_SUBMISSIONS)
      localStorage.setItem('form_submissions', JSON.stringify(MOCK_FORM_SUBMISSIONS))
    }
    setIsLoading(false)
  }, [])

  const saveSubmissions = useCallback((updatedSubmissions: FormSubmission[]) => {
    localStorage.setItem('form_submissions', JSON.stringify(updatedSubmissions))
  }, [])

  const addSubmission = useCallback(
    (submission: Omit<FormSubmission, 'id'>) => {
      const newSubmission: FormSubmission = {
        ...submission,
        id: `sub-${Date.now()}`,
      }
      const updatedSubmissions = [...submissions, newSubmission]
      setSubmissions(updatedSubmissions)
      saveSubmissions(updatedSubmissions)
    },
    [submissions, saveSubmissions]
  )

  const updateSubmission = useCallback(
    (id: string, updates: Partial<FormSubmission>) => {
      const updatedSubmissions = submissions.map((sub) =>
        sub.id === id ? { ...sub, ...updates } : sub
      )
      setSubmissions(updatedSubmissions)
      saveSubmissions(updatedSubmissions)
    },
    [submissions, saveSubmissions]
  )

  const deleteSubmission = useCallback(
    (id: string) => {
      const updatedSubmissions = submissions.filter((sub) => sub.id !== id)
      setSubmissions(updatedSubmissions)
      saveSubmissions(updatedSubmissions)
    },
    [submissions, saveSubmissions]
  )

  const getSubmissionById = useCallback(
    (id: string) => submissions.find((sub) => sub.id === id),
    [submissions]
  )

  const getPendingSubmissions = useCallback(
    () => submissions.filter((sub) => sub.status === 'pending'),
    [submissions]
  )

  const getCompletedSubmissions = useCallback(
    () => submissions.filter((sub) => sub.status === 'completed'),
    [submissions]
  )

  const getSubmissionsByForm = useCallback(
    (formId: string) => submissions.filter((sub) => sub.formId === formId),
    [submissions]
  )

  const getCompletionStats = useCallback(
    () => ({
      total: submissions.length,
      pending: submissions.filter((s) => s.status === 'pending').length,
      reviewed: submissions.filter((s) => s.status === 'reviewed').length,
      completed: submissions.filter((s) => s.status === 'completed').length,
      needsRevision: submissions.filter((s) => s.status === 'needs-revision').length,
    }),
    [submissions]
  )

  const searchSubmissions = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase()
      return submissions.filter(
        (sub) =>
          sub.customerName.toLowerCase().includes(lowerQuery) ||
          sub.customerEmail.toLowerCase().includes(lowerQuery) ||
          sub.formName.toLowerCase().includes(lowerQuery)
      )
    },
    [submissions]
  )

  return (
    <FormsContext.Provider
      value={{
        submissions,
        templates,
        isLoading,
        addSubmission,
        updateSubmission,
        deleteSubmission,
        getSubmissionById,
        getPendingSubmissions,
        getCompletedSubmissions,
        getSubmissionsByForm,
        getCompletionStats,
        searchSubmissions,
      }}
    >
      {children}
    </FormsContext.Provider>
  )
}

export function useForms() {
  const context = useContext(FormsContext)
  if (!context) {
    throw new Error('useForms must be used within FormsProvider')
  }
  return context
}
