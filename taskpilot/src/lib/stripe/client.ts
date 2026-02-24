/**
 * Stripe Server SDK Configuration
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

// Price IDs for plans (configure in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  business: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_monthly',
} as const

// Product metadata
export const PLAN_METADATA = {
  pro: {
    taskLimit: 50,
    storageLimitBytes: 1073741824, // 1GB
  },
  business: {
    taskLimit: 200,
    storageLimitBytes: 10737418240, // 10GB
  },
} as const

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(email: string, userId: string) {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: userId,
    },
  })
  
  return customer
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(options: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  userId: string
}) {
  const session = await stripe.checkout.sessions.create({
    customer: options.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: options.priceId,
        quantity: 1,
      },
    ],
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    subscription_data: {
      metadata: {
        supabase_user_id: options.userId,
      },
    },
    metadata: {
      supabase_user_id: options.userId,
    },
  })

  return session
}

/**
 * Create a customer portal session
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

/**
 * Get subscription by ID
 */
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  const updated = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  })

  return updated
}

/**
 * Get plan from price ID
 */
export function getPlanFromPriceId(priceId: string): 'free' | 'pro' | 'business' {
  if (priceId === STRIPE_PRICE_IDS.pro) return 'pro'
  if (priceId === STRIPE_PRICE_IDS.business) return 'business'
  return 'free'
}
