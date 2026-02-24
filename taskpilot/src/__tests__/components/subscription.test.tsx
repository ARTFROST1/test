/**
 * Component Tests - Subscription Components
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock fetch
global.fetch = vi.fn()

vi.mock('@/components/providers/supabase-provider', () => ({
  useSupabase: () => ({
    supabase: {},
    user: { id: 'user-123', email: 'test@example.com' },
    isLoading: false,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe('Subscription Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PricingCard', () => {
    it('should render plan details', async () => {
      const mockPlan = {
        name: 'Pro',
        price: 29,
        period: 'month',
        features: [
          'Unlimited tasks',
          'Priority support',
          'Advanced AI models',
        ],
        highlighted: true,
      }

      const { PricingCard } = await import('@/components/subscription/pricing-card')
      render(<PricingCard plan={mockPlan} />)

      expect(screen.getByText('Pro')).toBeInTheDocument()
      expect(screen.getByText(/\$29/)).toBeInTheDocument()
      expect(screen.getByText('Unlimited tasks')).toBeInTheDocument()
      expect(screen.getByText('Priority support')).toBeInTheDocument()
    })

    it('should highlight featured plan', async () => {
      const mockPlan = {
        name: 'Pro',
        price: 29,
        period: 'month',
        features: ['Feature 1'],
        highlighted: true,
      }

      const { PricingCard } = await import('@/components/subscription/pricing-card')
      const { container } = render(<PricingCard plan={mockPlan} />)

      // Check for highlighted styling
      expect(container.querySelector('.border-primary, [data-highlighted="true"]')).toBeTruthy()
    })

    it('should call onSubscribe when button clicked', async () => {
      const onSubscribe = vi.fn()
      const mockPlan = {
        name: 'Pro',
        price: 29,
        period: 'month',
        features: ['Feature 1'],
        priceId: 'price_123',
      }

      const { PricingCard } = await import('@/components/subscription/pricing-card')
      render(<PricingCard plan={mockPlan} onSubscribe={onSubscribe} />)

      const subscribeButton = screen.getByRole('button', { name: /subscribe|get started|start/i })
      await userEvent.click(subscribeButton)

      expect(onSubscribe).toHaveBeenCalledWith('price_123')
    })
  })

  describe('PricingTable', () => {
    it('should render all pricing tiers', async () => {
      const { PricingTable } = await import('@/components/subscription/pricing-table')
      render(<PricingTable />)

      expect(screen.getByText(/free/i)).toBeInTheDocument()
      expect(screen.getByText(/pro/i)).toBeInTheDocument()
      expect(screen.getByText(/business/i)).toBeInTheDocument()
    })

    it('should have monthly/annual toggle', async () => {
      const { PricingTable } = await import('@/components/subscription/pricing-table')
      render(<PricingTable />)

      expect(screen.getByText(/monthly/i)).toBeInTheDocument()
      expect(screen.getByText(/annual|yearly/i)).toBeInTheDocument()
    })

    it('should show annual discount', async () => {
      const { PricingTable } = await import('@/components/subscription/pricing-table')
      render(<PricingTable />)

      // Annual billing typically shows discount
      const annualToggle = screen.getByText(/annual|yearly/i)
      await userEvent.click(annualToggle)

      expect(screen.getByText(/save|discount/i)).toBeInTheDocument()
    })
  })

  describe('CurrentPlan', () => {
    it('should show current plan info', async () => {
      const mockSubscription = {
        plan_name: 'Pro',
        tasks_used: 50,
        tasks_limit: 100,
        renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const { CurrentPlan } = await import('@/components/subscription/current-plan')
      render(<CurrentPlan subscription={mockSubscription} />)

      expect(screen.getByText('Pro')).toBeInTheDocument()
      expect(screen.getByText(/50/)).toBeInTheDocument()
    })

    it('should show upgrade button for free users', async () => {
      const mockSubscription = {
        plan_name: 'Free',
        tasks_used: 3,
        tasks_limit: 5,
        renewal_date: null,
      }

      const { CurrentPlan } = await import('@/components/subscription/current-plan')
      render(<CurrentPlan subscription={mockSubscription} />)

      expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument()
    })
  })

  describe('UsageMeter', () => {
    it('should render usage bar', async () => {
      const { UsageMeter } = await import('@/components/subscription/usage-meter')
      render(<UsageMeter used={50} limit={100} label="Tasks" />)

      expect(screen.getByText('Tasks')).toBeInTheDocument()
      expect(screen.getByText('50 / 100')).toBeInTheDocument()
    })

    it('should show warning when near limit', async () => {
      const { UsageMeter } = await import('@/components/subscription/usage-meter')
      render(<UsageMeter used={90} limit={100} label="Tasks" />)

      // Should have warning color or text
      expect(screen.getByText(/90/)).toBeInTheDocument()
    })

    it('should show error when at limit', async () => {
      const { UsageMeter } = await import('@/components/subscription/usage-meter')
      render(<UsageMeter used={100} limit={100} label="Tasks" />)

      expect(screen.getByText(/limit reached|upgrade/i)).toBeInTheDocument()
    })
  })

  describe('UpgradeModal', () => {
    it('should render when open', async () => {
      const { UpgradeModal } = await import('@/components/subscription/upgrade-modal')
      render(<UpgradeModal open={true} onClose={() => {}} />)

      expect(screen.getByText(/upgrade/i)).toBeInTheDocument()
    })

    it('should not render when closed', async () => {
      const { UpgradeModal } = await import('@/components/subscription/upgrade-modal')
      render(<UpgradeModal open={false} onClose={() => {}} />)

      expect(screen.queryByText(/upgrade/i)).not.toBeInTheDocument()
    })

    it('should call onClose when dismissed', async () => {
      const onClose = vi.fn()
      const { UpgradeModal } = await import('@/components/subscription/upgrade-modal')
      render(<UpgradeModal open={true} onClose={onClose} />)

      const closeButton = screen.getByRole('button', { name: /close|cancel|dismiss/i })
      await userEvent.click(closeButton)

      expect(onClose).toHaveBeenCalled()
    })

    it('should initiate checkout when plan selected', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: 'https://checkout.stripe.com/...' }),
      } as Response)

      const { UpgradeModal } = await import('@/components/subscription/upgrade-modal')
      render(<UpgradeModal open={true} onClose={() => {}} />)

      const proButton = screen.getByRole('button', { name: /select pro|choose pro/i })
      await userEvent.click(proButton)

      expect(fetch).toHaveBeenCalledWith(
        '/api/subscription/checkout',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
