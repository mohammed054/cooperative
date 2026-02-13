import { useCallback, useContext, useMemo, useState } from 'react'
import { AnalyticsContext } from '../context/AnalyticsContextCore'
import {
  isLeadCaptureConfigured,
  normalizeLeadFields,
  submitLead,
} from '../utils/leadCapture'

const DEFAULT_SUCCESS_MESSAGE =
  'Thanks. We received your request and will get back to you within 24 hours.'

export const useLeadSubmission = ({
  formName,
  successMessage = DEFAULT_SUCCESS_MESSAGE,
}) => {
  const analytics = useContext(AnalyticsContext)
  const [status, setStatus] = useState('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const resetFeedback = useCallback(() => {
    setStatus('idle')
    setFeedbackMessage('')
  }, [])

  const submit = useCallback(
    async formElement => {
      if (!formElement) return

      const formData = new FormData(formElement)
      const honeypotValue = String(formData.get('website') || '').trim()

      // Ignore obvious bot submissions triggered by hidden honeypot fields.
      if (honeypotValue) {
        setStatus('success')
        setFeedbackMessage(successMessage)
        formElement.reset()
        return
      }

      const fields = normalizeLeadFields(Object.fromEntries(formData.entries()))
      delete fields.website

      if (!fields.name || !fields.email) {
        setStatus('error')
        setFeedbackMessage('Please provide your name and email.')
        analytics?.trackFormSubmission?.(formName, false)
        return
      }

      if (!isLeadCaptureConfigured()) {
        setStatus('error')
        setFeedbackMessage(
          'Lead webhook is not configured yet. Please set VITE_LEAD_WEBHOOK_URL.'
        )
        analytics?.trackFormSubmission?.(formName, false)
        return
      }

      setStatus('submitting')
      setFeedbackMessage('')

      try {
        await submitLead(fields, {
          formName,
          pagePath: window.location.pathname,
          pageTitle: document.title,
        })

        setStatus('success')
        setFeedbackMessage(successMessage)
        formElement.reset()
        analytics?.trackFormSubmission?.(formName, true)
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unable to submit right now. Please try again.'

        setStatus('error')
        setFeedbackMessage(errorMessage)
        analytics?.trackFormSubmission?.(formName, false)
        analytics?.trackError?.('LeadSubmission', errorMessage, formName)
      }
    },
    [analytics, formName, successMessage]
  )

  return useMemo(
    () => ({
      status,
      isSubmitting: status === 'submitting',
      isSuccess: status === 'success',
      isError: status === 'error',
      feedbackMessage,
      resetFeedback,
      submit,
    }),
    [feedbackMessage, resetFeedback, status, submit]
  )
}
