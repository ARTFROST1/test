/**
 * Stripe Webhook Handlers
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import Stripe from 'stripe'
import { stripe, getPlanFromPriceId, PLAN_METADATA } from './client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function constructWebhookEvent(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient()
  
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.metadata?.supabase_user_id

  if (!userId) {
    console.error('No user ID in checkout session metadata')
    return
  }

  // Get subscription details from Stripe
  const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId)
  const subscription = subscriptionResponse as unknown as Stripe.Subscription & {
    current_period_start: number
    current_period_end: number
  }
  const priceId = subscription.items.data[0].price.id
  const plan = getPlanFromPriceId(priceId)
  const metadata = plan !== 'free' ? PLAN_METADATA[plan] : null

  // Update subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan,
      status: 'active',
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      task_limit: metadata?.taskLimit ?? 5,
      storage_limit_bytes: metadata?.storageLimitBytes ?? 104857600,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Failed to update subscription:', error)
    throw error
  }

  // Log the upgrade
  await (supabase as any).from('usage_logs').insert({
    user_id: userId,
    event_type: 'subscription_upgraded',
    resource_id: subscriptionId,
    resource_type: 'subscription',
    metadata: { plan, priceId },
  })
}

/**
 * Handle customer.subscription.updated event
 */
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()
  
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0].price.id
  const plan = getPlanFromPriceId(priceId)
  const metadata = plan !== 'free' ? PLAN_METADATA[plan] : null

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    trialing: 'trialing',
    paused: 'paused',
    unpaid: 'past_due',
  }
  const status = statusMap[subscription.status] ?? 'active'

  // Access subscription periods safely
  const subAny = subscription as any
  const periodStart = subAny.current_period_start 
    ? new Date(subAny.current_period_start * 1000).toISOString() 
    : null
  const periodEnd = subAny.current_period_end 
    ? new Date(subAny.current_period_end * 1000).toISOString() 
    : null

  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan,
      status: status as any,
      task_limit: metadata?.taskLimit ?? 5,
      storage_limit_bytes: metadata?.storageLimitBytes ?? 104857600,
      current_period_start: periodStart,
      current_period_end: periodEnd,
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Failed to update subscription:', error)
    throw error
  }
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()
  
  const userId = subscription.metadata?.supabase_user_id

  // Reset to free plan
  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan: 'free',
      status: 'active',
      stripe_subscription_id: null,
      task_limit: 5,
      tasks_used_this_month: 0,
      storage_limit_bytes: 104857600,
      current_period_start: null,
      current_period_end: null,
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Failed to reset subscription:', error)
    throw error
  }

  // Log the cancellation
  if (userId) {
    await (supabase as any).from('usage_logs').insert({
      user_id: userId,
      event_type: 'subscription_canceled',
      resource_type: 'subscription',
      metadata: { previousPlan: getPlanFromPriceId(subscription.items.data[0].price.id) },
    })
  }
}

/**
 * Handle invoice.payment_failed event
 */
export async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = createAdminClient()
  
  // Access subscription from invoice (may be nested in newer Stripe API)
  const invoiceAny = invoice as any
  const subscriptionId = invoiceAny.subscription?.id || invoiceAny.subscription as string
  
  if (!subscriptionId) return

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)

  if (error) {
    console.error('Failed to update subscription status:', error)
  }
}

/**
 * Main webhook handler
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice)
      break
      
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}
