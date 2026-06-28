import ExecVisibility from '@/brand-craft/ExecVisibility'

// Force dynamic rendering to prevent SSR issues with React Query
export const dynamic = 'force-dynamic'

export default function ThoughtLeadershipPage() {
  return <ExecVisibility />
}

