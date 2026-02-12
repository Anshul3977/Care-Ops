export interface FormSubmission {
  id: string
  formName: string
  formId: string
  customerName: string
  customerEmail: string
  submittedAt: string
  status: 'pending' | 'reviewed' | 'completed' | 'needs-revision'
  completionPercentage: number
  fields: Record<string, string>
  notes?: string
  assignedTo?: string
  dueDate?: string
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  fields: FormField[]
  createdAt: string
  isActive: boolean
}

export interface FormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'checkbox' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Post-Service Survey',
    description: 'Collect feedback after service completion',
    createdAt: '2026-01-15',
    isActive: true,
    fields: [
      {
        id: 'f1',
        name: 'satisfaction',
        label: 'Overall Satisfaction',
        type: 'select',
        required: true,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
      },
      {
        id: 'f2',
        name: 'comments',
        label: 'Additional Comments',
        type: 'textarea',
        required: false,
        placeholder: 'Share your feedback...',
      },
    ],
  },
  {
    id: 'tmpl-2',
    name: 'Pre-Service Information',
    description: 'Gather details before service begins',
    createdAt: '2026-01-10',
    isActive: true,
    fields: [
      {
        id: 'f3',
        name: 'propertyType',
        label: 'Property Type',
        type: 'select',
        required: true,
        options: ['Residential', 'Commercial', 'Industrial'],
      },
      {
        id: 'f4',
        name: 'squareFootage',
        label: 'Square Footage',
        type: 'text',
        required: false,
        placeholder: 'e.g., 5000 sq ft',
      },
    ],
  },
  {
    id: 'tmpl-3',
    name: 'Safety Compliance Checklist',
    description: 'Ensure safety standards are met',
    createdAt: '2026-01-20',
    isActive: true,
    fields: [
      {
        id: 'f5',
        name: 'hazardsIdentified',
        label: 'Any hazards identified?',
        type: 'checkbox',
        required: true,
      },
      {
        id: 'f6',
        name: 'hazardDetails',
        label: 'Hazard Details',
        type: 'textarea',
        required: false,
        placeholder: 'Describe any hazards found...',
      },
    ],
  },
]

export const MOCK_FORM_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'sub-001',
    formName: 'Post-Service Survey',
    formId: 'tmpl-1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    submittedAt: '2026-02-10',
    status: 'reviewed',
    completionPercentage: 100,
    fields: {
      satisfaction: 'Very Satisfied',
      comments: 'Great service, very professional team!',
    },
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'sub-002',
    formName: 'Pre-Service Information',
    formId: 'tmpl-2',
    customerName: 'Emily Davis',
    customerEmail: 'emily.d@email.com',
    submittedAt: '2026-02-09',
    status: 'pending',
    completionPercentage: 100,
    fields: {
      propertyType: 'Commercial',
      squareFootage: '15000 sq ft',
    },
    dueDate: '2026-02-12',
  },
  {
    id: 'sub-003',
    formName: 'Safety Compliance Checklist',
    formId: 'tmpl-3',
    customerName: 'Robert Wilson',
    customerEmail: 'r.wilson@company.com',
    submittedAt: '2026-02-08',
    status: 'needs-revision',
    completionPercentage: 75,
    fields: {
      hazardsIdentified: 'Yes',
      hazardDetails: 'Slippery floor near entrance',
    },
    notes: 'Needs clarification on safety measures taken',
    dueDate: '2026-02-13',
  },
  {
    id: 'sub-004',
    formName: 'Post-Service Survey',
    formId: 'tmpl-1',
    customerName: 'Michelle Brown',
    customerEmail: 'michelle.b@email.com',
    submittedAt: '2026-02-07',
    status: 'completed',
    completionPercentage: 100,
    fields: {
      satisfaction: 'Satisfied',
      comments: 'Good work overall',
    },
    assignedTo: 'Mike Thompson',
    notes: 'Processed and archived',
  },
  {
    id: 'sub-005',
    formName: 'Pre-Service Information',
    formId: 'tmpl-2',
    customerName: 'David Martinez',
    customerEmail: 'david.m@email.com',
    submittedAt: '2026-02-11',
    status: 'pending',
    completionPercentage: 100,
    fields: {
      propertyType: 'Residential',
      squareFootage: '3500 sq ft',
    },
    dueDate: '2026-02-15',
  },
  {
    id: 'sub-006',
    formName: 'Safety Compliance Checklist',
    formId: 'tmpl-3',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@email.com',
    submittedAt: '2026-02-06',
    status: 'completed',
    completionPercentage: 100,
    fields: {
      hazardsIdentified: 'No',
      hazardDetails: '',
    },
    assignedTo: 'Sarah Johnson',
    notes: 'All safety checks passed',
  },
  {
    id: 'sub-007',
    formName: 'Post-Service Survey',
    formId: 'tmpl-1',
    customerName: 'James Taylor',
    customerEmail: 'james.t@email.com',
    submittedAt: '2026-02-12',
    status: 'pending',
    completionPercentage: 100,
    fields: {
      satisfaction: 'Neutral',
      comments: 'Service was ok, but could be better',
    },
    dueDate: '2026-02-14',
  },
]
