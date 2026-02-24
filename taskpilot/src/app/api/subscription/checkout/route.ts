/**
 * Stripe Checkout API
 * POST /api/subscription/checkout - Create Stripe checkout session
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { 
  stripe, 
  createStripeCustomer, 
  createCheckoutSession, 
  STRIPE_PRICE_IDS 
} from '@/lib/stripe/client'
import type { ApiError, CreateCheckoutRequest, CreateCheckoutResponse } from '@/types/api'

const checkoutSchema = z.object({
  plan: z.enum(['pro', 'business']),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

/**
 * POST /api/subscription/checkout - Create checkout session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ApiError>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse body
    const body = await request.json()
    const { plan, successUrl, cancelUrl } = checkoutSchema.parse(body)

    // Get subscription to check for existing Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createStripeCustomer(user.email!, user.id)
      customerId = customer.id

      // Update subscription with customer ID
      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)
    }

    // Get price ID for plan
    const priceId = STRIPE_PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json<ApiError>(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Get app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create checkout session
    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: successUrl || `${appUrl}/dashboard/settings/billing?success=true`,
      cancelUrl: cancelUrl || `${appUrl}/dashboard/settings/billing?canceled=true`,
      userId: user.id,
    })

    const response: CreateCheckoutResponse = {
      checkoutUrl: session.url!,
      sessionId: session.id,
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiError>(
        { error: 'Invalid request body', details: error.issues as unknown as Record<string, unknown> },
        { status: 400 }
      )
    }
    
    console.error('Checkout POST error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
