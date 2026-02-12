'use client'

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, Trash2, GripVertical } from 'lucide-react'

export function Step5PostBookingForms() {
  const { state, updatePostBookingForms } = useOnboarding()
  const [forms, setForms] = useState(state.postBookingForms?.forms || [])
  const [newFormName, setNewFormName] = useState('')
  const [newFormUrl, setNewFormUrl] = useState('')

  const mockServices = state.booking?.services || [
    { id: '1', name: 'Service 1' },
    { id: '2', name: 'Service 2' },
  ]

  const isComplete = forms.length >= 0 // At least one form could be added

  const handleAddForm = () => {
    if (newFormName.trim() && newFormUrl.trim()) {
      setForms([
        ...forms,
        {
          id: Math.random().toString(),
          name: newFormName,
          url: newFormUrl,
          linkedServices: [],
        },
      ])
      setNewFormName('')
      setNewFormUrl('')
    }
  }

  const handleRemoveForm = (id: string) => {
    setForms(forms.filter((f) => f.id !== id))
  }

  const handleToggleService = (formId: string, serviceId: string) => {
    setForms(
      forms.map((form) => {
        if (form.id === formId) {
          const linked = form.linkedServices || []
          return {
            ...form,
            linkedServices: linked.includes(serviceId)
              ? linked.filter((s) => s !== serviceId)
              : [...linked, serviceId],
          }
        }
        return form
      }),
    )
  }

  const handleSave = () => {
    updatePostBookingForms({
      forms,
    })
  }

  React.useEffect(() => {
    const timer = setTimeout(handleSave, 500)
    return () => clearTimeout(timer)
  }, [forms])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Post-Booking Forms
        </h2>
        <p className="text-muted-foreground">
          Upload forms to send after service completion
        </p>
      </div>

      <div className="space-y-6">
        {/* Add Form Section */}
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload New Form
          </h3>

          <div className="space-y-4 p-4 rounded-lg border border-dashed border-border">
            <div>
              <Label htmlFor="formName" className="text-sm">
                Form Name
              </Label>
              <Input
                id="formName"
                placeholder="e.g., Post-Service Feedback"
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="formUrl" className="text-sm">
                Form URL / Link
              </Label>
              <Input
                id="formUrl"
                placeholder="https://docs.google.com/forms/..."
                value={newFormUrl}
                onChange={(e) => setNewFormUrl(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleAddForm}
              className="w-full"
              disabled={!newFormName.trim() || !newFormUrl.trim()}
            >
              Add Form
            </Button>
          </div>
        </Card>

        {/* Forms List */}
        {forms.length > 0 && (
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Your Forms</h3>
            <div className="space-y-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="p-4 rounded-lg border border-border bg-secondary/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        {form.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {form.url}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveForm(form.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">
                      Link to Services
                    </p>
                    <div className="space-y-2">
                      {mockServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={`${form.id}-${service.id}`}
                            checked={(form.linkedServices || []).includes(
                              service.id,
                            )}
                            onCheckedChange={() =>
                              handleToggleService(form.id, service.id)
                            }
                          />
                          <Label
                            htmlFor={`${form.id}-${service.id}`}
                            className="cursor-pointer text-sm"
                          >
                            {service.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-foreground">
            {forms.length > 0
              ? `${forms.length} form${forms.length !== 1 ? 's' : ''} added. You can add more forms or proceed to the next step.`
              : 'Post-booking forms are optional. You can add them now or skip to the next step.'}
          </p>
        </div>
      </div>
    </div>
  )
}
