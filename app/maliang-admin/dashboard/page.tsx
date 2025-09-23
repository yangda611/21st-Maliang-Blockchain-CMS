'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/supabase'
import DashboardLayout from '@/components/ui/dashboard-layout'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentAdmin()
      if (!user) {
        router.push('/maliang-admin')
      }
    }

    checkAuth()
  }, [router])

  return <DashboardLayout />
}