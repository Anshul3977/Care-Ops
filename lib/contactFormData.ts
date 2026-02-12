export interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'date'
  label: string
  placeholder?: string
  required: boolean
  order: number
  options?: string[]
}

export interface ContactForm {
  id: string
  name: string
  description: string
  fields: FormField[]
  embedCode: string
  submissions: number
  lastSubmission?: Date
  createdAt: Date
  active: boolean
}

export const DEFAULT_FIELDS: FormField[] = [
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
  {
    id: '3',
    type: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    required: false,
    order: 3,
  },
  {
    id: '4',
    type: 'textarea',
    label: 'Message',
    placeholder: 'Tell us more about your inquiry...',
    required: true,
    order: 4,
  },
]

export const MOCK_FORMS: ContactForm[] = [
  {
    id: '1',
    name: 'Main Contact Form',
    description: 'Primary contact form for customer inquiries',
    fields: DEFAULT_FIELDS,
    embedCode: '<iframe src="https://careops.local/forms/1" width="100%" height="500"></iframe>',
    submissions: 247,
    lastSubmission: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-15'),
    active: true,
  },
]

export function generateEmbedCode(formId: string): string {
  return `<iframe src="${process.env.NEXT_PUBLIC_APP_URL || 'https://careops.local'}/forms/embed/${formId}" width="100%" height="600" frameborder="0" style="border: 1px solid #ccc; border-radius: 4px;"></iframe>`
}
