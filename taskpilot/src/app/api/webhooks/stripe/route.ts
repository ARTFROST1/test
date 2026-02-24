/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe - Handle Stripe webhook events
 */

import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent, handleWebhookEvent } from '@/lib/stripe/webhooks'
import type { ApiError } from '@/types/api'

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs'

/**
 * POST /api/webhooks/stripe - Handle Stripe webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body
    const body = await request.text()
    
    // Get Stripe signature header
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json<ApiError>(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify and construct event
    let event
    try {
      event = await constructWebhookEvent(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json<ApiError>(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    try {
      await handleWebhookEvent(event)
    } catch (err) {
      console.error('Webhook handler error:', err)
      // Still return 200 to prevent Stripe retries for handler errors
      // Log for monitoring
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook POST error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
