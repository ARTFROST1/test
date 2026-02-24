/**
 * Subscription API - Get current subscription
 * GET /api/subscription - Get user's subscription with limits
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ApiError, SubscriptionResponse } from '@/types/api'

/**
 * GET /api/subscription - Get current subscription
 */
export async function GET() {
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

    // Get subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error || !subscription) {
      // Create default subscription if doesn't exist
      const { data: newSubscription, error: createError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: 'free',
          status: 'active',
          task_limit: 5,
          storage_limit_bytes: 104857600, // 100MB
        })
        .select()
        .single()

      if (createError || !newSubscription) {
        return NextResponse.json<ApiError>(
          { error: 'Failed to get subscription' },
          { status: 500 }
        )
      }

      const response: SubscriptionResponse = {
        subscription: newSubscription,
        limits: {
          tasksUsed: 0,
          tasksLimit: 5,
          tasksRemaining: 5,
          storageUsed: 0,
          storageLimit: 104857600,
          storageRemaining: 104857600,
        },
      }

      return NextResponse.json(response)
    }

    const response: SubscriptionResponse = {
      subscription,
      limits: {
        tasksUsed: subscription.tasks_used_this_month,
        tasksLimit: subscription.task_limit,
        tasksRemaining: Math.max(0, subscription.task_limit - subscription.tasks_used_this_month),
        storageUsed: subscription.storage_used_bytes,
        storageLimit: subscription.storage_limit_bytes,
        storageRemaining: Math.max(0, subscription.storage_limit_bytes - subscription.storage_used_bytes),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Subscription GET error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
